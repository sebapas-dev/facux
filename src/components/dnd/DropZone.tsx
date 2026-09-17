import type { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/cn'

interface DropZoneProps {
  id: string
  children: ReactNode
  className?: string
  /** clases extra mientras hay algo encima */
  overClassName?: string
  disabled?: boolean
}

export function DropZone({ id, children, className, overClassName, disabled }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled })
  return (
    <div ref={setNodeRef} className={cn(className, isOver && overClassName)}>
      {children}
    </div>
  )
}
