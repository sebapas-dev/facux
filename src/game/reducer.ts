import {
  type GameAction,
  type GameState,
  initialState,
  type PuzzleId,
  SCREEN_ORDER,
} from './types'

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SOLVE_SCREEN': {
      if (state.solved[action.id]) return state
      return {
        ...state,
        solved: { ...state.solved, [action.id]: true },
        solvedVia: {
          ...state.solvedVia,
          [action.id]: state.solvedVia[action.id] ?? action.via,
        },
      }
    }

    case 'GO_NEXT': {
      if (state.current !== 'final' && !state.solved[state.current as PuzzleId]) {
        return state
      }
      const idx = SCREEN_ORDER.indexOf(state.current)
      const next = SCREEN_ORDER[Math.min(idx + 1, SCREEN_ORDER.length - 1)]
      return next === state.current ? state : { ...state, current: next }
    }

    case 'GO_TO':
      return state.current === action.id ? state : { ...state, current: action.id }

    case 'TOGGLE_MUTE':
      return { ...state, audioMuted: !state.audioMuted }

    case 'RESET':
      return { ...initialState }

    default:
      return state
  }
}
