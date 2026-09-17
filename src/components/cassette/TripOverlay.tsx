import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mushroom } from '@/components/Mushroom'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface Spawn {
  id: number
  x: number
  y: number
  size: number
  rot: number
}

const PETALS = 8
const PETAL_COLORS = ['#bd563c', '#d6a84f', '#68705f', '#27211e']

/** Flor psicodélica que crece por encima de todo. */
function FlowerPower({ durationMs }: { durationMs: number }) {
  const reduced = usePrefersReducedMotion()
  return (
    <motion.svg
      viewBox="-100 -100 200 200"
      className="pointer-events-none absolute h-[80vmin] w-[80vmin]"
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={
        reduced
          ? { scale: 1, opacity: 0.9 }
          : { scale: [0, 1.1, 1], rotate: 360, opacity: [0, 1, 1] }
      }
      transition={{ duration: durationMs / 1000, ease: 'easeOut' }}
    >
      {Array.from({ length: PETALS }, (_, i) => (
        <ellipse
          key={i}
          cx="0" cy="-52" rx="24" ry="46"
          fill={PETAL_COLORS[i % PETAL_COLORS.length]}
          opacity="0.85"
          stroke="var(--reddish-brown)"
          strokeWidth="3"
          transform={`rotate(${(i * 360) / PETALS})`}
        />
      ))}
      <circle r="30" fill="var(--vanilla-custard)" stroke="var(--reddish-brown)" strokeWidth="4" />
      <circle r="14" fill="var(--tangerine-dream)" />
    </motion.svg>
  )
}

/**
 * Secuencia del hongo en la pantalla del casete: flor que crece + un hongo
 * nuevo cada 200 ms en posición random, durante `durationMs`.
 */
export function TripOverlay({
  durationMs,
  paused = false,
}: {
  durationMs: number
  paused?: boolean
}) {
  const reduced = usePrefersReducedMotion()
  const [spawns, setSpawns] = useState<Spawn[]>([])

  useEffect(() => {
    if (reduced || paused) return
    let n = 0
    const interval = window.setInterval(() => {
      n += 1
      setSpawns((prev) => [
        ...prev.slice(-45),
        {
          id: n,
          x: Math.random() * 88,
          y: Math.random() * 84,
          size: 40 + Math.random() * 66,
          rot: Math.random() * 60 - 30,
        },
      ])
    }, 200)
    return () => window.clearInterval(interval)
  }, [reduced, paused])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      <FlowerPower durationMs={durationMs} />
      {spawns.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          initial={{ scale: 0, rotate: s.rot - 30, opacity: 0 }}
          animate={{ scale: 1, rotate: s.rot, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 340, damping: 14 }}
        >
          <Mushroom className="h-full w-full" />
        </motion.div>
      ))}
    </div>
  )
}
