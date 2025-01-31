import { useDraggable } from '@dnd-kit/core'
import { Task } from '@/src/lib/types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  })
  const supabase = createClientComponentClient()

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="task-card group relative cursor-grab active:cursor-grabbing"
    >
      <button 
        onClick={async () => {
          await supabase.from('tasks').delete().match({ id: task.id })
          // You'll need to implement a way to refresh tasks after deletion
          // This could be through a callback prop or global state management
        }}
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