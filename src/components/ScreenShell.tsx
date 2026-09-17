import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { reducedScreenVariants, screenVariants } from '@/config/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

interface ScreenShellProps {
  children: ReactNode
  /** slot fijo abajo (normalmente <MushroomHint>) */
  hint?: ReactNode
  /** clases extra para el contenedor de contenido (max-w-md por defecto) */
  className?: string
  /** fondo de la pantalla; por defecto el gradiente cálido general */
  background?: string
}

export function ScreenShell({ children, hint, className, background }: ScreenShellProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.section
      className="ink-poster relative flex min-h-[100dvh] w-full flex-col items-center justify-center px-5 pb-24 pt-24"
      style={
        background
          ? { background }
          : {
              background:
                'linear-gradient(135deg, var(--light-yellow) 0%, var(--garage-cream) 52%, #c5bda9 100%), repeating-linear-gradient(0deg, rgba(39,33,30,0.035) 0 1px, transparent 1px 5px)',
            }
      }
      variants={reduced ? reducedScreenVariants : screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className={cn('w-full max-w-md', className)}>{children}</div>
      {hint}
    </motion.section>
  )
}
