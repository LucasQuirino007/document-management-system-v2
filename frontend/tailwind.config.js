/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -15px rgba(14, 116, 144, 0.35)',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

