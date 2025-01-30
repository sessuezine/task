'use client'

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'inProgress' | 'done';
  user_id: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [aiSummary, setAiSummary] = useState('');
  const supabase = createClient();

  // Fetch tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id);

      if (tasks) setTasks(tasks);
    };

    fetchTasks();
  }, []);

  const addTask = async (title: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        { 
          title, 
          status: 'todo',
          user_id: session.user.id 
        }
      ])
      .select()
      .single();

    if (data) setTasks([...tasks, data]);
  };

  const updateTaskStatus = async (taskId: string, newStatus: 'todo' | 'inProgress' | 'done') => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId)
      .select()
      .single();

    if (data) {
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      
      <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-xl">🤖</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Task Summary</h2>
            <p className="text-gray-600">{aiSummary || "You have 5 tasks To Do and 3 tasks In Progress. Keep up the good work!"}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="kanban" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
                To Do
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                  {tasks.filter(t => t.status === 'todo').length}
                </span>
              </h2>
              <div className="space-y-3">
                {tasks.filter(task => task.status === 'todo').map(task => (
                  <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>{task.title}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => updateTaskStatus(task.id, 'inProgress')}
                      >
                        →
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
                In Progress
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                  {tasks.filter(t => t.status === 'inProgress').length}
                </span>
              </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex justify-between items-center">
                Done
                <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                  {tasks.filter(t => t.status === 'done').length}
                </span>
              </h2>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Task Statistics</h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600 mb-1">Total Tasks</div>
                  <div className="text-2xl font-bold">{tasks.length}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-600 mb-1">Completed</div>
                  <div className="text-2xl font-bold">
                    {tasks.filter(t => t.status === 'done').length}
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-sm text-yellow-600 mb-1">In Progress</div>
                  <div className="text-2xl font-bold">
                    {tasks.filter(t => t.status === 'inProgress').length}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">All Tasks</h2>
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={task.status === 'done'}
                        onChange={() => updateTaskStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                        className="rounded" 
                      />
                      <span>{task.title}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.status === 'done' ? 'bg-green-100 text-green-600' :
                      task.status === 'inProgress' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}