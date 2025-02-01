import { useDraggable } from '@dnd-kit/core'
import { Task } from '@/src/lib/types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface TaskCardProps {
  task: Task
  onDelete?: () => void
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
  })
  const supabase = createClientComponentClient()

  const handleDelete = async () => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .match({ id: task.id })
    
    if (error) {
      console.error('Error deleting task:', error)
      return
    }

    onDelete?.()
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="task-card group relative cursor-grab active:cursor-grabbing transform transition-all duration-200 ease-in-out"
    >
      <button 
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="w-5 h-5 text-gray-500 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h4 className="font-medium">{task.title}</h4>
      <p className="text-[--text-secondary] text-sm mt-1">{task.description}</p>
    </div>
  )
} 