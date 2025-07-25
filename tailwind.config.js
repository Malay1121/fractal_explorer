/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        space: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#0F0F1A',
        },
        electric: {
          blue: '#00E0FF',
          magenta: '#FF2CFB',
          purple: '#8E2DE2',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.08)',
        }
      },
      backdropBlur: {
        'glass': '12px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { 
            textShadow: '0 0 20px rgba(0, 224, 255, 0.5), 0 0 30px rgba(0, 224, 255, 0.3), 0 0 40px rgba(0, 224, 255, 0.2)'
          },
          '100%': { 
            textShadow: '0 0 30px rgba(0, 224, 255, 0.8), 0 0 40px rgba(0, 224, 255, 0.5), 0 0 50px rgba(0, 224, 255, 0.3)'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
};