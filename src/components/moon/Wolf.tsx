import { useId } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { MUZZLE, WOLF_PATH } from './wolfPath'

const WAVE_RADII = [100, 170, 240]

/** Arco centrado en el hocico, abierto hacia arriba. */
function waveArc(r: number) {
  const a1 = (208 * Math.PI) / 180
  const a2 = (332 * Math.PI) / 180
  const at = (a: number) =>
    `${(MUZZLE.x + r * Math.cos(a)).toFixed(0)} ${(MUZZLE.y + r * Math.sin(a)).toFixed(0)}`
  return `M${at(a1)} A${r} ${r} 0 0 1 ${at(a2)}`
}

/**
 * Alpha Moon aullándole a la luna. La silueta ya viene en pose de aullido:
 * `howling` enciende las ondas de sonido y el envión del cuerpo.
 */
export function Wolf({ howling, className }: { howling: boolean; className?: string }) {
  const reduced = usePrefersReducedMotion()
  const gradientId = useId()

  return (
    <svg
      viewBox="-20 -270 1160 1570"
      className={`psychedelic-art ${className ?? ''}`}
      role="img"
      aria-label={howling ? 'alpha moon aullándole a la luna' : 'alpha moon mirando la luna'}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f7f0df" />
          <stop offset="0.4" stopColor="#b9ad98" />
          <stop offset="1" stopColor="#332b28" />
        </linearGradient>
      </defs>

      {howling &&
        WAVE_RADII.map((r, i) => (
          <motion.path
            key={r}
            d={waveArc(r)}
            fill="none"
            stroke="var(--light-yellow)"
            strokeWidth={20}
            strokeLinecap="round"
            style={{ originX: `${MUZZLE.x}px`, originY: `${MUZZLE.y}px` }}
            initial={reduced ? { opacity: 0.7 - i * 0.18 } : { opacity: 0, scale: 0.45 }}
            animate={
              reduced
                ? { opacity: 0.7 - i * 0.18 }
                : { opacity: [0, 0.85, 0], scale: [0.45, 1, 1.3] }
            }
            transition={
              reduced
                ? undefined
                : { duration: 1.9, repeat: Infinity, delay: i * 0.32, ease: 'easeOut' }
            }
          />
        ))}

      <motion.g
        style={{ originX: '520px', originY: '1280px' }}
        animate={
          reduced
            ? undefined
            : howling
              ? { rotate: [-1.5, -3.2, -1.5], scaleY: [1, 1.025, 1] }
              : { rotate: 0, scaleY: [1, 1.012, 1] }
        }
        transition={{ duration: howling ? 1.9 : 4.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <g transform="translate(0,1280) scale(0.1,-0.1)" fill={`url(#${gradientId})`}>
          <path d={WOLF_PATH} />
        </g>
      </motion.g>
    </svg>
  )
}
