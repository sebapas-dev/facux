import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'vanilla-custard': 'var(--vanilla-custard)',
        'light-yellow': 'var(--light-yellow)',
        'tea-green': 'var(--tea-green)',
        'tangerine-dream': 'var(--tangerine-dream)',
        tangerine: 'var(--tangerine-dream)',
        'reddish-brown': 'var(--reddish-brown)',
        'garage-rust': 'var(--garage-rust)',
      },
      fontFamily: {
        display: ['Figtree', 'system-ui', 'sans-serif'],
        body: ['Figtree', 'system-ui', 'sans-serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pop: '0 5px 0 rgba(39, 33, 30, 0.42), 0 12px 24px rgba(39, 33, 30, 0.14)',
        'pop-sm': '0 3px 0 rgba(39, 33, 30, 0.38), 0 8px 16px rgba(39, 33, 30, 0.12)',
      },
      keyframes: {
        'grain-shift': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-4%, -4%)' },
          '30%': { transform: 'translate(3%, -2%)' },
          '50%': { transform: 'translate(-2%, 4%)' },
          '70%': { transform: 'translate(4%, 2%)' },
          '90%': { transform: 'translate(-3%, -3%)' },
        },
      },
      animation: {
        'grain-shift': 'grain-shift 8s steps(6) infinite',
      },
    },
  },
  plugins: [animate],
} satisfies Config
