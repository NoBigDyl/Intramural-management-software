/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0C10',
        charcoal: '#1F2833',
        mist: '#C5C6C7',
        neon: {
          blue: '#66FCF1',
          cyan: '#45A29E',
          purple: '#B537F2'
        },
        glass: {
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          300: 'rgba(255, 255, 255, 0.3)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #1F2833 0deg, #0B0C10 180deg, #1F2833 360deg)',
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(102, 252, 241, 0.3)',
        'neon-purple': '0 0 15px rgba(181, 55, 242, 0.3)',
      }
    },
  },
  plugins: [],
}
