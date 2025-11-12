export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4c6ef5',
          50: '#eef2ff',
          100: '#dbe3ff',
          200: '#b8c7ff',
          300: '#91a9ff',
          400: '#748ffc',
          500: '#4c6ef5',
          600: '#3b5bdb',
          700: '#304ac7',
          800: '#273ba4',
          900: '#1d2d82'
        },
        slate: {
          950: '#0f172a'
        },
        accent: '#f7b731',
        danger: '#f87171',
        success: '#22c55e',
        warning: '#f59e0b'
      },
      fontFamily: {
        sans: ['"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 24px 60px rgba(76, 110, 245, 0.12)',
        card: '0 18px 40px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
}
