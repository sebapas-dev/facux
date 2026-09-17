import { useEffect, useId, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface BatteryBoltProps {
  durationMs?: number
  onComplete: () => void
}

const BOLT = 'M40 4 L10 58 L34 58 L28 96 L60 34 L38 34 Z'
const HEIGHT = 100

/** Rayo que se pinta de verde de abajo hacia arriba durante `durationMs`. */
export function BatteryBolt({ durationMs = 3000, onComplete }: BatteryBoltProps) {
  const reduced = usePrefersReducedMotion()
  const clipId = useId()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      setProgress(t)
      if (t < 1) raf = requestAnimationFrame(tick)
      else onComplete()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [durationMs, onComplete])

  const filled = progress * HEIGHT

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 70 100"
        className={reduced ? 'h-28 w-28' : 'h-28 w-28 drop-shadow-[0_0_14px_rgba(67,176,71,0.5)]'}
        role="img"
        aria-label={`cargando ${Math.round(progress * 100)} por ciento`}
      >
        <clipPath id={clipId}>
          <rect x="0" y={HEIGHT - filled} width="70" height={filled} />
        </clipPath>
        <path
          d={BOLT}
          fill="var(--light-yellow)"
          stroke="var(--reddish-brown)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d={BOLT} fill="var(--vanilla-custard)" clipPath={`url(#${clipId})`} />
      </svg>
      <p className="font-display text-2xl text-reddish-brown">{Math.round(progress * 100)}%</p>
    </div>
  )
}
