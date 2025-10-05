/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0a0a23',
          800: '#1a1a3e',
          700: '#2d2d5f',
          600: '#4040a1',
        },
        neon: {
          blue: '#00f5ff',
          purple: '#bf00ff',
          green: '#39ff14',
          pink: '#ff007f',
          gold: '#ffd700',
          orange: '#ff6600',
          red: '#ff073a',
        }
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'laser': 'laser 0.3s ease-out',
        'explosion': 'explosion 0.5s ease-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor' },
          '50%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'laser': {
          '0%': { opacity: '0', transform: 'scaleY(0)' },
          '100%': { opacity: '1', transform: 'scaleY(1)' },
        },
        'explosion': {
          '0%': { opacity: '1', transform: 'scale(0)' },
          '50%': { opacity: '0.8', transform: 'scale(1.2)' },
          '100%': { opacity: '0', transform: 'scale(2)' },
        }
      },
      backgroundImage: {
        'space-gradient': 'radial-gradient(ellipse at center, #1e3c72 0%, #2a5298 50%, #0a0a23 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      }
    },
  },
  plugins: [],
}