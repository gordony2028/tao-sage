const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        'mountain-stone': '#4a5c6a',
        'flowing-water': '#6b8caf',
        'bamboo-green': '#7ba05b',
        'sunset-gold': '#d4a574',
        'earth-brown': '#8b7355',
        'morning-mist': '#e8f1f5',
        'cloud-white': '#fefefe',
        'ink-black': '#2c2c2c',
        'soft-gray': '#6b6b6b',
        'gentle-silver': '#a8b2b8',

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        serif: ['var(--font-crimson)', ...fontFamily.serif],
        mono: ['var(--font-jetbrains)', ...fontFamily.mono],
      },

      keyframes: {
        'natural-spin': {
          '0%': { transform: 'rotateY(0deg) scale(1)' },
          '50%': { transform: 'rotateY(180deg) scale(1.2)' },
          '100%': { transform: 'rotateY(360deg) scale(1)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'natural-spin': 'natural-spin 1.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },

      spacing: {
        18: '4.5rem',
        88: '22rem',
      },

      boxShadow: {
        'water-shadow': '0 8px 32px rgba(107, 140, 175, 0.15)',
        'mist-glow': '0 4px 20px rgba(232, 241, 245, 0.8)',
        'earth-shadow': '0 6px 24px rgba(139, 115, 85, 0.12)',
        'gentle-shadow': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'floating-shadow': '0 12px 40px rgba(74, 92, 106, 0.2)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
