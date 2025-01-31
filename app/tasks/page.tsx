'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Task, NewTask } from '@/src/lib/types'
import TaskForm from '@/components/TaskForm'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button 
          onClick={() => setIsFormOpen(true)} 
          className="btn-primary"
        >
          Add Task
        </button>
      </div>

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