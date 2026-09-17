import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export interface Splat {
  id: number
  /** % del viewport */
  x: number
  y: number
  /** px */
  size: number
  rot: number
}

const BLOB =
  'M44 8 C60 0 86 8 90 26 C94 44 80 54 88 72 C96 90 70 100 50 92 C30 84 8 96 6 74 C4 52 18 42 12 24 C6 6 28 16 44 8 Z'

/** Manchas de aceite full-screen. El screen las spawnea y limpia; acá sólo se animan. */
export function OilSplatLayer({ splats }: { splats: Splat[] }) {
  const reduced = usePrefersReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <AnimatePresence>
        {splats.map((splat) => (
          <motion.svg
            key={splat.id}
            viewBox="0 0 96 100"
            style={{
              position: 'absolute',
              left: `${splat.x}%`,
              top: `${splat.y}%`,
              width: splat.size,
              height: splat.size,
            }}
            initial={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.2, rotate: splat.rot - 40 }
            }
            animate={
              reduced
                ? { opacity: 0.82 }
                : { opacity: 0.82, scale: 1, rotate: splat.rot }
            }
            exit={{ opacity: 0, transition: { duration: 1 } }}
            transition={reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 210, damping: 17 }}
          >
            <path d={BLOB} fill="#241611" />
          </motion.svg>
        ))}
      </AnimatePresence>
    </div>
  )
}
