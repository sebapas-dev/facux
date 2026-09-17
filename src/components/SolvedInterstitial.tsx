import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { copy } from '@/content/copy'
import type { PuzzleId } from '@/game/types'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { Mushroom } from './Mushroom'

const CONFETTI = ['#d6a84f', '#68705f', '#bd563c', '#27211e']
const BITS = 14

interface SolvedInterstitialProps {
  screen: PuzzleId
  onDone: () => void
}

/** Beat de "resuelto": el hongo con una burbuja de cómic, y despues avanza. */
export function SolvedInterstitial({ screen, onDone }: SolvedInterstitialProps) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const t = window.setTimeout(onDone, reduced ? 900 : 1500)
    return () => window.clearTimeout(t)
  }, [onDone, reduced])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-tea-green/75 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative flex flex-col items-center">
        {!reduced &&
          Array.from({ length: BITS }, (_, i) => {
            const angle = (i / BITS) * Math.PI * 2
            return (
              <motion.span
                key={i}
                className="absolute h-3 w-3 rounded-[3px]"
                style={{ backgroundColor: CONFETTI[i % CONFETTI.length] }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                animate={{
                  x: Math.cos(angle) * 150,
                  y: Math.sin(angle) * 150,
                  rotate: 220,
                  opacity: 0,
                  scale: 1,
                }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
              />
            )
          })}

        <motion.div
          className="relative"
          initial={reduced ? { opacity: 0 } : { scale: 0, rotate: -18 }}
          animate={reduced ? { opacity: 1 } : { scale: 1, rotate: 0 }}
          transition={
            reduced ? { duration: 0.2 } : { type: 'spring', stiffness: 260, damping: 15 }
          }
        >
          <div className="relative mb-4 rounded-2xl border-4 border-reddish-brown bg-light-yellow px-5 py-3 font-display text-xl text-reddish-brown shadow-pop">
            {copy.common.solved[screen]}
            <span className="absolute -bottom-[15px] left-10 h-0 w-0 border-x-[13px] border-t-[15px] border-x-transparent border-t-reddish-brown" />
            <span className="absolute -bottom-[8px] left-[46px] h-0 w-0 border-x-[8px] border-t-[10px] border-x-transparent border-t-light-yellow" />
          </div>
          <Mushroom className="mx-auto h-24 w-24" />
        </motion.div>
      </div>
    </motion.div>
  )
}
