'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ScheduleEvent {
  id: string
  title: string
  start_time: string
  end_time: string
  type: 'task' | 'habit' | 'deadline'
  status: 'pending' | 'completed'
  color?: string
}

export default function SchedulePage() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  
  const supabase = createClientComponentClient()

  return (
    <div className="p-[--spacing-base] max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Schedule</h1>
          <div className="flex items-center gap-4">
            <Tabs defaultValue={view}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
              <TabsContent value="day">
                {/* Day view content */}
                <div className="space-y-4">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="flex items-start gap-4 py-2 border-t">
                      <span className="text-sm text-[--text-secondary] w-16">
                        {`${String(i).padStart(2, '0')}:00`}
                      </span>
                      <div className="flex-1 min-h-[3rem] rounded hover:bg-[--bg-hover] transition-colors">
                        {/* Events will go here */}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="week">
                <div>
                  {/* Week view content */}
                </div>
              </TabsContent>
              <TabsContent value="month">
                <div>
                  {/* Month view content */}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="bg-[--bg-card] rounded-lg p-6">
          {/* Date Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() - 1)
                setSelectedDate(newDate)
              }}
              className="text-[--text-secondary]"
            >
              ←
            </button>
            <h2 className="text-lg font-medium">
              {selectedDate.toLocaleDateString('default', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </h2>
            <button 
              onClick={() => {
                const newDate = new Date(selectedDate)
                newDate.setDate(newDate.getDate() + 1)
                setSelectedDate(newDate)
              }}
              className="text-[--text-secondary]"
            >
              →
            </button>
          </div>

          {/* Time Grid - 24 hour format */}
          <div className="space-y-4">
            {Array.from({ length: 24 }, (_, i) => (
              <div 
                key={i} 
                className="flex items-start gap-4 py-2 border-t"
              >
                <span className="text-sm text-[--text-secondary] w-16">
                  {`${String(i).padStart(2, '0')}:00`}
                </span>
                <div className="flex-1 min-h-[3rem] rounded hover:bg-[--bg-hover] transition-colors">
                  {/* Events will go here */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 