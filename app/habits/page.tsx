'use client';

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Habit, HabitFormData } from '@/src/lib/types'
import { HabitForm } from '@/components/HabitForm'

export default function HabitsPage() {
  const supabase = createClientComponentClient()
  const [habits, setHabits] = useState<Habit[]>([])
  const [contributions, setContributions] = useState<Record<string, number>>({})
  const currentYear = new Date().getFullYear()
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    const fetchHabits = async () => {
      const { data } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setHabits(data)
    }

    const fetchContributions = async () => {
      const { data } = await supabase
        .from('habit_completions')
        .select('completed_at')
      
      const counts: Record<string, number> = {}
      data?.forEach(completion => {
        const date = new Date(completion.completed_at).toISOString().split('T')[0]
        counts[date] = (counts[date] || 0) + 1
      })
      setContributions(counts)
    }

    fetchHabits()
    fetchContributions()
  }, [supabase])

  function getContributionColor(count: number): string {
    if (count === 0) return 'bg-[--bg-task]'
    if (count <= 1) return 'bg-green-100'
    if (count <= 2) return 'bg-green-300'
    if (count <= 3) return 'bg-green-500'
    return 'bg-green-700'
  }

  function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate()
  }

  function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
  }

  const handleCreateHabit = async (data: HabitFormData) => {
    const { data: habit, error } = await supabase
      .from('habits')
      .insert([{
        ...data,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        status: 'active',
        created_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating habit:', error)
      return
    }

    setHabits(prev => [habit, ...prev])
    setIsFormOpen(false)
  }

  return (
    <div className="p-[--spacing-base] max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Habits</h1>
          <button onClick={() => setIsFormOpen(true)} className="add-task-button">
            Add Habit
          </button>
        </div>

        <div className="bg-[--bg-card] rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[--bg-task]" />
            <div>
              <h2 className="font-medium">Habit Summary</h2>
              <p className="text-[--text-secondary] text-sm">
                You have {habits.length} active habits. Keep up the good work!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Grid */}
      <div className="bg-[--bg-card] rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
        
        {/* Month labels */}
        <div className="flex mb-2 text-sm text-[--text-secondary]">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
            <div key={month} style={{ 
              width: `${Math.ceil(getDaysInMonth(currentYear, index + 1) / 7) * 20}px`,
              marginRight: '8px'
            }}>
              {month}
            </div>
          ))}
        </div>

        {/* Contribution cells */}
        <div className="flex gap-2">
          {[...Array(12)].map((_, monthIndex) => {
            const daysInMonth = getDaysInMonth(currentYear, monthIndex + 1)
            const weeksInMonth = Math.ceil(daysInMonth / 7)
            
            return (
              <div key={monthIndex} 
                   className="grid grid-rows-7 grid-flow-col gap-1"
                   style={{ width: `${weeksInMonth * 20}px` }}>
                {[...Array(daysInMonth)].map((_, dayIndex) => {
                  const date = new Date(currentYear, monthIndex, dayIndex + 1)
                  const dateStr = date.toISOString().split('T')[0]
                  const contributionCount = contributions[dateStr] || 0
                  
                  return (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${getContributionColor(contributionCount)}`}
                      title={`${contributionCount} contributions on ${dateStr}`}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-sm text-[--text-secondary]">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Active Habits */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map(habit => (
          <div key={habit.id} className="bg-[--bg-card] p-4 rounded-lg">
            <h3 className="font-medium">{habit.title}</h3>
            {habit.description && (
              <p className="text-[--text-secondary] text-sm mt-1">{habit.description}</p>
            )}
            <div className="mt-3">
              <div className="text-sm text-[--text-secondary]">
                Schedule: {habit.schedule.type === 'daily' ? 'Daily' : habit.schedule.type === 'weekly' ? 'Weekly' : 'Monthly'}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {habit.schedule.type === 'daily' ? (
                  <span className="px-2 py-1 bg-[--bg-task] rounded-full text-xs">Every day</span>
                ) : habit.schedule.type === 'weekly' ? (
                  habit.schedule.days.map(day => (
                    <span key={day} className="px-2 py-1 bg-[--bg-task] rounded-full text-xs">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}
                    </span>
                  ))
                ) : (
                  habit.schedule.days.map(day => (
                    <span key={day} className="px-2 py-1 bg-[--bg-task] rounded-full text-xs">
                      Day {day}
                    </span>
                  ))
                )}
              </div>
            </div>
            {habit.checklist.length > 0 && (
              <div className="mt-3">
                <div className="text-sm text-[--text-secondary] mb-2">Checklist:</div>
                <div className="space-y-1">
                  {habit.checklist.map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input type="checkbox" className="form-checkbox" />
                      <span className="text-sm">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isFormOpen && (
        <HabitForm
          onSubmit={handleCreateHabit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  )
} 