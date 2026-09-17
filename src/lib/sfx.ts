export const SFX = {
  harleyFail: '/assets/audio/harley-fail.mp3',
  harleyStart: '/assets/audio/harley-start.mp3',
  cassetteRewind: '/assets/audio/cassette-rewind.mp3',
  wolfHowl: '/assets/audio/wolf-howl.mp3',
} as const

export type SfxKey = keyof typeof SFX
