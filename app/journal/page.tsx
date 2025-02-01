'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { MoodSelector, moods } from '@/components/MoodSelector'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

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
  const [availableMonths, setAvailableMonths] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const supabase = createClientComponentClient()

  const fetchEntries = useCallback(async () => {
    try {
      const [year, month] = selectedMonth.split('-')
      const startDate = new Date(+year, +month - 1, 1)
      const endDate = new Date(+year, +month, 0, 23, 59, 59, 999)
      
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

  // Get all available months with entries
  const fetchAvailableMonths = useCallback(async () => {
    const { data } = await supabase
      .from('journal_entries')
      .select('created_at')
      .order('created_at', { ascending: false })

    const months = new Set<string>()
    
    // Always add current month (February 2025)
    const now = new Date()
    months.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
    
    // Add January 2025 (previous month)
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1)
    months.add(`${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`)

    const sortedMonths = Array.from(months).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number)
      const [yearB, monthB] = b.split('-').map(Number)
      if (yearA !== yearB) return yearB - yearA
      return monthB - monthA
    })

    setAvailableMonths(sortedMonths)
    return sortedMonths
  }, [supabase])

  // Update initial state
  useEffect(() => {
    const initializeMonth = async () => {
      const months = await fetchAvailableMonths()
      if (months.length > 0) {
        setSelectedMonth(months[0])
      }
    }
    initializeMonth()
  }, [fetchAvailableMonths])

  // Fetch entries when month changes
  useEffect(() => {
    fetchEntries()
  }, [selectedMonth, fetchEntries])

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
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Journal</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[--text-secondary]">
              {entries.length} entries
            </span>
          </div>
        </div>

        <Tabs defaultValue="posts">
          <TabsList className="mb-6">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="entries">Entries ({entries.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            {/* Simple post interface */}
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
            </div>
          </TabsContent>

          <TabsContent value="entries">
            {/* Search and filter controls */}
            <div className="flex justify-between items-center mb-8 gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search entries..."
                  className="w-full bg-[--bg-card] border-none rounded-lg px-3 py-2 pl-10"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-secondary]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-[--bg-card] border-none rounded-lg px-3 py-2 w-[180px]"
              >
                {availableMonths.map(month => {
                  const [year, monthNum] = month.split('-')
                  const date = new Date(+year, +monthNum - 1)
                  return (
                    <option key={month} value={month}>
                      {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Entries list */}
            <div className="space-y-8">
              {groupEntriesByDay()
                .filter(([_, entries]) => 
                  !searchQuery || entries.some(entry => 
                    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                )
                .map(([date, dayEntries]) => (
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
          </TabsContent>
        </Tabs>
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