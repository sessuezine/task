export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  time_slot: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export type NewTask = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>

export interface JournalEntry {
  id: string;
  content: string;
  userId: string;
  date: Date;
  aiSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}