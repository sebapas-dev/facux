import { type ReactNode, useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GiMushroomGills } from 'react-icons/gi'
import { LuLightbulb, LuRotateCcw } from 'react-icons/lu'
import { copy } from '@/content/copy'
import { useGame } from '@/game/useGame'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { ConsumeTrip } from './ConsumeTrip'
import { Mushroom } from './Mushroom'
import { TrippyBackdrop } from './TrippyBackdrop'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

type View = 'menu' | 'hint' | 'trip'

interface MushroomHintProps {
  /**
   * Contenido de la pista de esta pantalla. Si no se pasa `hint` ni
   * `renderHint`, el menú aparece sin la opción "pista" (pantalla final).
   */
  hint?: ReactNode
  /** deforma/wobblea el texto de la pista (pantalla 1) */
  wobble?: boolean
  /** reemplaza el panel de pista por completo (pantalla 4: selector de fases) */
  renderHint?: (api: { close: () => void }) => ReactNode
  /** capa extra durante "consumir" (pantalla 3: flor + hongos) */
  consumeOverlay?: (state: { frozen: boolean }) => ReactNode
  consumeDurationMs?: number
  consumeGrowMs?: number
  consumeMaxScale?: number
  /** se dispara al terminar el viaje (pantalla 3 la usa como atajo) */
  onConsumeEnd?: () => void
  position?: 'br' | 'bl'
}

function MenuOption({
  icon,
  label,
  description,
  onClick,
  tone = 'normal',
}: {
  icon: ReactNode
  label: string
  description: string
  onClick: () => void
  tone?: 'normal' | 'danger'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-transform active:scale-95 ' +
        (tone === 'danger'
          ? 'border-reddish-brown/40 bg-transparent text-reddish-brown/80 hover:bg-reddish-brown/10'
          : 'border-reddish-brown bg-light-yellow text-reddish-brown shadow-pop-sm hover:bg-tangerine/20')
      }
    >
      <span className="shrink-0 text-2xl">{icon}</span>
      <span className="flex flex-col">
        <span className="font-display text-lg leading-tight">{label}</span>
        <span className="font-body text-xs opacity-70">{description}</span>
      </span>
    </button>
  )
}

export function MushroomHint({
  hint,
  wobble = false,
  renderHint,
  consumeOverlay,
  consumeDurationMs = 3000,
  consumeGrowMs,
  consumeMaxScale,
  onConsumeEnd,
  position = 'br',
}: MushroomHintProps) {
  const reduced = usePrefersReducedMotion()
  const { reset } = useGame()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<View>('menu')
  const [confirmRestart, setConfirmRestart] = useState(false)

  const m = copy.common.mushroom
  const canHint = Boolean(hint || renderHint)

  const closeAll = useCallback(() => {
    setOpen(false)
    setView('menu')
    setConfirmRestart(false)
  }, [])

  const handleTripEnd = useCallback(() => {
    setView('menu')
    onConsumeEnd?.()
  }, [onConsumeEnd])

  return (
    <>
      <motion.button
        type="button"
        aria-label={copy.common.hintButtonLabel}
        onClick={() => {
          setView('menu')
          setConfirmRestart(false)
          setOpen(true)
        }}
        className={
          'fixed bottom-5 z-40 h-16 w-16 sm:h-20 sm:w-20 ' +
          (position === 'bl' ? 'left-4' : 'right-4')
        }
        animate={reduced ? undefined : { y: [0, -7, 0], rotate: [-4, 4, -4] }}
        transition={reduced ? undefined : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={{ scale: 0.86 }}
      >
        <Mushroom className="h-full w-full drop-shadow-[0_4px_0_rgba(164,74,63,0.35)]" />
      </motion.button>

      {/* menú */}
      <Dialog
        open={open && view === 'menu'}
        onOpenChange={(next) => {
          if (!next) closeAll()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-2 flex flex-col gap-2.5">
            {canHint && (
              <MenuOption
                icon={<LuLightbulb />}
                label={m.hint}
                description={m.hintDesc}
                onClick={() => setView('hint')}
              />
            )}
            <MenuOption
              icon={<GiMushroomGills />}
              label={m.consume}
              description={m.consumeDesc}
              onClick={() => setView('trip')}
            />
            <MenuOption
              tone="danger"
              icon={<LuRotateCcw />}
              label={confirmRestart ? m.restartConfirm : m.restart}
              description={m.restartDesc}
              onClick={() => {
                if (!confirmRestart) {
                  setConfirmRestart(true)
                  return
                }
                closeAll()
                reset()
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {/* pista: caleidoscopio a pantalla completa, como antes */}
        {open && view === 'hint' && (
          <motion.div
            key="hint"
            className="fixed inset-0 z-[55] flex items-center justify-center overflow-hidden p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TrippyBackdrop />
            <button
              type="button"
              aria-label={copy.common.hintClose}
              onClick={closeAll}
              className="absolute inset-0 h-full w-full cursor-pointer"
            />
            <motion.div
              className="relative z-10 w-full max-w-sm rounded-3xl border-4 border-reddish-brown bg-light-yellow px-6 py-7 text-center shadow-[0_10px_0_rgba(0,0,0,0.35),0_0_0_6px_rgba(246,244,210,0.25)]"
              initial={{ scale: 0.7, y: 24, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={
                reduced ? { duration: 0.15 } : { type: 'spring', stiffness: 320, damping: 22 }
              }
            >
              {renderHint ? (
                renderHint({ close: closeAll })
              ) : (
                <>
                  <motion.p
                    className="font-display text-2xl leading-tight text-reddish-brown"
                    animate={
                      wobble && !reduced
                        ? { skewX: [-6, 6, -4, 4, 0], scale: [1, 1.04, 0.98, 1.02, 1] }
                        : undefined
                    }
                    transition={
                      wobble && !reduced
                        ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                        : undefined
                    }
                  >
                    {hint}
                  </motion.p>
                  <button
                    type="button"
                    onClick={() => setView('menu')}
                    className="mt-6 rounded-full border-2 border-reddish-brown px-5 py-1.5 font-display text-sm text-reddish-brown transition-transform active:scale-95"
                  >
                    {m.back}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* consumir */}
        {open && view === 'trip' && (
          <ConsumeTrip
            key="trip"
            durationMs={consumeDurationMs}
            growMs={consumeGrowMs ?? consumeDurationMs}
            maxScale={consumeMaxScale}
            overlay={consumeOverlay}
            onEnd={handleTripEnd}
          />
        )}
      </AnimatePresence>
    </>
  )
}
