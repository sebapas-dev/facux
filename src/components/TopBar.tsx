import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'
import { copy } from '@/content/copy'
import { useGame } from '@/game/useGame'
import { Progress } from './ui/progress'

export function TopBar() {
  const { state, solvedCount, puzzleTotal, toggleMute } = useGame()
  const pct = (solvedCount / puzzleTotal) * 100

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))]">
      <div className="pointer-events-auto w-full max-w-[200px]">
        <Progress value={pct} aria-label={`${solvedCount} de ${puzzleTotal} resueltos`} />
      </div>
      <button
        type="button"
        onClick={toggleMute}
        aria-label={state.audioMuted ? copy.common.muteToActivate : copy.common.muteToSilence}
        className="pointer-events-auto ml-auto grid h-10 w-10 place-items-center rounded-full border-2 border-reddish-brown bg-light-yellow text-reddish-brown shadow-pop-sm transition-transform active:scale-95"
      >
        {state.audioMuted ? <IoVolumeMute size={18} /> : <IoVolumeHigh size={18} />}
      </button>
    </div>
  )
}
