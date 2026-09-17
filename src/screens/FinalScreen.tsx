import { motion } from 'framer-motion'
import { MushroomHint } from '@/components/MushroomHint'
import { ScreenShell } from '@/components/ScreenShell'
import { Card, CardContent } from '@/components/ui/card'
import { copy } from '@/content/copy'
import type { ScreenProps } from './index'

/** Revelación final. Contenido 100% placeholder — se edita desde copy.ts (final.*). */
export function FinalScreen(_props: ScreenProps) {
  return (
    /* sin pista: acá el hongo sólo ofrece "consumir" y "volver a empezar" */
    <ScreenShell hint={<MushroomHint />}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardContent className="flex flex-col items-center gap-5 p-7 text-center">
            <h1 className="font-display text-3xl text-reddish-brown sm:text-4xl">
              {copy.final.title}
            </h1>
            <div className="grid aspect-square w-44 place-items-center rounded-2xl border-4 border-dashed border-reddish-brown/40 p-3 font-body text-sm text-reddish-brown/50">
              {copy.final.imageSlotAlt}
            </div>
            <p className="font-body text-lg leading-relaxed text-reddish-brown/85">
              {copy.final.message}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </ScreenShell>
  )
}
