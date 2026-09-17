import type { ComponentType } from 'react'
import type { ScreenId, SolveMethod } from '@/game/types'
import { CassetteScreen } from './CassetteScreen'
import { FinalScreen } from './FinalScreen'
import { HarleyScreen } from './HarleyScreen'
import { MoonScreen } from './MoonScreen'
import { NameScreen } from './NameScreen'

export interface ScreenProps {
  /** marca la pantalla como resuelta; `via` distingue el atajo del hongo (pantalla 3) */
  onSolved: (via?: SolveMethod) => void
}

export const SCREENS: Record<ScreenId, ComponentType<ScreenProps>> = {
  name: NameScreen,
  harley: HarleyScreen,
  cassette: CassetteScreen,
  moon: MoonScreen,
  final: FinalScreen,
}
