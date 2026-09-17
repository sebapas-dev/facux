export const SCREEN_ORDER = ['name', 'harley', 'cassette', 'moon', 'final'] as const

export type ScreenId = (typeof SCREEN_ORDER)[number]
export type PuzzleId = Exclude<ScreenId, 'final'>
export type SolveMethod = 'play' | 'shortcut'

export const PUZZLE_IDS: PuzzleId[] = ['name', 'harley', 'cassette', 'moon']

export interface GameState {
  version: number
  current: ScreenId
  solved: Record<PuzzleId, boolean>
  /** how each puzzle was cleared — `shortcut` = the mushroom trap (screen 3). */
  solvedVia: Partial<Record<PuzzleId, SolveMethod>>
  audioMuted: boolean
}

export type GameAction =
  | { type: 'SOLVE_SCREEN'; id: PuzzleId; via: SolveMethod }
  | { type: 'GO_NEXT' }
  | { type: 'GO_TO'; id: ScreenId }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'RESET' }

export const STATE_VERSION = 1

export const initialState: GameState = {
  version: STATE_VERSION,
  current: 'name',
  solved: { name: false, harley: false, cassette: false, moon: false },
  solvedVia: {},
  audioMuted: false,
}
