import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      colors: {
        border: 'hsl(214 32% 91%)',
        background: 'hsl(210 33% 98%)',
        foreground: 'hsl(222 47% 11%)',
        card: 'hsl(0 0% 100%)',
        primary: 'hsl(217 91% 60%)',
        muted: 'hsl(210 25% 96%)',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config
