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
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  
  const supabase = createClientComponentClient()

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-[--bg-card] rounded-lg flex justify-between items-center h-10 px-4">
        <h1 className="text-2xl font-semibold">Schedule</h1>
        
        <Tabs defaultValue="day">
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <TabsContent value="day">
            <div>{/* Day view content */}</div>
          </TabsContent>
          <TabsContent value="week">
            <div>{/* Week view content */}</div>
          </TabsContent>
          <TabsContent value="month">
            <div>{/* Month view content */}</div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* ... rest of schedule content ... */}
    </div>
  )
} 