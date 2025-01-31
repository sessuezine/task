'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  DndContext, 
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  closestCorners
} from '@dnd-kit/core'
import { Task, NewTask } from '@/src/lib/types'
import TaskForm from '@/components/TaskForm'
import { KanbanColumn } from '../../components/KanbanColumn'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'kanban' | 'overview'>('kanban')
  const supabase = createClientComponentClient()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    fetchTasks()
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session:', session)
      if (!session) {
        // Redirect to login if not authenticated
        window.location.href = '/login'
      }
    }
    checkAuth()
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current user ID:', user?.id)
    }
    checkUser()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) {
        console.log('Fetched tasks:', data)
        console.log('Task time_slots:', data.map(t => t.time_slot))
        setTasks(data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const handleCreateTask = async (newTask: NewTask) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current user:', user)
      
      const taskWithUser = {
        ...newTask,
        user_id: user?.id
      }
      console.log('Attempting to create task:', taskWithUser)
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskWithUser])
        .select()
        .single()

      console.log('Response:', { data, error })
      
      if (error) throw error
      if (data) {
        await fetchTasks()
        setIsFormOpen(false)
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const todoTasks = tasks.filter(t => {
    console.log('Checking task:', t.title, 'time_slot:', t.time_slot)
    return t.time_slot === 'todo'
  })
  const inProgressTasks = tasks.filter(t => t.time_slot === 'in_progress')
  const doneTasks = tasks.filter(t => t.time_slot === 'done')

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (!over || !active) return

    const validStatuses = ['todo', 'in_progress', 'done']
    if (!validStatuses.includes(over.id)) return

    try {
      await supabase
        .from('tasks')
        .update({ time_slot: over.id })
        .eq('id', active.id)
      
      fetchTasks()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  return (
    <div className="p-[--spacing-base] max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <button onClick={() => setIsFormOpen(true)} className="add-task-button">
            Add Task
          </button>
        </div>

        <div className="bg-[--bg-card] rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[--bg-task]" />
            <div>
              <h2 className="font-medium">Task Summary</h2>
              <p className="text-[--text-secondary] text-sm">
                You have {todoTasks.length} tasks To Do and {inProgressTasks.length} tasks In Progress. Keep up the good work!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`tab-button ${
              activeTab === 'kanban' ? 'tab-button-active' : 'tab-button-inactive'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`tab-button ${
              activeTab === 'overview' ? 'tab-button-active' : 'tab-button-inactive'
            }`}
          >
            Overview
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'kanban' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-3 gap-6">
            <KanbanColumn
              title="To Do"
              tasks={todoTasks}
              id="todo"
            />
            <KanbanColumn
              title="In Progress"
              tasks={inProgressTasks}
              id="in_progress"
            />
            <KanbanColumn
              title="Done"
              tasks={doneTasks}
              id="done"
            />
          </div>
        </DndContext>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="stats-card bg-blue-50">
              <div className="text-[--color-todo] text-sm">Total Tasks</div>
              <div className="text-2xl font-semibold">{tasks.length}</div>
            </div>
            <div className="stats-card bg-green-50">
              <div className="text-[--color-done] text-sm">Completed</div>
              <div className="text-2xl font-semibold">{doneTasks.length}</div>
            </div>
            <div className="stats-card bg-yellow-50">
              <div className="text-[--color-progress] text-sm">In Progress</div>
              <div className="text-2xl font-semibold">{inProgressTasks.length}</div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">All Tasks</h3>
            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id} className="task-card flex items-center justify-between">
                  <span>{task.title}</span>
                  <span className="text-[--text-secondary] text-sm">{task.time_slot}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isFormOpen && (
        <div className="modal-backdrop">
          <div className="bg-[--bg-card] rounded-lg w-full max-w-md">
            <TaskForm 
              onSubmit={async (newTask) => {
                await handleCreateTask(newTask)
                setIsFormOpen(false)
              }}
              onClose={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}