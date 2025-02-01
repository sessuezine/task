'use client'

import { useState } from 'react'
import { Task, NewTask } from '@/src/lib/types'

interface TaskFormProps {
  onSubmit: (task: NewTask) => Promise<void>
  onClose: () => void
}

export default function TaskForm({ onSubmit, onClose }: TaskFormProps) {
  const [task, setTask] = useState<NewTask>({
    title: '',
    description: '',
    time_slot: 'todo',
    deadline: undefined,
    type: 'task',
    tags: []
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newTask = {
      title: task.title,
      description: task.description,
      time_slot: 'todo' as const,
      deadline: task.deadline,
      type: 'task' as const,  // Specify literal type
      tags: []
    }

    await onSubmit(newTask)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div>
        <label htmlFor="title" className="form-label">Title</label>
        <input
          type="text"
          id="title"
          className="form-input"
          value={task.title}
          onChange={(e) => setTask({ ...task, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          className="form-input"
          value={task.description || ''}
          onChange={(e) => setTask({ ...task, description: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="deadline" className="form-label">Deadline</label>
        <input
          type="datetime-local"
          id="deadline"
          className="form-input"
          onChange={(e) => setTask({ ...task, deadline: e.target.value ? new Date(e.target.value) : undefined })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Create Task
        </button>
      </div>
    </form>
  )
} 