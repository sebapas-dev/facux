import { useState } from 'react'
import { motion } from 'framer-motion'
import { MushroomHint } from '@/components/MushroomHint'
import { ScreenShell } from '@/components/ScreenShell'
import { FULL_MOON, Moon, PHASES } from '@/components/moon/Moon'
import { Stars } from '@/components/moon/Stars'
import { Wolf } from '@/components/moon/Wolf'
import { Button } from '@/components/ui/button'
import { copy } from '@/content/copy'
import { useSfx } from '@/hooks/useSfx'
import { useTweenedNumber } from '@/hooks/useTweenedNumber'
import { SFX } from '@/lib/sfx'
import type { ScreenProps } from './index'

/** Casi nueva: la luna arranca prácticamente tapada. */
const START_PHASE = 0.02
const SKY = 'linear-gradient(180deg, #171514 0%, #332b28 45%, #514b43 78%, #68705f 100%)'

export function MoonScreen({ onSolved }: ScreenProps) {
  const playSfx = useSfx()
  const [phase, setPhase] = useState(START_PHASE)
  const [howling, setHowling] = useState(false)
  const [picked, setPicked] = useState(false)
  const animatedPhase = useTweenedNumber(phase, 900)

  const choosePhase = (next: number, close: () => void) => {
    setPicked(true)
    setPhase(next)
    close()
    if (next !== FULL_MOON) return

    window.setTimeout(() => {
      setHowling(true)
      playSfx(SFX.wolfHowl)
      window.setTimeout(() => onSolved(), 1800)
    }, 950)
  }

  return (
    <ScreenShell
      background={SKY}
      hint={
        <MushroomHint
          renderHint={({ close }) => (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-display text-2xl text-reddish-brown">
                  {copy.moon.hintDialogTitle}
                </h2>
                <p className="mt-1 font-body text-sm text-reddish-brown/75">
                  {copy.moon.hintDialogBody}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {PHASES.map((p, i) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => choosePhase(p, close)}
                    aria-label={copy.moon.phaseLabels[i]}
                    className="flex flex-col items-center gap-1 rounded-xl border-2 border-light-yellow/30 bg-[#332b28] p-1.5 transition-transform active:scale-90 hover:border-light-yellow"
                  >
                    <Moon phase={p} size={38} label={copy.moon.phaseLabels[i]} />
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={close}>
                {copy.common.hintClose}
              </Button>
            </div>
          )}
        />
      }
    >
      <Stars />

      <div className="relative flex flex-col items-center gap-2">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="drop-shadow-[0_0_40px_rgba(246,244,210,0.35)]"
        >
          <Moon phase={animatedPhase} size={128} />
        </motion.div>

        <h1 className="mt-1 font-display text-3xl text-light-yellow">{copy.moon.title}</h1>
        <p className="font-body text-sm text-light-yellow/60">
          {picked && phase !== FULL_MOON ? copy.moon.wrongPhase : copy.moon.subtitle}
        </p>

        <Wolf howling={howling} className="mt-1 h-52 w-auto sm:h-60" />
      </div>
    </ScreenShell>
  )
}
