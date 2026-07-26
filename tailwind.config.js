/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        void: '#050505',
        surface: '#0d0d0f',
        gold: {
          DEFAULT: '#F4C430',
          light: '#FFE08A',
          dark: '#B8860B'
        },
        ivory: '#FFFFFF',
        ash: '#9CA3AF',
        cyan: {
          DEFAULT: '#00D9FF'
        }
      },
      fontFamily: {
        vazir: ['Vazirmatn', 'sans-serif']
      },
      boxShadow: {
        gold: '0 0 40px rgba(244,196,48,0.25)',
        'gold-lg': '0 0 80px rgba(244,196,48,0.35)',
        glass: '0 8px 32px rgba(0,0,0,0.55)'
      },
      backdropBlur: {
        xs: '2px'
      },
      keyframes: {
        floatY: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        glow: {
          '0%,100%': { opacity: 0.55 },
          '50%': { opacity: 1 }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        floatY: 'floatY 6s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
        shimmer: 'shimmer 3.5s linear infinite'
      }
    }
  },
  plugins: []
};
