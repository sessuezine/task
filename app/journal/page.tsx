'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { MoodSelector, moods } from '@/components/MoodSelector'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

interface JournalEntry {
  id: string
  content: string
  original_content: string
  created_at: string
  updated_at?: string
  mood: string
  ai_summary?: string
  tags: string[]
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
  const [currentTag, setCurrentTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)

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
      if (editingEntry) {
        await supabase
          .from('journal_entries')
          .update({
            content: content.trim(),
            mood,
            tags,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEntry.id)
        
        setEditingEntry(null)
      } else {
        const user = await supabase.auth.getUser()
        console.log('Current user:', user)

        const newEntry = {
          content: content.trim(),
          original_content: content.trim(),
          mood,
          user_id: user.data.user?.id,
          tags: [...tags, currentTag.trim()],
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
      }
      
      setContent('')
      setMood(null)
      setTags([])
      setCurrentTag('')
      await fetchEntries()
    } catch (error) {
      console.error('Error saving entry:', error)
    }
  }

  const handleSave = async () => {
    if (!editingEntry) return

    try {
      const updates: any = {
        content: editingEntry.content,
        mood: editingEntry.mood,
        tags: editingEntry.tags,
      }
      
      // Only add updated_at if content has changed
      if (editingEntry.content !== editingEntry.original_content) {
        updates.updated_at = new Date().toISOString()
      }

      await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', editingEntry.id)
      
      await fetchEntries()
      setEditingEntry(null)
      setSelectedEntry(null)
    } catch (error) {
      console.error('Error updating entry:', error)
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

  const handleDelete = async (id: string) => {
    try {
      await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
      
      await fetchEntries()
    } catch (error) {
      console.error('Error deleting entry:', error)
    }
  }

  return (
    <div className="p-[--spacing-base] max-w-7xl mx-auto">
      <div className="bg-[--bg-card] rounded-lg flex justify-between items-center h-10 mb-6">
        <h1 className="text-2xl font-semibold">Journal</h1>
        <span className="text-[--text-secondary]">{entries.length} entries</span>
      </div>

      <Tabs defaultValue="entries">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="entries">Entries ({entries.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <div className="bg-[--bg-card] rounded-lg shadow-sm">
            {/* Tags input */}
            <div className="flex justify-end mb-4">
              <div className="relative w-[200px]">
                <input
                  type="text"
                  placeholder="Add tags..."
                  className="w-full bg-transparent border rounded-lg px-3 py-1"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && currentTag.trim()) {
                      setTags([...tags, currentTag.trim()])
                      setCurrentTag('')
                    }
                  }}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span key={tag} className="bg-[--bg-task] px-2 py-1 rounded-full text-sm">
                      {tag} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <MoodSelector selected={mood} onSelect={setMood} />
            
            {/* Updated text area with border and padding */}
            <div className="mt-4 border rounded-lg">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.shiftKey && mood) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="What's on your mind? Feel free to write as much as you'd like... (Shift+Enter to post)"
                className="w-full bg-transparent border-none focus:ring-0 resize-none p-4"
                rows={8}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="entries">
          {/* Search and filter controls */}
          <div className="flex justify-between items-center gap-4 mb-8">
            <div className="relative flex-1 w-3/4">
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                className="w-full bg-transparent border rounded-lg px-3 py-2 placeholder:text-[--text-secondary]"
              />
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

          {/* Entries list - contained within viewport */}
          <div className="h-[calc(100vh-16rem)]">
            {/* Entries list */}
            <div className="space-y-8">
              {Object.entries(
                entries
                  .filter(entry => 
                    !searchQuery || 
                    entry.content.toLowerCase().includes(searchQuery) ||
                    entry.tags.some(tag => tag.toLowerCase().includes(searchQuery))
                  )
                  .reduce((groups, entry) => {
                    const date = new Date(entry.created_at).toDateString()
                    if (!groups[date]) groups[date] = []
                    groups[date].push(entry)
                    return groups
                  }, {} as Record<string, JournalEntry[]>)
              ).map(([date, entries]: [string, JournalEntry[]]) => (
                <div key={date}>
                  <h3 className="text-lg font-medium mb-4">
                    {formatDate(date)}
                  </h3>
                  <div className="space-y-4">
                    {entries.map(entry => (
                      <div 
                        key={entry.id} 
                        className="bg-[--bg-card] p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setSelectedEntry(entry)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{moods.find(m => m.value === entry.mood)?.emoji}</span>
                            <p className="line-clamp-2">{entry.content.split('.')[0]}</p>
                          </div>
                          <span className="text-[--text-secondary] text-sm">
                            {new Date(entry.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        {entry.tags?.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {entry.tags.map((tag: string) => (
                              <span key={tag} className="bg-[--bg-task] px-2 py-1 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Entry Modal */}
          {selectedEntry && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[51]">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-3xl">{moods.find(m => m.value === selectedEntry.mood)?.emoji}</span>
                    {selectedEntry.updated_at && selectedEntry.content !== selectedEntry.original_content && (
                      <div className="mt-2 text-xs text-[--text-secondary]">
                        last edited {new Date(selectedEntry.updated_at).toLocaleString()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        if (editingEntry) {
                          handleSave()
                        } else {
                          setEditingEntry(selectedEntry)
                        }
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {editingEntry ? 'Save' : 'Edit'}
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Are you sure you want to delete this entry?')) {
                          handleDelete(selectedEntry.id)
                          setSelectedEntry(null)
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                    <button onClick={() => {
                      setSelectedEntry(null)
                      setEditingEntry(null)
                    }}>×</button>
                  </div>
                </div>
                {editingEntry ? (
                  <textarea
                    value={editingEntry.content}
                    onChange={(e) => setEditingEntry({
                      ...editingEntry,
                      content: e.target.value
                    })}
                    className="w-full bg-transparent border rounded-lg p-4 mb-4"
                    rows={8}
                  />
                ) : (
                  <p className="whitespace-pre-wrap mb-4">{selectedEntry.content}</p>
                )}
                {selectedEntry.tags?.length > 0 && (
                  <div className="flex gap-2">
                    {selectedEntry.tags.map((tag: string) => (
                      <span key={tag} className="bg-[--bg-task] px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
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