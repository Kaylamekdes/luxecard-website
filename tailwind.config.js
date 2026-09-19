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
          '50%': { transform: 'translateY(-16px)' },
        },
        marqueeLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        lcGlow: {
          '0%, 100%': { opacity: '.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        lcRipple: {
          '0%': { transform: 'scale(.4)', opacity: '0' },
          '30%': { opacity: '.55' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        lcBeam: {
          '0%': { transform: 'translateX(-30%) scaleX(.5)', opacity: '0' },
          '18%': { opacity: '.55' },
          '50%': { transform: 'translateX(10%) scaleX(1)', opacity: '.4' },
          '82%': { opacity: '.5' },
          '100%': { transform: 'translateX(50%) scaleX(.5)', opacity: '0' },
        },
        lcTravel: {
          '0%': { transform: 'translateY(-6%)', opacity: '0' },
          '15%': { opacity: '1' },
          '85%': { opacity: '1' },
          '100%': { transform: 'translateY(106%)', opacity: '0' },
        },
      },
      animation: {
        'lc-float': 'lcFloat 4.5s ease-in-out infinite',
        'marquee-left': 'marqueeLeft 32s linear infinite',
        'marquee-right': 'marqueeRight 38s linear infinite',
        'lc-glow': 'lcGlow 7s ease-in-out infinite',
        'lc-ripple': 'lcRipple 2.1s ease-out infinite',
        'lc-beam': 'lcBeam 8s ease-in-out infinite',
        'lc-travel': 'lcTravel 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
