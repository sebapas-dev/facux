import { useId } from 'react'

interface MushroomProps {
  className?: string
  title?: string
  /** para animar el color de la cabeza (ver `.trip-cap` en index.css) */
  capClassName?: string
}

/** Hongo de tinta psicodélico, con imaginería de póster underground. */
export function Mushroom({ className, title, capClassName }: MushroomProps) {
  const gradientId = useId()
  const capGradientId = `${gradientId}-cap`
  const stemGradientId = `${gradientId}-stem`

  return (
    <svg
      viewBox="0 0 100 100"
      className={`psychedelic-art ${className ?? ''}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <radialGradient id={capGradientId} cx="35%" cy="25%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="42%" stopColor="#ded4bd" />
          <stop offset="100%" stopColor="#292522" />
        </radialGradient>
        <linearGradient id={stemGradientId} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="55%" stopColor="#d8ccb1" />
          <stop offset="100%" stopColor="#75695d" />
        </linearGradient>
      </defs>
      <g stroke="var(--reddish-brown)" strokeWidth={3.2} strokeLinejoin="round">
        <path
          d="M39 49 C38 60 31 68 34 83 C36 96 64 96 67 83 C70 68 62 60 61 49 Z"
          fill={`url(#${stemGradientId})`}
        />
        <path
          d="M50 7 C31 7 15 17 8 34 C4 44 10 52 22 53 C32 54 39 49 50 51 C62 53 72 57 84 51 C94 46 92 36 86 27 C78 14 65 7 50 7 Z"
          fill={`url(#${capGradientId})`}
          className={capClassName}
        />
      </g>
      <g fill="none" stroke="#292522" strokeWidth="2" opacity="0.9">
        <path d="M19 35 C29 18 43 16 50 19 C59 15 73 20 82 36" />
        <path d="M25 46 C34 32 43 30 50 33 C59 29 68 34 76 45" />
        <path d="M36 51 C41 43 46 42 50 44 C56 41 61 44 66 51" />
      </g>
      <g fill="#292522" opacity="0.9">
        <circle cx="28" cy="27" r="3" />
        <circle cx="47" cy="14" r="2.5" />
        <circle cx="70" cy="27" r="3.5" />
        <circle cx="57" cy="39" r="2.5" />
      </g>
      <path d="M43 69 Q50 74 57 69" fill="none" stroke="#292522" strokeWidth="2.5" strokeLinecap="round" />

      <g transform="translate(50 78)">
        <ellipse rx="13" ry="9" fill="#292522" />
        <ellipse rx="8" ry="6" fill="#fffaf0" />
        <circle r="3.2" fill="#292522" />
        <circle cx="1" cy="-1" r="1" fill="#fffaf0" />
      </g>
    </svg>
  )
}
