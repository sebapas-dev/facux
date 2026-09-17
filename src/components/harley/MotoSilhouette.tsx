interface MotoSilhouetteProps {
  className?: string
}

/** Silueta de moto de perfil, dibujada a mano. Placeholder del PNG (ver ASSETS.md). */
export function MotoSilhouette({ className }: MotoSilhouetteProps) {
  return (
    <svg viewBox="0 0 260 150" className={`psychedelic-art ${className ?? ''}`} role="img" aria-label="la moto">
      <g fill="var(--reddish-brown)">
        <circle cx="58" cy="112" r="33" />
        <circle cx="206" cy="112" r="33" />
        <path d="M38 96 Q44 64 92 62 L118 50 Q136 44 152 50 L170 62 Q198 64 208 88 L196 98 Q170 78 150 84 L106 84 Q90 92 82 106 L66 110 Q48 108 38 96 Z" />
        <rect x="94" y="80" width="56" height="28" rx="9" />
        <path
          d="M150 106 Q118 132 74 122"
          stroke="var(--reddish-brown)"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M196 94 L214 42 L228 44 L210 94 Z" />
        <rect x="68" y="58" width="32" height="13" rx="6" />
        <rect x="200" y="30" width="10" height="26" rx="4" transform="rotate(24 205 43)" />
      </g>
      <g fill="var(--light-yellow)">
        <circle cx="58" cy="112" r="18" />
        <circle cx="206" cy="112" r="18" />
      </g>
      <g fill="var(--reddish-brown)">
        <circle cx="58" cy="112" r="5" />
        <circle cx="206" cy="112" r="5" />
      </g>
      <circle cx="220" cy="50" r="7" fill="var(--vanilla-custard)" />
    </svg>
  )
}
