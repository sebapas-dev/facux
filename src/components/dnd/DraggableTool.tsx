import type { ReactNode } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { cn } from '@/lib/cn'

interface DraggableToolProps {
  id: string
  label: string
  icon: ReactNode
  disabled?: boolean
  className?: string
}

/** Herramienta arrastrable (touch + mouse). El visual que sigue al dedo lo pone <DragOverlay>. */
export function DraggableTool({ id, label, icon, disabled, className }: DraggableToolProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id, disabled })

  return (
    <button
      ref={setNodeRef}
      type="button"
      aria-label={label}
      className={cn(
        'flex touch-none select-none flex-col items-center gap-1 rounded-2xl border-2 border-reddish-brown bg-light-yellow px-4 py-3 text-reddish-brown shadow-pop-sm transition-opacity',
        isDragging && 'opacity-25',
        disabled && 'cursor-not-allowed opacity-40',
        className,
      )}
      {...listeners}
      {...attributes}
    >
      <span className="text-3xl">{icon}</span>
      <span className="font-display text-sm">{label}</span>
    </button>
  )
}
