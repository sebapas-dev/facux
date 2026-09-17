import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

const PASTEL_PALETTES = [
  ['#e8d9b8', '#b8b79c', '#b85f4d', '#6f657d', '#d6a84f', '#f2e9cf', '#78816c', '#9f3f2e'],
  ['#f0e5cb', '#9d9a82', '#c56c50', '#514b59', '#d6a84f', '#d7c5a0', '#68705f', '#7f3329'],
  ['#d9cba9', '#7a806e', '#bd563c', '#81708b', '#e0b85e', '#f4ead3', '#454c43', '#8f4939'],
] as const

const TRIP_PALETTE = [
  '#f0e5cb',
  '#d6a84f',
  '#bd563c',
  '#6f657d',
  '#68705f',
  '#fffaf0',
  '#9f3f2e',
  '#27211e',
] as const

const TRIP_BASE = '#171514'
const PASTEL_BASE = '#e8d9b8'

const hexToRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
]

const PASTEL_BASE_RGB = hexToRgb(PASTEL_BASE)
const TRIP_BASE_RGB = hexToRgb(TRIP_BASE)

const mixRgb = (a: [number, number, number], b: [number, number, number], t: number) =>
  `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(
    a[2] + (b[2] - a[2]) * t,
  )})`

const TAU = Math.PI * 2
const RINGS = 26
const WEDGES = 16
const BLOBS = 7
const MIRRORS = 12

/**
 * Fondo psicodélico: túnel de anillos pulsantes + cuñas giratorias + blobs
 * espejados en caleidoscopio. Se combina con `.trip-hue` y `.trip-warp` para
 * el ciclado de color y la deformación de pantalla.
 */
export function TrippyCanvas({
  className,
  pastel = false,
}: {
  className?: string
  /** baja el viaje: interpola a pasteles y afloja el ritmo, sin frenar */
  pastel?: boolean
}) {
  const reduced = usePrefersReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [palette] = useState(() =>
    pastel
      ? PASTEL_PALETTES[Math.floor(Math.random() * PASTEL_PALETTES.length)]
      : TRIP_PALETTE,
  )
  const pastelRef = useRef(pastel)
  pastelRef.current = pastel

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let running = true

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    // `mix` va de 0 (neón) a 1 (pastel) suavizado por frame, y `clock` acumula
    // el tiempo ya escalado para que aflojar el ritmo no dé saltos de fase.
    let mix = pastelRef.current ? 1 : 0
    let clock = 0
    let last = performance.now()

    const draw = (now: number) => {
      if (!running) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      mix += ((pastelRef.current ? 1 : 0) - mix) * Math.min(dt * 1.2, 1)
      clock += dt * (1 - 0.68 * mix)
      const t = clock
      const pal = palette
      const calm = 1 - mix
      const w = canvas.width
      const h = canvas.height
      const diag = Math.hypot(w, h)

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.fillStyle = mixRgb(TRIP_BASE_RGB, PASTEL_BASE_RGB, pastelRef.current ? mix : 0)
      ctx.fillRect(0, 0, w, h)

      ctx.translate(w / 2, h / 2)

      // túnel: anillos concéntricos que avanzan hacia afuera
      const drift = (t * 1.4) % 1
      for (let i = RINGS; i >= 0; i--) {
        const r = ((i + drift) / RINGS) * diag * 0.78
        ctx.fillStyle = pal[(i + Math.floor(t * 2.5)) % pal.length]
        ctx.globalAlpha = 0.92
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, TAU)
        ctx.fill()
      }

      // cuñas radiales girando en sentido contrario
      ctx.globalCompositeOperation = 'screen'
      ctx.save()
      ctx.rotate(-t * 0.5)
      for (let s = 0; s < WEDGES; s++) {
        const a0 = (s / WEDGES) * TAU
        const a1 = a0 + (TAU / WEDGES) * 0.46
        const rr = diag * 0.5 * (0.45 + 0.55 * Math.sin(t * 2.2 + s * 0.7))
        ctx.globalAlpha = 0.5 * (0.35 + 0.65 * calm)
        ctx.fillStyle = pal[(s + Math.floor(t * 4)) % pal.length]
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, Math.abs(rr), a0, a1)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()

      // blobs espejados: el caleidoscopio propiamente dicho
      ctx.save()
      ctx.rotate(t * 0.9)
      for (let m = 0; m < MIRRORS; m++) {
        ctx.save()
        ctx.rotate((m * TAU) / MIRRORS)
        for (let b = 0; b < BLOBS; b++) {
          const phase = ((t * 0.9 + b * 0.8 + m * 0.2) % BLOBS) / BLOBS
          const dist = phase * diag * 0.6
          ctx.globalAlpha = 0.65 * (1 - phase) * (0.4 + 0.6 * calm)
          ctx.fillStyle = pal[(m + b * 3) % pal.length]
          ctx.beginPath()
          ctx.arc(dist, 0, 40 * dpr * (0.3 + phase * 1.4), 0, TAU)
          ctx.fill()
        }
        ctx.restore()
      }
      ctx.restore()

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  if (reduced) {
    const p = palette
    return (
      <div
        aria-hidden
        className={cn('transition-[background-image] duration-1000', className)}
        style={{ backgroundImage: `conic-gradient(from 0deg, ${[...p, p[0]].join(', ')})` }}
      />
    )
  }

  return <canvas ref={canvasRef} aria-hidden className={className} />
}
