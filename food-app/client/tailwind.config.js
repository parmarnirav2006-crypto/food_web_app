/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        secondary: '#10B981'
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseSlow: 'pulse 3s ease-in-out infinite',
        slideIn: 'slideIn 0.4s ease-out forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        slideIn: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};
