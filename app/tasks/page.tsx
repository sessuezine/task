'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Task, NewTask } from '@/src/lib/types'
import TaskForm from '@/components/TaskForm'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'kanban' | 'overview'>('kanban')
  const supabase = createClientComponentClient()

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
      if (data) setTasks(data)
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

  const todoTasks = tasks.filter(t => t.time_slot === 'todo')
  const inProgressTasks = tasks.filter(t => t.time_slot === 'in_progress')
  const doneTasks = tasks.filter(t => t.time_slot === 'done')

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Task Summary */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Add Task
          </button>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100" />
            <div>
              <h2 className="font-medium">Task Summary</h2>
              <p className="text-sm text-gray-600">
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
            className={`pb-2 px-1 ${
              activeTab === 'kanban'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-1 ${
              activeTab === 'overview'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500'
            }`}
          >
            Overview
          </button>
        </div>
      </div>

      {activeTab === 'kanban' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Todo Column */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">To Do</h3>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                {todoTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {todoTasks.map(task => (
                <div key={task.id} className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">In Progress</h3>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                {inProgressTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map(task => (
                <div key={task.id} className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Done Column */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Done</h3>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                {doneTasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {doneTasks.map(task => (
                <div key={task.id} className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Statistics in 3 columns */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600">Total Tasks</div>
              <div className="text-2xl font-semibold">{tasks.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600">Completed</div>
              <div className="text-2xl font-semibold">{doneTasks.length}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-600">In Progress</div>
              <div className="text-2xl font-semibold">{inProgressTasks.length}</div>
            </div>
          </div>

          {/* All Tasks full width below */}
          <div>
            <h3 className="font-medium mb-4">All Tasks</h3>
            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <span>{task.title}</span>
                  <span className="text-sm text-gray-500">{task.time_slot}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <TaskForm 
              onSubmit={handleCreateTask}
              onClose={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}