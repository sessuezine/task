import { useDroppable } from '@dnd-kit/core'
import { Task } from '@/src/lib/types'
import { TaskCard } from '../components/TaskCard'

interface KanbanColumnProps {
  title: string
  tasks: Task[]
  id: string
  fetchTasks: () => void
}

export function KanbanColumn({ title, tasks, id, fetchTasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div ref={setNodeRef} className="space-y-3 min-h-[50px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={() => fetchTasks()} />
        ))}
      </div>
    </div>
  )
} 