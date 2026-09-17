import { type FormEvent, useMemo, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { LuArrowRight } from 'react-icons/lu'
import { MushroomHint } from '@/components/MushroomHint'
import { ScreenShell } from '@/components/ScreenShell'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { copy } from '@/content/copy'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { ScreenProps } from './index'

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

export function NameScreen({ onSolved }: ScreenProps) {
  const reduced = usePrefersReducedMotion()
  const shake = useAnimationControls()
  const [value, setValue] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [wrongMsg, setWrongMsg] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const accepted = useMemo(() => copy.name.accepted.map(normalize), [])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const guess = normalize(value)
    if (!guess) return

    if (accepted.includes(guess)) {
      setWrongMsg(null)
      setOpen(true)
      return
    }

    const next = attempts + 1
    setAttempts(next)
    setWrongMsg(copy.name.wrong[(next - 1) % copy.name.wrong.length])
    if (!reduced) {
      void shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.4 } })
    }
  }

  return (
    <ScreenShell hint={<MushroomHint hint={copy.name.hint} wobble />}>
      <div className="flex flex-col items-center gap-8 text-center">
        <motion.h1
          className="font-display text-4xl leading-tight text-reddish-brown sm:text-5xl"
          initial={reduced ? undefined : { rotate: -2, y: -10, opacity: 0 }}
          animate={reduced ? undefined : { rotate: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {copy.name.prompt}
        </motion.h1>

        <motion.form
          onSubmit={submit}
          animate={shake}
          className="flex w-full flex-col items-center gap-3"
        >
          <Input
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={copy.name.placeholder}
            aria-label={copy.name.prompt}
            enterKeyHint="send"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <Button type="submit" size="lg" className="w-full">
            {copy.name.submit}
            <LuArrowRight size={20} />
          </Button>
        </motion.form>

        {wrongMsg && (
          <motion.p
            key={attempts}
            className="font-display text-lg text-tangerine"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {wrongMsg}
          </motion.p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent hideClose>
          <DialogHeader>
            <DialogTitle>{copy.name.successTitle}</DialogTitle>
            <DialogDescription>{copy.name.successBody}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              size="lg"
              onClick={() => {
                setOpen(false)
                onSolved()
              }}
            >
              {copy.name.successCta}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScreenShell>
  )
}
