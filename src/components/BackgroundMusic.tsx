import { useEffect, useRef } from 'react'
import { Howl } from 'howler'
import { useGame } from '@/game/useGame'

const SRC = '/assets/audio/bg-music.mp3'
const TARGET_VOLUME = 0.32

/**
 * Loop setentoso de fondo. No hay autoplay real en iOS: arranca en el primer
 * gesto del usuario. Si el archivo todavía no existe, falla en silencio.
 */
export function BackgroundMusic() {
  const { state } = useGame()
  const howlRef = useRef<Howl | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const howl = new Howl({
      src: [SRC],
      loop: true,
      volume: 0,
      html5: true,
      onloaderror: () => {},
      onplayerror: () => {},
    })
    howlRef.current = howl

    const start = () => {
      if (startedRef.current) return
      startedRef.current = true
      howl.play()
      howl.fade(0, TARGET_VOLUME, 1200)
      detach()
    }
    const detach = () => {
      window.removeEventListener('pointerdown', start)
      window.removeEventListener('keydown', start)
    }

    window.addEventListener('pointerdown', start)
    window.addEventListener('keydown', start)

    return () => {
      detach()
      howl.unload()
    }
  }, [])

  useEffect(() => {
    howlRef.current?.mute(state.audioMuted)
  }, [state.audioMuted])

  return null
}
