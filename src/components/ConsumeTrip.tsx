import { type CSSProperties, type ReactNode, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { copy } from '@/content/copy'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { Mushroom } from './Mushroom'
import { TrippyBackdrop } from './TrippyBackdrop'
import { Moon } from './moon/Moon'
import { Stars } from './moon/Stars'
import { Wolf } from './moon/Wolf'

const REMOTE_QUOTES_URL =
  'https://raw.githubusercontent.com/JamesFT/Database-Quotes/master/quotes.json'

interface Quote {
  text: string
  author: string
}

const FALLBACK_QUOTES: readonly Quote[] = copy.common.mushroom.attributedQuotes
const CLASSIC_AUTHORS = [
  'aristotle',
  'albert camus',
  'albert einstein',
  'albert schopenhauer',
  'bertrand russell',
  'carl jung',
  'cervantes',
  'dostoevsky',
  'epictetus',
  'friedrich nietzsche',
  'george orwell',
  'immanuel kant',
  'leo tolstoy',
  'marcus aurelius',
  'miguel de cervantes',
  'oscar wilde',
  'plato',
  'ralph waldo emerson',
  'seneca',
  'shakespeare',
  'socrates',
  'william blake',
]

function pickRandom<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function parseRemoteQuotes(payload: unknown): Quote[] {
  if (!Array.isArray(payload)) return []

  return payload.flatMap((item) => {
    if (!item || typeof item !== 'object') return []

    const quote = item as { quote?: unknown; author?: unknown; text?: unknown }
    const text = typeof quote.quote === 'string' ? quote.quote : quote.text
    const author = quote.author
    if (typeof text !== 'string' || typeof author !== 'string' || !text || !author) {
      return []
    }

    const normalizedAuthor = author.toLowerCase()
    return CLASSIC_AUTHORS.some((name) => normalizedAuthor.includes(name))
      ? [{ text: text.trim(), author: author.trim() }]
      : []
  })
}

function TripSky({ reduced }: { reduced: boolean }) {
  const [variant] = useState(() => ({
    drift: Math.random() * 12 - 6,
    moonPhase: Math.random() > 0.5 ? 0.5 : 0.625,
    sunDelay: Math.random() * 0.5,
    wolfDelay: 0.7 + Math.random() * 0.7,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <Stars />

      <motion.div
        className="trip-sun absolute left-[12%] top-[11%] h-16 w-16 rounded-full sm:h-24 sm:w-24"
        initial={reduced ? { opacity: 0.8 } : { opacity: 0, scale: 0.35, y: 30 }}
        animate={reduced ? { opacity: 0.8 } : { opacity: [0, 0.85, 0.7], scale: [0.35, 1.08, 1], y: [30, 0, 8] }}
        transition={
          reduced
            ? undefined
            : { duration: 2.8, delay: variant.sunDelay, ease: 'easeOut', times: [0, 0.55, 1] }
        }
      />

      <motion.div
        className="absolute right-[12%] top-[10%]"
        initial={reduced ? { opacity: 0.8 } : { opacity: 0, scale: 0.5, rotate: -12 }}
        animate={reduced ? { opacity: 0.8 } : { opacity: [0, 0.9, 0.78], scale: [0.5, 1.12, 1], rotate: [-12, 4, 0] }}
        transition={
          reduced
            ? undefined
            : { duration: 3.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <Moon phase={variant.moonPhase} size={92} />
      </motion.div>

      <motion.div
        className="absolute bottom-[-2%] left-1/2 w-52 -translate-x-1/2 sm:w-72"
        style={{ x: variant.drift }}
        initial={reduced ? { opacity: 0.9 } : { opacity: 0, y: 50, scale: 0.72 }}
        animate={reduced ? { opacity: 0.9 } : { opacity: [0, 0.9, 0.78], y: [50, 0, -5], scale: [0.72, 1.05, 1] }}
        transition={
          reduced
            ? undefined
            : { duration: 3.2, delay: variant.wolfDelay, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <Wolf howling={!reduced} className="h-56 w-full sm:h-72" />
      </motion.div>
    </div>
  )
}

interface ConsumeTripProps {
  /** cuánto dura el viaje antes de congelarse y mostrar la frase */
  durationMs?: number
  /** cuánto tarda el hongo en terminar de crecer */
  growMs?: number
  /** escala final del hongo; con la de por defecto tapa toda la ventana */
  maxScale?: number
  /** capa extra dentro del fondo; recibe `frozen` para poder detenerse también */
  overlay?: (state: { frozen: boolean }) => ReactNode
  onEnd: () => void
}

/**
 * "Consumir": fractales psicodélicos fuera de la paleta y un hongo que crece
 * cambiando de color. Al terminar, la escena se congela y aparece una frase al
 * azar sobre un panel de vidrio; se sale tocando el botón.
 */
export function ConsumeTrip({
  durationMs = 3000,
  growMs = 3000,
  maxScale = 16,
  overlay,
  onEnd,
}: ConsumeTripProps) {
  const reduced = usePrefersReducedMotion()
  const [frozen, setFrozen] = useState(false)
  const [quote, setQuote] = useState<Quote>(() => pickRandom(FALLBACK_QUOTES))

  useEffect(() => {
    const controller = new AbortController()

    fetch(REMOTE_QUOTES_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Quote request failed: ${response.status}`)
        return response.json() as Promise<unknown>
      })
      .then((payload) => {
        const remoteQuotes = parseRemoteQuotes(payload)
        if (remoteQuotes.length > 0 && !controller.signal.aborted) {
          setQuote(pickRandom(remoteQuotes))
        }
      })
      .catch(() => {
        // The local quote remains visible when the remote source is unavailable.
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setFrozen(true), durationMs)
    return () => window.clearTimeout(timer)
  }, [durationMs])

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-hidden bg-[#120a1f]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.15 : 0.4 }}
    >
      <TrippyBackdrop pastel>
        <TripSky reduced={reduced} />
        {overlay?.({ frozen })}

        <motion.div
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0.12, rotate: -25 }}
          animate={
            reduced
              ? { scale: Math.min(maxScale, 3) }
              : { scale: [0.12, 1.4, maxScale], rotate: [-25, 14, 0] }
          }
          transition={
            reduced
              ? { duration: 0.2 }
              : { duration: growMs / 1000, ease: [0.45, 0, 0.6, 1], times: [0, 0.45, 1] }
          }
        >
          <Mushroom className="h-full w-full" capClassName="trip-cap" />
        </motion.div>
      </TrippyBackdrop>

      {/* fuera del backdrop: no debe heredar el hue-rotate ni el warp */}
      <AnimatePresence>
        {frozen && (
          <motion.div
            key="quote"
            className="absolute inset-0 z-10 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduced ? 0.15 : 0.9, ease: 'easeOut' }}
          >
            <motion.figure
              className="trip-parchment m-0 w-full max-w-md rounded-[1.25rem] px-7 py-8 text-center"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.94 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: reduced ? 0.15 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <blockquote className="trip-quote-text text-lg leading-relaxed sm:text-xl">
                «{quote.text}»
              </blockquote>
              <figcaption className="trip-quote-author mt-5 font-body text-xs uppercase tracking-[0.2em]">
                {quote.author}
              </figcaption>
              <button
                type="button"
                onClick={onEnd}
                style={{ '--lg-rim': '7px' } as CSSProperties}
                className="trip-parchment-button mt-7 rounded-full px-6 py-2.5 transition-transform active:scale-95"
              >
                <span className="font-display text-sm">
                  {copy.common.mushroom.tripDismiss}
                </span>
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
