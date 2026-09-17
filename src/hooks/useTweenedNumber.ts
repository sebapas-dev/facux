import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/** Interpola un número hacia `target` con rAF. Útil para atributos SVG. */
export function useTweenedNumber(target: number, durationMs = 800): number {
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef(0)

  useEffect(() => {
    if (reduced) {
      fromRef.current = target
      setValue(target)
      return
    }
    const from = fromRef.current
    if (from === target) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      const next = from + (target - from) * easeOutCubic(t)
      setValue(next)
      fromRef.current = next
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, durationMs, reduced])

  return value
}
