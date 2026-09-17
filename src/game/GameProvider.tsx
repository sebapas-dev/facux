import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { loadState, saveState } from './persistence'
import { gameReducer } from './reducer'
import {
  type GameState,
  type PuzzleId,
  PUZZLE_IDS,
  type ScreenId,
  type SolveMethod,
} from './types'

export interface GameContextValue {
  state: GameState
  solvedCount: number
  puzzleTotal: number
  solveScreen: (id: PuzzleId, via?: SolveMethod) => void
  goNext: () => void
  goTo: (id: ScreenId) => void
  toggleMute: () => void
  reset: () => void
}

export const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const solveScreen = useCallback(
    (id: PuzzleId, via: SolveMethod = 'play') =>
      dispatch({ type: 'SOLVE_SCREEN', id, via }),
    [],
  )
  const goNext = useCallback(() => dispatch({ type: 'GO_NEXT' }), [])
  const goTo = useCallback((id: ScreenId) => dispatch({ type: 'GO_TO', id }), [])
  const toggleMute = useCallback(() => dispatch({ type: 'TOGGLE_MUTE' }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  const solvedCount = PUZZLE_IDS.filter((id) => state.solved[id]).length

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      solvedCount,
      puzzleTotal: PUZZLE_IDS.length,
      solveScreen,
      goNext,
      goTo,
      toggleMute,
      reset,
    }),
    [state, solvedCount, solveScreen, goNext, goTo, toggleMute, reset],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
