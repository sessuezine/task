export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          user_id: string
          time_slot: 'todo' | 'in_progress' | 'done'
          deadline?: string
        }
        Insert: Omit<Tasks['Row'], 'id' | 'created_at'>
        Update: Partial<Tasks['Insert']>
      }
    }
  }
}

type Tasks = Database['public']['Tables']['tasks'] 