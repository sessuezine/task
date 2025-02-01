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
import { KanbanColumn } from '@/components/KanbanColumn'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  days_of_week?: number[];    // e.g., [1,3,5] for Mon,Wed,Fri
  time_of_day?: string;       // Optional reminder time
  checklist: {
    id: string;
    title: string;
  }[];
  category?: string;
  status: 'active' | 'archived';
}

interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: Date;
  completion_value: number;    // How many items completed
  completed_items: string[];   // IDs of completed checklist items
  notes?: string;
}

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
  }, [])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const todoTasks = tasks.filter(t => t.time_slot === 'todo')
  const inProgressTasks = tasks.filter(t => t.time_slot === 'in_progress')
  const doneTasks = tasks.filter(t => t.time_slot === 'done')

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (!over) return

    const activeTask = tasks.find(task => task.id === active.id)
    const newStatus = over.id

    if (activeTask && activeTask.time_slot !== newStatus) {
      try {
        await supabase
          .from('tasks')
          .update({ time_slot: newStatus })
          .eq('id', active.id)
        
        fetchTasks()
      } catch (error) {
        console.error('Error updating task:', error)
      }
    }

    setActiveId(null)
  }

  const handleCreateTask = async (newTask: NewTask) => {
    const { error } = await supabase
      .from('tasks')
      .insert([{
        ...newTask,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])

    if (error) {
      console.error('Error creating task:', error)
      return
    }

    fetchTasks()
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

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <div className="grid grid-cols-3 gap-6">
            <KanbanColumn
              title="To Do"
              tasks={todoTasks}
              id="todo"
              fetchTasks={fetchTasks}
            />
            <KanbanColumn
              title="In Progress"
              tasks={inProgressTasks}
              id="in_progress"
              fetchTasks={fetchTasks}
            />
            <KanbanColumn
              title="Done"
              tasks={doneTasks}
              id="done"
              fetchTasks={fetchTasks}
            />
          </div>
        </TabsContent>

        <TabsContent value="overview">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm text-blue-600 mb-2">Total Tasks</h3>
              <p className="text-2xl font-semibold">{tasks.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm text-green-600 mb-2">Completed</h3>
              <p className="text-2xl font-semibold">
                {tasks.filter(t => t.time_slot === 'done').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm text-yellow-600 mb-2">In Progress</h3>
              <p className="text-2xl font-semibold">
                {tasks.filter(t => t.time_slot === 'in progress').length}
              </p>
            </div>
          </div>

          {/* Task List */}
          <div>
            <h3 className="font-medium mb-4">All Tasks</h3>
            <div className="space-y-2">
              {tasks.map(task => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                >
                  <span>{task.title}</span>
                  <span className="text-sm text-[--text-secondary] capitalize">
                    {task.time_slot.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

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