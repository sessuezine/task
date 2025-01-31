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
    <div className="p-6">
      {/* AI Summary Card */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex-shrink-0" />
          <p className="text-blue-600">
            Hey! You have {todoTasks.length} tasks To Do and {inProgressTasks.length} tasks In Progress. 
            {inProgressTasks.length > 0 ? " Keep up the good work! Remember to start with the tasks in progress to make progress faster." : ""}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button 
          onClick={() => setIsFormOpen(true)} 
          className="btn-primary"
        >
          Add Task
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`py-2 px-1 border-b-2 ${
              activeTab === 'kanban'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 ${
              activeTab === 'overview'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-3 gap-4">
          {/* Todo Column */}
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
              To Do
              <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                {todoTasks.length}
              </span>
            </h2>
            <div className="space-y-2">
              {todoTasks.map(task => (
                <div key={task.id} className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
              In Progress
              <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                {inProgressTasks.length}
              </span>
            </h2>
            <div className="space-y-2">
              {inProgressTasks.map(task => (
                <div key={task.id} className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Done Column */}
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
              Done
              <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                {doneTasks.length}
              </span>
            </h2>
            <div className="space-y-2">
              {doneTasks.map(task => (
                <div key={task.id} className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Task Overview</h2>
          {/* Add overview content */}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
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