import { useId } from 'react'

/**
 * Fases: 0 = nueva, 0.25 = cuarto creciente, 0.5 = llena, 0.75 = cuarto menguante.
 * La máscara combina un semidisco con una elipse cuyo `rx` sigue el terminador.
 */
export const PHASES = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875]
export const FULL_MOON = 0.5

interface MoonProps {
  phase: number
  size?: number
  className?: string
  label?: string
}

export function Moon({ phase, size = 100, className, label }: MoonProps) {
  const maskId = useId()
  const r = 46
  const k = Math.cos(2 * Math.PI * phase)
  const litRight = phase < 0.5
  // más de medio disco iluminado -> la elipse suma; si no, resta
  const gibbous = Math.abs(phase - 0.5) < 0.25

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`psychedelic-art ${className ?? ''}`}
      role="img"
      aria-label={label ?? 'luna'}
    >
      <mask id={maskId}>
        <rect width="100" height="100" fill="black" />
        <path
          d={
            litRight
              ? `M50 4 A${r} ${r} 0 0 1 50 96 Z`
              : `M50 4 A${r} ${r} 0 0 0 50 96 Z`
          }
          fill="white"
        />
        <ellipse cx="50" cy="50" rx={Math.abs(k) * r} ry={r} fill={gibbous ? 'white' : 'black'} />
      </mask>

      <circle cx="50" cy="50" r={r} fill="#332b28" opacity="0.78" />
      <g mask={`url(#${maskId})`}>
        <circle cx="50" cy="50" r={r} fill="var(--light-yellow)" />
        <circle cx="36" cy="38" r="7" fill="#bd563c" opacity="0.48" />
        <circle cx="60" cy="58" r="10" fill="#68705f" opacity="0.45" />
        <circle cx="58" cy="30" r="4.5" fill="#d6a84f" opacity="0.6" />
      </g>
    </svg>
  )
}
