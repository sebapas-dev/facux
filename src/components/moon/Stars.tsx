import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const COUNT = 42

/** Estrellas sutiles con titileo. Posiciones fijas por montaje. */
export function Stars() {
  const reduced = usePrefersReducedMotion()
  const [stars] = useState(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 62,
      size: 1 + Math.random() * 2.2,
      delay: Math.random() * 3,
    })),
  )

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {stars.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full bg-light-yellow"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={reduced ? { opacity: 0.5 } : { opacity: [0.2, 0.9, 0.2] }}
          transition={
            reduced ? undefined : { duration: 3.4, repeat: Infinity, delay: s.delay }
          }
        />
      ))}
    </div>
  )
}
