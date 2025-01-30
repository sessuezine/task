export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: Date;
  timeSlot?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalEntry {
  id: string;
  content: string;
  userId: string;
  date: Date;
  aiSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}