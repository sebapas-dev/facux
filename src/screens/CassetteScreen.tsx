import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { GiFountainPen } from 'react-icons/gi'
import { MushroomHint } from '@/components/MushroomHint'
import { ScreenShell } from '@/components/ScreenShell'
import { Cassette } from '@/components/cassette/Cassette'
import { TripOverlay } from '@/components/cassette/TripOverlay'
import { DraggableTool } from '@/components/dnd/DraggableTool'
import { DropZone } from '@/components/dnd/DropZone'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { copy } from '@/content/copy'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useSfx } from '@/hooks/useSfx'
import { SFX } from '@/lib/sfx'
import type { ScreenProps } from './index'

type Stage = 'idle' | 'rewinding' | 'quiz'

const REWIND_MS = 2600
const TRIP_MS = 10000
const QUESTIONS = copy.cassette.questions

export function CassetteScreen({ onSolved }: ScreenProps) {
  const reduced = usePrefersReducedMotion()
  const playSfx = useSfx()
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
  )

  const [stage, setStage] = useState<Stage>('idle')
  const [wound, setWound] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [step, setStep] = useState(0)
  const [failOpen, setFailOpen] = useState(false)
  const rafRef = useRef(0)

  const startRewind = useCallback(() => {
    setStage('rewinding')
    playSfx(SFX.cassetteRewind)
    if (reduced) {
      setWound(1)
      setStage('quiz')
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / REWIND_MS, 1)
      setWound(t)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else setStage('quiz')
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [playSfx, reduced])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const handleDragEnd = (event: DragEndEvent) => {
    setDragging(false)
    if (event.over?.id === 'cassette' && stage === 'idle') startRewind()
  }

  const answer = (band: string) => {
    if (band !== QUESTIONS[step].answer) {
      setFailOpen(true)
      return
    }
    if (step + 1 >= QUESTIONS.length) onSolved()
    else setStep(step + 1)
  }

  const current = QUESTIONS[step]

  return (
    <ScreenShell
      hint={
        <MushroomHint
          hint={copy.cassette.hint}
          consumeOverlay={({ frozen }) => (
            <TripOverlay durationMs={TRIP_MS} paused={frozen} />
          )}
          consumeDurationMs={TRIP_MS}
          consumeGrowMs={2600}
          consumeMaxScale={3.4}
          onConsumeEnd={() => onSolved('shortcut')}
        />
      }
    >
      <DndContext
        sensors={sensors}
        onDragStart={() => setDragging(true)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col items-center gap-7 text-center">
          <h1 className="font-display text-3xl text-reddish-brown">{copy.cassette.title}</h1>

          <DropZone
            id="cassette"
            disabled={stage !== 'idle'}
            className="w-full rounded-3xl border-2 border-dashed border-transparent p-2 transition-colors"
            overClassName="border-reddish-brown/50 bg-reddish-brown/5"
          >
            <Cassette
              wound={wound}
              spinning={stage === 'rewinding'}
              highlightHoles={dragging}
              className="mx-auto w-full max-w-[20rem]"
            />
          </DropZone>

          {stage === 'idle' && (
            <>
              <p className="font-body text-reddish-brown/75">{copy.cassette.instruction}</p>
              <DraggableTool id="pen" label={copy.cassette.penLabel} icon={<GiFountainPen />} />
            </>
          )}

          {stage === 'rewinding' && (
            <motion.p
              className="font-display text-lg text-reddish-brown"
              animate={reduced ? undefined : { opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {copy.cassette.rewinding}
            </motion.p>
          )}
        </div>

        <DragOverlay dropAnimation={null}>
          {dragging ? (
            <div className="flex flex-col items-center gap-1 rounded-2xl border-2 border-reddish-brown bg-light-yellow px-4 py-3 text-reddish-brown shadow-pop">
              <span className="text-3xl">
                <GiFountainPen />
              </span>
              <span className="font-display text-sm">{copy.cassette.penLabel}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Dialog open={stage === 'quiz' && !failOpen}>
        <DialogContent hideClose>
          <DialogHeader>
            <DialogDescription className="font-display text-sm uppercase tracking-wide">
              {copy.cassette.quizProgress(step + 1, QUESTIONS.length)}
            </DialogDescription>
            <DialogTitle>{current.song}</DialogTitle>
          </DialogHeader>
          <div className="mt-2 flex flex-col gap-2">
            {copy.cassette.bands.map((band) => (
              <Button key={band} variant="outline" size="lg" onClick={() => answer(band)}>
                {band}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={failOpen} onOpenChange={setFailOpen}>
        <DialogContent hideClose>
          <DialogHeader>
            <DialogTitle>{copy.cassette.quizFailTitle}</DialogTitle>
            <DialogDescription>{copy.cassette.quizFailBody}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setFailOpen(false)}>{copy.cassette.quizFailCta}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScreenShell>
  )
}
