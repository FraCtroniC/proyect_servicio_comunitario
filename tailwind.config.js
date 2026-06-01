/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0c1824',
        charcoal: '#152536',
        sand: '#f4efe4',
        coral: '#d74834',
        ember: '#b83228',
        moss: '#1a7a6e',
        sun: '#e8a317',
        gold: '#c9a227',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(12, 24, 36, 0.14)',
        sharp: '0 18px 50px rgba(12, 24, 36, 0.16), 0 2px 0 rgba(255,255,255,0.6) inset',
        glow: '0 14px 40px rgba(215, 72, 52, 0.28)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top left, rgba(215, 72, 52, 0.14), transparent 32%), radial-gradient(circle at bottom right, rgba(26, 122, 110, 0.14), transparent 30%)',
        'panel-accent': 'linear-gradient(135deg, #0c1824 0%, #152536 55%, #1a3a4f 100%)',
      },
    },
  },
  plugins: [],
};
