export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  time_slot: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  start_time?: Date;     // For scheduled events
  end_time?: Date;       // For scheduled events
  recurrence?: string;   // For repeating events
  type: 'task' | 'event'; // Distinguish between tasks and scheduled events
  tags: string[];
}

export type NewTask = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  ai_summary?: string;
  created_at: string;
  updated_at?: string;
  mood: string;
  tags?: string;
}

export type NewJournalEntry = Omit<JournalEntry, 'id' | 'created_at' | 'updated_at' | 'ai_summary'>;

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  schedule: {
    type: 'daily' | 'weekly' | 'monthly';
    days: number[];      // Empty for daily, 0-6 for weekly, 1-31 for monthly
  };
  checklist: {
    id: string;
    title: string;
  }[];
  category?: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

interface HabitStreak {
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed: Date;
  total_completions: number;
  level: number;
  experience_points: number;
}

interface VirtualPet {
  user_id: string;
  name: string;
  level: number;
  experience: number;
  mood: string;
  last_interaction: Date;
  unlocked_items: string[];
}

interface TimeBlock {
  id: string;
  start_time: string; // HH:mm format
  end_time: string;
  habit_id?: string;
  task_id?: string;
  type: 'habit' | 'task';
  day_of_week: number;
  user_id: string;
}

interface ScheduleRequest {
  type: 'habit' | 'task';
  title: string;
  preferred_time?: string;
  duration: number;
  priority: number;
  constraints: {
    not_before?: string;
    not_after?: string;
    preferred_days?: number[];
  };
}

async function findOptimalTime(request: ScheduleRequest) {
  // AI would:
  // 1. Check existing schedule
  // 2. Consider user's preferences
  // 3. Look at habit completion patterns
  // 4. Suggest best time slot
  // 5. Handle conflicts
}

export interface HabitFormData {
  title: string;
  description?: string;
  schedule: {
    type: 'daily' | 'weekly' | 'monthly';
    days: number[];
  };
  checklist: { id: string; title: string; }[];
}