import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

export function GrainOverlay() {
  const reduced = usePrefersReducedMotion()
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 z-[65] opacity-[0.07] mix-blend-multiply',
        !reduced && 'animate-grain-shift',
      )}
      style={{
        backgroundImage: "url('/assets/textures/grain.svg')",
        backgroundRepeat: 'repeat',
        backgroundSize: '180px 180px',
      }}
    />
  )
}
