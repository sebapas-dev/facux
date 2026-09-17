import { type GameState, initialState, SCREEN_ORDER, STATE_VERSION } from './types'

const KEY = 'facux:v1'

/** Reads persisted progress. `?reset` in the URL wipes it (handy while iterating). */
export function loadState(): GameState {
  if (typeof window === 'undefined') return initialState

  try {
    const url = new URL(window.location.href)
    if (url.searchParams.has('reset')) {
      window.localStorage.removeItem(KEY)
      url.searchParams.delete('reset')
      window.history.replaceState({}, '', url.pathname + url.search + url.hash)
      return initialState
    }

    // `?screen=moon` salta directo a una pantalla, con las anteriores dadas por
    // resueltas. Sólo para iterar; no se persiste.
    const jump = url.searchParams.get('screen')
    if (jump && SCREEN_ORDER.includes(jump as GameState['current'])) {
      const target = jump as GameState['current']
      const solved = { ...initialState.solved }
      for (const id of SCREEN_ORDER) {
        if (id === target || id === 'final') break
        solved[id as keyof typeof solved] = true
      }
      return { ...initialState, current: target, solved }
    }

    const raw = window.localStorage.getItem(KEY)
    if (!raw) return initialState

    const parsed = JSON.parse(raw) as Partial<GameState>
    if (parsed.version !== STATE_VERSION) return initialState
    if (!parsed.current || !SCREEN_ORDER.includes(parsed.current)) return initialState

    return {
      ...initialState,
      current: parsed.current,
      solved: { ...initialState.solved, ...parsed.solved },
      solvedVia: { ...parsed.solvedVia },
      audioMuted: Boolean(parsed.audioMuted),
      version: STATE_VERSION,
    }
  } catch {
    return initialState
  }
}

export function saveState(state: GameState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* private mode / quota — progress just won't survive a reload */
  }
}

export function clearState() {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
