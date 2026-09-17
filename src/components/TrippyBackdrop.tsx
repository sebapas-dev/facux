import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import { TrippyCanvas } from './TrippyCanvas'

/**
 * Fondo psicodélico a pantalla completa: el canvas más el ciclado de color y el
 * warp por CSS. Lo que se pase como `children` viaja dentro de los filtros; lo
 * que tenga que quedar legible (un panel de texto) va como hermano, encima.
 */
export function TrippyBackdrop({
  children,
  className,
  pastel = false,
}: {
  children?: ReactNode
  className?: string
  /** baja el viaje a pasteles y afloja el ritmo, sin dejar de animar */
  pastel?: boolean
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden transition-colors duration-1000',
        pastel ? 'bg-[#e8d9b8]' : 'bg-[#171514]',
        className,
      )}
    >
      {/* la intensidad es un filtro estático y por eso puede transicionar */}
      <div className={cn('absolute inset-0', pastel ? 'trip-sat-soft' : 'trip-sat')}>
        <div className={reduced ? 'absolute inset-0' : 'absolute inset-0 trip-hue'}>
          <div className={reduced ? 'absolute inset-0' : 'absolute inset-0 trip-warp'}>
            <TrippyCanvas className="absolute inset-0 h-full w-full" pastel={pastel} />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
