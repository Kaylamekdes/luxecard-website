/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08080A',
        'bg-alt': '#0A0A0C',
        surface: '#0C0C0E',
        'surface-raised': '#0D0D10',
        'surface-hover': '#101013',
        ivory: '#F3F0EA',
        accent: '#FDD303',
        ink: '#0B0B0D',
        'grey-1': '#8C8A85',
        'grey-2': '#6F6D68',
        'grey-3': '#57554F',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        lux: 'cubic-bezier(.16, 1, .3, 1)',
      },
      keyframes: {
        lcFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'lc-float': 'lcFloat 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
