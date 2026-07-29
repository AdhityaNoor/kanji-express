/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        jp: ['"Noto Sans JP"', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: 'rgb(var(--bg) / <alpha-value>)',
          soft: 'rgb(var(--bg-soft) / <alpha-value>)',
          card: 'rgb(var(--bg-card) / <alpha-value>)',
          hover: 'rgb(var(--bg-hover) / <alpha-value>)',
        },
        line: 'rgb(var(--line) / <alpha-value>)',
        fg: {
          DEFAULT: 'rgb(var(--fg) / <alpha-value>)',
          strong: 'rgb(var(--fg-strong) / <alpha-value>)',
          muted: 'rgb(var(--muted) / <alpha-value>)',
          faint: 'rgb(var(--faint) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          strong: 'rgb(var(--accent-strong) / <alpha-value>)',
          fg: 'rgb(var(--accent-fg) / <alpha-value>)',
          on: 'rgb(var(--on-accent) / <alpha-value>)',
        },
        heat: {
          1: 'rgb(var(--heat-1) / <alpha-value>)',
          2: 'rgb(var(--heat-2) / <alpha-value>)',
          3: 'rgb(var(--heat-3) / <alpha-value>)',
          4: 'rgb(var(--heat-4) / <alpha-value>)',
        },
        sakura: '#ff6b9d',
        matcha: '#2fd67f',
        amber: '#ffb020',
        coral: '#ff6a5a',
      },
      boxShadow: {
        card: '0 1px 2px rgb(var(--shadow) / 0.22), 0 10px 30px rgb(var(--shadow) / 0.14)',
        glow: '0 0 0 1px rgb(var(--accent) / 0.30), 0 8px 30px rgb(var(--accent) / 0.20)',
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.96)' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
        'pop': 'pop 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}
