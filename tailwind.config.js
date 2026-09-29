/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        walnut: {
          50: '#FBF8F5',
          100: '#F5EFE9',
          200: '#E8DCcf',
          300: '#D4C0AD',
          400: '#BA9C82',
          500: '#9E7858',
          600: '#8B5A2B', // --primary
          700: '#73461E',
          800: '#5C3618',
          900: '#482B14',
          950: '#2A170A',
        },
        tealAccent: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0F766E', // --accent
          700: '#0F645E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        brand: {
          primary: 'var(--color-primary)',
          primaryDark: 'var(--color-primary-dark)',
          accent: 'var(--color-accent)',
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          text: 'var(--color-text)',
          muted: 'var(--color-muted)',
          border: 'var(--color-border)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        urdu: ['Noto Nastaliq Urdu', 'Noto Naskh Arabic', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(31, 26, 20, 0.05), 0 1px 2px -1px rgba(31, 26, 20, 0.05)',
        'card': '0 4px 6px -1px rgba(31, 26, 20, 0.07), 0 2px 4px -2px rgba(31, 26, 20, 0.07)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 15px rgba(139, 90, 43, 0.25)',
      }
    },
  },
  plugins: [],
}
