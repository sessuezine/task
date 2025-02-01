'use client';

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Habit } from '@/src/lib/types'

export default function HabitsPage() {
  const supabase = createClientComponentClient()
  const [habits, setHabits] = useState<Habit[]>([])
  const [contributions, setContributions] = useState<Record<string, number>>({})
  const currentYear = new Date().getFullYear()

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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Habits</h1>
        <button className="bg-black text-white px-4 py-2 rounded-lg">
          Add Habit
        </button>
      </div>

      {/* Contribution Grid */}
      <div className="bg-[--bg-card] p-6 rounded-lg mb-8">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map(habit => (
          <div key={habit.id} className="bg-[--bg-card] p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">{habit.title}</h3>
              <span className="text-sm bg-[--bg-task] px-3 py-1 rounded-full">
                {habit.frequency}
              </span>
            </div>
            <p className="text-sm text-[--text-secondary] mb-4">
              {habit.description}
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Current Streak</p>
                <p className="text-2xl font-bold">{habit.current_streak} days</p>
              </div>
              <button className="bg-[--bg-task] px-4 py-2 rounded-lg">
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 