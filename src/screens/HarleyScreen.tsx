import { type ReactNode, useCallback, useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { motion, useAnimationControls } from 'framer-motion'
import { GiBatteryPackAlt, GiHighKick, GiWrench } from 'react-icons/gi'
import { MushroomHint } from '@/components/MushroomHint'
import { ScreenShell } from '@/components/ScreenShell'
import { DraggableTool } from '@/components/dnd/DraggableTool'
import { DropZone } from '@/components/dnd/DropZone'
import { BatteryBolt } from '@/components/harley/BatteryBolt'
import { HarleyLogo } from '@/components/harley/HarleyLogo'
import { MotoSilhouette } from '@/components/harley/MotoSilhouette'
import { OilSplatLayer, type Splat } from '@/components/harley/OilSplatLayer'
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

type ToolId = 'wrench' | 'charger'

const TOOLS: { id: ToolId; label: string; icon: ReactNode }[] = [
  { id: 'wrench', label: copy.harley.toolWrench, icon: <GiWrench /> },
  { id: 'charger', label: copy.harley.toolCharger, icon: <GiBatteryPackAlt /> },
]

export function HarleyScreen({ onSolved }: ScreenProps) {
  const reduced = usePrefersReducedMotion()
  const playSfx = useSfx()
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
  )

  const [motoImgFailed, setMotoImgFailed] = useState(false)
  const [enterOpen, setEnterOpen] = useState(true)
  const [wrenchOpen, setWrenchOpen] = useState(false)
  const [chargeOpen, setChargeOpen] = useState(false)
  const [chargeReady, setChargeReady] = useState(false)
  const [charged, setCharged] = useState(false)
  const [activeTool, setActiveTool] = useState<ToolId | null>(null)
  const [splats, setSplats] = useState<Splat[]>([])
  const [kicking, setKicking] = useState(false)
  const bike = useAnimationControls()
  const splatTimer = useRef<number | undefined>(undefined)

  const spawnOil = useCallback(() => {
    const now = Date.now()
    setSplats(
      Array.from({ length: 6 }, (_, i) => ({
        id: now + i,
        x: 6 + Math.random() * 80,
        y: 6 + Math.random() * 80,
        size: 90 + Math.random() * 150,
        rot: Math.random() * 360,
      })),
    )
    window.clearTimeout(splatTimer.current)
    splatTimer.current = window.setTimeout(() => setSplats([]), 3200)
  }, [])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTool(event.active.id as ToolId)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTool(null)
    if (event.over?.id !== 'moto') return

    if (event.active.id === 'wrench') {
      spawnOil()
      setWrenchOpen(true)
    } else if (event.active.id === 'charger' && !charged) {
      setChargeReady(false)
      setChargeOpen(true)
    }
  }

  const kick = () => {
    if (kicking || enterOpen) return

    if (!charged) {
      playSfx(SFX.harleyFail)
      if (!reduced) {
        void bike.start({
          x: [0, -5, 5, -3, 3, 0],
          rotate: [0, -1.5, 1.5, -1, 0],
          transition: { duration: 0.45 },
        })
      }
      return
    }

    setKicking(true)
    playSfx(SFX.harleyStart)
    if (!reduced) {
      void bike.start({
        rotate: [0, -2.5, 2.5, -1.5, 1.5, 0],
        y: [0, -4, 0],
        transition: { duration: 0.9 },
      })
    }
    window.setTimeout(() => onSolved(), 1000)
  }

  const finishCharge = useCallback(() => setChargeReady(true), [])

  return (
    <ScreenShell hint={<MushroomHint hint={copy.harley.hint} />}>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col items-center gap-8">
          <HarleyLogo className="h-14 w-auto sm:h-16" />

          <DropZone
            id="moto"
            className="relative w-full rounded-3xl border-2 border-dashed border-transparent p-3 transition-colors"
            overClassName="border-reddish-brown/50 bg-reddish-brown/5"
          >
            <motion.div animate={bike} className="origin-bottom">
              {motoImgFailed ? (
                <MotoSilhouette className="mx-auto w-full max-w-[20rem]" />
              ) : (
                <img
                  src="/assets/harley/moto.png"
                  alt="la moto"
                  draggable={false}
                  onError={() => setMotoImgFailed(true)}
                  className="mx-auto w-full max-w-[20rem] select-none"
                />
              )}
            </motion.div>

            <motion.button
              type="button"
              aria-label={copy.harley.kickLabel}
              onClick={kick}
              className="absolute bottom-2 left-3 grid h-14 w-14 origin-top place-items-center rounded-full border-2 border-reddish-brown bg-tangerine text-2xl text-reddish-brown shadow-pop-sm sm:left-6"
              animate={{ rotate: kicking ? 74 : 0 }}
              transition={
                reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 260, damping: 16 }
              }
              whileTap={kicking ? undefined : { scale: 0.9 }}
            >
              <GiHighKick />
            </motion.button>

            {activeTool && (
              <span className="pointer-events-none absolute inset-x-0 -bottom-3 text-center font-display text-sm text-reddish-brown/70">
                {copy.harley.dragHint}
              </span>
            )}
          </DropZone>

          <div className="flex items-end gap-4">
            {TOOLS.map((tool) => (
              <DraggableTool
                key={tool.id}
                id={tool.id}
                label={tool.label}
                icon={tool.icon}
                disabled={tool.id === 'charger' && charged}
              />
            ))}
          </div>

          {charged && !kicking && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-lg text-reddish-brown"
            >
              {copy.harley.kickReady}
            </motion.p>
          )}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTool ? (
            <div className="flex flex-col items-center gap-1 rounded-2xl border-2 border-reddish-brown bg-light-yellow px-4 py-3 text-reddish-brown shadow-pop">
              <span className="text-3xl">
                {activeTool === 'wrench' ? <GiWrench /> : <GiBatteryPackAlt />}
              </span>
              <span className="font-display text-sm">
                {activeTool === 'wrench' ? copy.harley.toolWrench : copy.harley.toolCharger}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <OilSplatLayer splats={splats} />

      <Dialog open={enterOpen} onOpenChange={setEnterOpen}>
        <DialogContent hideClose>
          <DialogHeader>
            <DialogTitle className="text-3xl tracking-wide">{copy.harley.enterTitle}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button size="lg" onClick={() => setEnterOpen(false)}>
              {copy.harley.enterCta}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={wrenchOpen} onOpenChange={setWrenchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.harley.wrenchTitle}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWrenchOpen(false)}>
              {copy.harley.wrenchCta}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={chargeOpen}
        onOpenChange={(next) => {
          if (!next && !chargeReady) return
          setChargeOpen(next)
        }}
      >
        <DialogContent hideClose>
          <DialogHeader>
            <DialogTitle>{copy.harley.chargeTitle}</DialogTitle>
            <DialogDescription>{copy.harley.chargeBody}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-2">
            {chargeOpen && <BatteryBolt onComplete={finishCharge} />}
          </div>
          <DialogFooter>
            <Button
              size="lg"
              disabled={!chargeReady}
              onClick={() => {
                setCharged(true)
                setChargeOpen(false)
              }}
            >
              {copy.harley.chargeCta}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScreenShell>
  )
}
