interface HarleyLogoProps {
  className?: string
}

/**
 * Placeholder del logo (ver ASSETS.md). Marca genérica a propósito — no
 * reproduce el trademark real de Harley-Davidson.
 */
export function HarleyLogo({ className }: HarleyLogoProps) {
  return (
    <svg viewBox="0 0 240 84" className={className} role="img" aria-label="logo (placeholder)">
      <path
        d="M120 4 L232 6 Q234 30 120 42 Q6 30 8 6 Z"
        fill="var(--tangerine-dream)"
        stroke="var(--reddish-brown)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M12 46 L228 46 Q220 74 120 80 Q20 74 12 46 Z" fill="var(--reddish-brown)" />
      <text
        x="120"
        y="30"
        textAnchor="middle"
        fontFamily="Figtree, system-ui, sans-serif"
        fontSize="18"
        fontWeight="700"
        fill="var(--reddish-brown)"
      >
        LA BESTIA
      </text>
      <text
        x="120"
        y="68"
        textAnchor="middle"
        fontFamily="Figtree, system-ui, sans-serif"
        fontSize="13"
        fontWeight="700"
        fill="var(--light-yellow)"
      >
        MOTOR CO.
      </text>
    </svg>
  )
}
