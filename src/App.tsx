import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BackgroundMusic } from '@/components/BackgroundMusic'
import { GrainOverlay } from '@/components/GrainOverlay'
import { SolvedInterstitial } from '@/components/SolvedInterstitial'
import { TopBar } from '@/components/TopBar'
import { GameProvider } from '@/game/GameProvider'
import type { PuzzleId, SolveMethod } from '@/game/types'
import { useGame } from '@/game/useGame'
import { SCREENS } from '@/screens'

function GameStage() {
  const { state, solveScreen, goNext } = useGame()
  const [pending, setPending] = useState<PuzzleId | null>(null)
  const Screen = SCREENS[state.current]

  const handleSolved = (via: SolveMethod = 'play') => {
    if (state.current === 'final') return
    const id = state.current as PuzzleId
    solveScreen(id, via)
    setPending(id)
  }

  // Avanza cuando la pantalla actual quedó resuelta y ya no hay interstitial
  // encima. Cubre también el caso de recargar con progreso a medio camino.
  useEffect(() => {
    if (pending) return
    if (state.current === 'final') return
    if (state.solved[state.current as PuzzleId]) goNext()
  }, [pending, state, goNext])

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden">
      <TopBar />

      <AnimatePresence mode="wait">
        <Screen key={state.current} onSolved={handleSolved} />
      </AnimatePresence>

      <AnimatePresence>
        {pending && (
          <SolvedInterstitial
            key={pending}
            screen={pending}
            onDone={() => setPending(null)}
          />
        )}
      </AnimatePresence>

      <GrainOverlay />
      <BackgroundMusic />
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <GameStage />
    </GameProvider>
  )
}
