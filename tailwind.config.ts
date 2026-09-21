import type { Config } from 'tailwindcss'

// Цвета берутся из CSS-переменных (src/index.css) и поддерживают прозрачность: bg-violet/40
const c = (name: string) => `rgb(var(--${name}-rgb) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: c('night-950'),
          900: c('night-900'),
          800: c('night-800'),
        },
        violet: c('violet'),
        lilac: c('lilac'),
        moon: c('moon'),
        indigo: c('indigo'),
        purple: c('purple'),
        ice: c('ice'),
        body: 'var(--text-body)',
        line: 'var(--line)',
      },
      fontFamily: {
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '28px',
        window: '40px',
      },
      maxWidth: {
        site: '1680px',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.08)' },
        },
        marquee: {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        breathe: 'breathe 9s ease-in-out infinite',
        'breathe-slow': 'breathe 14s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
