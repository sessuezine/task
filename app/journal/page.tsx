'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { MoodSelector, moods } from '@/components/MoodSelector'

interface JournalEntry {
  id: string
  content: string
  created_at: string
  mood: string
  ai_summary?: string
}

export default function JournalPage() {
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<string | null>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const supabase = createClientComponentClient()

  const fetchEntries = useCallback(async () => {
    try {
      const [year, month] = selectedMonth.split('-')
      const startDate = new Date(+year, +month - 1, 1)
      const endDate = new Date(+year, +month + 1, 0)
      
      console.log('Date range:', {
        selectedMonth,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        currentDate: new Date().toISOString()
      })

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error
      console.log('Fetched entries:', data)
      if (data) setEntries(data)
    } catch (error) {
      console.error('Error fetching entries:', error)
    }
  }, [selectedMonth, supabase])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  // Get unique months from entries for the dropdown
  const getAvailableMonths = () => {
    const months = new Set<string>()
    entries.forEach(entry => {
      const date = new Date(entry.created_at)
      months.add(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`)
    })
    return Array.from(months).sort().reverse()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !mood) return

    try {
      const user = await supabase.auth.getUser()
      console.log('Current user:', user)

      const newEntry = {
        content: content.trim(),
        mood,
        user_id: user.data.user?.id,
        tags: []
      }
      console.log('Attempting to insert:', newEntry)

      const { data, error } = await supabase
        .from('journal_entries')
        .insert(newEntry)
        .select()

      if (error) {
        console.error('Error details:', error)
        throw error
      }
      
      console.log('Inserted entry:', data)
      setContent('')
      setMood(null)
      await fetchEntries()
    } catch (error) {
      console.error('Error creating entry:', error)
    }
  }

  // Group entries by day
  const groupEntriesByDay = () => {
    const groups = entries.reduce((acc, entry) => {
      const date = new Date(entry.created_at).toDateString()
      if (!acc[date]) acc[date] = []
      acc[date].push(entry)
      return acc
    }, {} as Record<string, JournalEntry[]>)
    
    return Object.entries(groups).sort((a, b) => 
      new Date(b[0]).getTime() - new Date(a[0]).getTime()
    )
  }

  return (
    <div className="p-[--spacing-base] max-w-7xl mx-auto">
      {/* Header with Summary */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Journal</h1>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-[--bg-card] border-none rounded-lg px-3 py-2 w-[180px] h-[40px]"
          >
            {getAvailableMonths().map(month => (
              <option key={month} value={month}>
                {new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-[--bg-card] rounded-lg p-4 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[--bg-task]" />
          <div>
            <h2 className="font-medium">Journal Summary</h2>
            <p className="text-[--text-secondary] text-sm">
              You&apos;ve written {entries.length} entries this month. Most common mood: {getMostCommonMood(entries)}
            </p>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-[--bg-card] rounded-lg p-4 shadow-sm">
          <MoodSelector selected={mood} onSelect={setMood} />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && mood) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="What's on your mind?"
            className="w-full bg-transparent border-none focus:ring-0 resize-none"
            rows={3}
          />
          {!mood && content && (
            <p className="text-amber-500 text-sm mt-2">Please select a mood before submitting</p>
          )}
        </div>
      </form>

      {/* Entries by Day */}
      <div className="space-y-8">
        {groupEntriesByDay().map(([date, dayEntries]) => (
          <div key={date}>
            <h3 className="text-lg font-medium mb-4">{formatDate(date)}</h3>
            <div className="space-y-4">
              {dayEntries.map(entry => (
                <div key={entry.id} className="bg-[--bg-card] p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" title={entry.mood}>
                        {moods.find(m => m.value === entry.mood)?.emoji}
                      </span>
                      <p className="whitespace-pre-wrap">{entry.content}</p>
                    </div>
                    <span className="text-[--text-secondary] text-sm">
                      {new Date(entry.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  {entry.ai_summary && (
                    <div className="mt-4 p-3 bg-[--bg-task] rounded-md">
                      <p className="text-sm text-[--text-secondary]">
                        AI Summary: {entry.ai_summary}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper functions
function getMostCommonMood(entries: JournalEntry[]) {
  if (!entries.length) return 'No entries yet'
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mostCommonMood = Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)[0][0]
  
  return moods.find(m => m.value === mostCommonMood)?.emoji || 'Unknown'
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('default', { 
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
} 