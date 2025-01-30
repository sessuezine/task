'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import type { Value } from 'react-calendar/dist/cjs/shared/types';

export default function DashboardPage() {
  const [date, setDate] = useState<Value>(new Date());

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tasks Overview */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Tasks Overview</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-blue-600 mb-1">Total Tasks</div>
              <div className="text-2xl font-bold">24</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600 mb-1">Completed</div>
              <div className="text-2xl font-bold">18</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-sm text-yellow-600 mb-1">In Progress</div>
              <div className="text-2xl font-bold">6</div>
            </div>
          </div>
          {/* Chart or progress timeline will go here */}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Calendar</h2>
          <Calendar 
            onChange={(value) => setDate(value)} 
            value={date}
            className="w-full border-none"
          />
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Deadlines</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 text-red-600 rounded-lg p-2 w-12 h-12 flex items-center justify-center font-semibold">
                24
              </div>
              <div>
                <div className="font-medium">Project Proposal</div>
                <div className="text-sm text-gray-500">Due Today</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-600 rounded-lg p-2 w-12 h-12 flex items-center justify-center font-semibold">
                28
              </div>
              <div>
                <div className="font-medium">Client Meeting</div>
                <div className="text-sm text-gray-500">In 4 days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Priority Tasks</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>Update Documentation</div>
              </div>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">High</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>Review Pull Requests</div>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">Medium</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <div className="font-medium">Completed Task: Database Schema</div>
                <div className="text-sm text-gray-500">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div>
                <div className="font-medium">New Task: API Integration</div>
                <div className="text-sm text-gray-500">5 hours ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 