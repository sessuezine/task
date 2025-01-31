'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function JournalPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setEntries(data)
    } catch (error) {
      console.error('Error fetching entries:', error)
    }
  }

  return (
    <div className="p-[--spacing-base] max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Journal</h1>
          <button onClick={() => setIsFormOpen(true)} className="add-task-button">
            New Entry
          </button>
        </div>

        <div className="bg-[--bg-card] rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[--bg-task]" />
            <div>
              <h2 className="font-medium">Journal Summary</h2>
              <p className="text-[--text-secondary] text-sm">
                You have written {entries.length} journal entries. Keep reflecting!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {entries.map(entry => (
          <div key={entry.id} className="bg-[--bg-card] p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium">{entry.content?.split('\n')[0]}</h3>
              <span className="text-[--text-secondary] text-sm">
                {new Date(entry.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-[--text-secondary] whitespace-pre-wrap">
              {entry.content?.split('\n').slice(1).join('\n')}
            </p>
            {entry.ai_summary && (
              <div className="mt-4 p-3 bg-[--bg-task] rounded-md">
                <p className="text-sm text-[--text-secondary]">AI Summary: {entry.ai_summary}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal will go here */}
    </div>
  )
} 