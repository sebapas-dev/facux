import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

interface CassetteProps {
  /** 0 = toda la cinta a la derecha, 1 = rebobinada a la izquierda */
  wound: number
  spinning: boolean
  /** resalta los agujeros mientras se arrastra la lapicera */
  highlightHoles?: boolean
  className?: string
}

const HUB_R = 15
const MAX_R = 43

function Reel({ cx, r, spinning, dir }: { cx: number; r: number; spinning: boolean; dir: 1 | -1 }) {
  const reduced = usePrefersReducedMotion()
  return (
    <g>
      <circle cx={cx} cy={72} r={r} fill="#2b1d17" />
      <circle cx={cx} cy={72} r={r} fill="none" stroke="#4a352b" strokeWidth={2} />
      <motion.g
        style={{ originX: `${cx}px`, originY: '72px' }}
        animate={spinning && !reduced ? { rotate: dir * 360 } : { rotate: 0 }}
        transition={
          spinning && !reduced
            ? { duration: 0.5, repeat: Infinity, ease: 'linear' }
            : { duration: 0.2 }
        }
      >
        <circle cx={cx} cy={72} r={HUB_R} fill="var(--light-yellow)" stroke="var(--reddish-brown)" strokeWidth={3} />
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const rad = (a * Math.PI) / 180
          return (
            <rect
              key={a}
              x={cx - 2.5}
              y={72 - HUB_R - 3}
              width={5}
              height={9}
              rx={2}
              fill="var(--reddish-brown)"
              transform={`rotate(${a} ${cx} 72)`}
              style={{ transformOrigin: `${cx}px 72px` }}
              opacity={rad >= 0 ? 1 : 1}
            />
          )
        })}
      </motion.g>
    </g>
  )
}

/** Casete de los 90 dibujado a mano: carcasa, ventana, dos carretes y sus agujeros. */
export function Cassette({ wound, spinning, highlightHoles, className }: CassetteProps) {
  // la cinta se traspasa: lo que crece de un lado decrece del otro
  const leftR = HUB_R + (MAX_R - HUB_R) * wound
  const rightR = HUB_R + (MAX_R - HUB_R) * (1 - wound)

  return (
    <svg viewBox="0 0 300 190" className={`psychedelic-art ${className ?? ''}`} role="img" aria-label="casete">
      <rect
        x="4" y="4" width="292" height="182" rx="12"
        fill="var(--tangerine-dream)" stroke="var(--reddish-brown)" strokeWidth="5"
      />
      <rect
        x="18" y="18" width="264" height="96" rx="8"
        fill="var(--light-yellow)" stroke="var(--reddish-brown)" strokeWidth="4"
      />
      <text
        x="150" y="38" textAnchor="middle"
        fontFamily="DynaPuff, system-ui, sans-serif" fontSize="15" fill="var(--reddish-brown)"
      >
        MIX 1994
      </text>

      <rect
        x="60" y="44" width="180" height="58" rx="6"
        fill="var(--garage-cream)" stroke="var(--reddish-brown)" strokeWidth="3"
      />
      <Reel cx={100} r={leftR} spinning={spinning} dir={-1} />
      <Reel cx={200} r={rightR} spinning={spinning} dir={-1} />
      <rect x={100} y={68} width={100} height={8} fill="#2b1d17" />

      {/* agujeros de arrastre — acá va la lapicera */}
      {[100, 200].map((cx) => (
        <circle
          key={cx} cx={cx} cy={72} r={7}
          fill="#1b120e"
          stroke={highlightHoles ? 'var(--vanilla-custard)' : 'transparent'}
          strokeWidth={highlightHoles ? 4 : 0}
        />
      ))}

      <rect
        x="40" y="126" width="220" height="48" rx="8"
        fill="var(--reddish-brown)" opacity="0.15"
      />
      {[70, 150, 230].map((cx) => (
        <circle key={cx} cx={cx} cy={150} r={6} fill="var(--reddish-brown)" opacity="0.5" />
      ))}
      <rect x="120" y="140" width="60" height="20" rx="4" fill="#2b1d17" />
    </svg>
  )
}
