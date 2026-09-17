import { useCallback, useEffect, useRef } from 'react'
import { Howl } from 'howler'
import { useGame } from '@/game/useGame'

/**
 * Reproduce SFX cortos con howler (pooling + baja latencia). Respeta el mute
 * global. Si el archivo no existe, no pasa nada.
 */
export function useSfx() {
  const { state } = useGame()
  const mutedRef = useRef(state.audioMuted)
  const cache = useRef(new Map<string, Howl>())

  useEffect(() => {
    mutedRef.current = state.audioMuted
  }, [state.audioMuted])

  const play = useCallback((src: string) => {
    if (mutedRef.current) return
    let howl = cache.current.get(src)
    if (!howl) {
      howl = new Howl({ src: [src], preload: true, onloaderror: () => {}, onplayerror: () => {} })
      cache.current.set(src, howl)
    }
    howl.play()
  }, [])

  useEffect(() => {
    const map = cache.current
    return () => {
      map.forEach((howl) => howl.unload())
      map.clear()
    }
  }, [])

  return play
}
