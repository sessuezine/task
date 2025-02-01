'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface HabitFormData {
  title: string;
  description?: string;
  checklist: { id: string; title: string; completed: boolean; }[];
  frequency: 'daily' | 'weekly' | 'monthly';
}

interface HabitFormProps {
  onSubmit: (data: HabitFormData) => void;
  onClose: () => void;
}

export function HabitForm({ onSubmit, onClose }: HabitFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [checklist, setChecklist] = useState([
    { id: uuidv4(), title: '', completed: false }
  ])

  const addChecklistItem = () => {
    setChecklist(prev => [...prev, { id: uuidv4(), title: '', completed: false }])
  }

  const removeChecklistItem = (id: string) => {
    setChecklist(prev => prev.filter(item => item.id !== id))
  }

  const updateChecklistItem = (id: string, title: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, title } : item
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      frequency,
      checklist: checklist.filter(item => item.title.trim() !== '')
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[--bg-card] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Habit</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-2 rounded-lg bg-[--bg-task]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2 rounded-lg bg-[--bg-task]"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={e => setFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
              className="w-full p-2 rounded-lg bg-[--bg-task]"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Checklist</label>
            <div className="space-y-2">
              {checklist.map(item => (
                <div key={item.id} className="flex gap-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={e => updateChecklistItem(item.id, e.target.value)}
                    placeholder="Checklist item"
                    className="flex-1 p-2 rounded-lg bg-[--bg-task]"
                  />
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(item.id)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addChecklistItem}
                className="text-sm text-[--text-secondary] hover:text-[--text-primary]"
              >
                + Add Item
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[--text-secondary] hover:text-[--text-primary]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[--bg-task] rounded-lg hover:bg-opacity-80"
            >
              Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 