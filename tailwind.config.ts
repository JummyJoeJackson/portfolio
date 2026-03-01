import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--background)',
        ink: 'var(--foreground)',
        muted: 'var(--muted)',
        rule: 'var(--rule)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        display: ['Canela', 'Georgia', 'serif'],
        body: ['iA Writer Quattro', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        reading: '720px',
        wide: '1100px',
      },
    },
  },
  plugins: [],
}

export default config
