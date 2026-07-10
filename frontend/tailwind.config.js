/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F8F2E8',
          dark: '#EFE3D1',
        },
        gold: {
          DEFAULT: '#C59B45',
          dark: '#A8771E',
          light: '#E0C27E',
        },
        brown: {
          DEFAULT: '#6E4B2A',
          dark: '#4B2F1F',
        },
        leaf: {
          DEFAULT: '#5B7F3A',
          sage: '#A5B58A',
          dark: '#4A6630',
        },
        text: {
          DEFAULT: '#2B2B2B',
          muted: '#6E6E6E',
        },
        glow: 'rgba(255,220,130,0.3)',
        // Legacy aliases for shop pages
        primary: {
          DEFAULT: '#5B7F3A',
          dark: '#4A6630',
          light: '#A5B58A',
        },
        secondary: {
          DEFAULT: '#C59B45',
          dark: '#A8771E',
          light: '#E0C27E',
        },
        background: '#F8F2E8',
        accent: '#EFE3D1',
        ink: '#2B2B2B',
        stone: '#EFE3D1',
        clay: '#6E4B2A',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Poppins"', 'sans-serif'],
        ui: ['"Inter"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
        luxury: '0.18em',
      },
      maxWidth: {
        content: '1440px',
      },
      boxShadow: {
        soft: '0 8px 40px -12px rgba(75, 47, 31, 0.12)',
        card: '0 4px 24px -6px rgba(75, 47, 31, 0.1)',
        luxury: '0 20px 60px -20px rgba(75, 47, 31, 0.18)',
        glow: '0 0 60px rgba(255, 220, 130, 0.35)',
        'glow-sm': '0 0 30px rgba(255, 220, 130, 0.25)',
        glass: '0 8px 32px rgba(75, 47, 31, 0.08)',
        float: '0 24px 80px -16px rgba(75, 47, 31, 0.15)',
      },
      borderRadius: {
        xl2: '1.75rem',
        xl3: '2rem',
        pill: '9999px',
      },
      backgroundImage: {
        'cream-gradient': 'linear-gradient(135deg, #F8F2E8 0%, #EFE3D1 50%, #F8F2E8 100%)',
        'cream-warm': 'linear-gradient(180deg, #F8F2E8 0%, #EFE3D1 100%)',
        'gold-gradient': 'linear-gradient(135deg, #E0C27E 0%, #C59B45 50%, #A8771E 100%)',
        'moon-glow': 'radial-gradient(circle, rgba(255,220,130,0.4) 0%, rgba(255,220,130,0.1) 40%, transparent 70%)',
        'leaf-gradient': 'linear-gradient(135deg, #5B7F3A 0%, #A5B58A 100%)',
        'brown-gradient': 'linear-gradient(180deg, #6E4B2A 0%, #4B2F1F 100%)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        leafDrift: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(5deg)' },
          '66%': { transform: 'translateY(-8px) rotate(-3deg)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.8s ease forwards',
        float: 'float 6s ease-in-out infinite',
        floatSlow: 'floatSlow 8s ease-in-out infinite',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        leafDrift: 'leafDrift 12s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
