/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Authentic League of Legends Color Palette
        'league-dark': '#0A1428',           // Deep royal blue (client background)
        'league-darker': '#010A13',         // Darkest blue (shadows)
        'league-blue': '#1E2328',           // Magic blue (secondary backgrounds)
        'league-accent': '#0596AA',         // Champion blue (accents)
        'league-gold': '#C89B3C',           // Signature League gold
        'league-gold-light': '#F0E6D2',     // Parchment/light gold
        'league-bronze': '#785A28',         // Bronze/copper borders
        'league-silver': '#95A1A1',         // Silver elements
        'league-mana': '#0F48AA',           // Mana blue
        'league-health': '#00FF00',         // Health green
        'league-magic': '#8B5CF6',          // Magic purple
        'league-ancient': '#D4AF37',        // Ancient gold
        'league-parchment': '#F5F5DC',      // Parchment background
        'league-rune': '#00BFFF',           // Rune magic blue
      },
      fontFamily: {
        'league-serif': ['Cinzel', 'Trajan Pro', 'Times New Roman', 'serif'],
        'league-sans': ['Source Sans Pro', 'Roboto', 'Arial', 'sans-serif'],
        'league-display': ['Spectral', 'Georgia', 'serif'],
        'league-body': ['Inter', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'slot-spin': 'spin 0.5s ease-in-out',
        'card-flip': 'flip 0.6s ease-in-out',
        'damage': 'shake 0.5s ease-in-out',
        'hp-drain': 'width 1s ease-out',
        'magic-glow': 'magicGlow 3s ease-in-out infinite',
        'rune-float': 'runeFloat 8s ease-in-out infinite',
        'ancient-pulse': 'ancientPulse 2s ease-in-out infinite',
        'spell-cast': 'spellCast 1s ease-out',
        'champion-rise': 'championRise 1.2s ease-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        magicGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(200, 155, 60, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(200, 155, 60, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)' 
          },
        },
        runeFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-15px) rotate(5deg)' },
          '66%': { transform: 'translateY(-8px) rotate(-3deg)' },
        },
        ancientPulse: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.4)) brightness(1)',
          },
          '50%': {
            filter: 'drop-shadow(0 0 16px rgba(212, 175, 55, 0.8)) brightness(1.2)',
          },
        },
        spellCast: {
          '0%': { 
            opacity: 0, 
            transform: 'scale(0.8) rotateY(180deg)',
            filter: 'blur(4px)'
          },
          '50%': {
            opacity: 0.8,
            transform: 'scale(1.1) rotateY(90deg)',
            filter: 'blur(1px)'
          },
          '100%': { 
            opacity: 1, 
            transform: 'scale(1) rotateY(0deg)',
            filter: 'blur(0px)'
          },
        },
        championRise: {
          '0%': {
            opacity: 0,
            transform: 'translateY(40px) scale(0.9)',
            filter: 'brightness(0.7)'
          },
          '60%': {
            opacity: 0.8,
            transform: 'translateY(-5px) scale(1.02)',
            filter: 'brightness(1.1)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0px) scale(1)',
            filter: 'brightness(1)'
          },
        },
      },
      screens: {
        'desktop': '1024px',
        'xl-desktop': '1440px',
        'xxl-desktop': '1920px',
      },
      minWidth: {
        'desktop': '1024px',
      },
    },
  },
  plugins: [],
}