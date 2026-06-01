/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0f172a',
        charcoal: '#1e293b',
        slate: '#64748b',
        mist: '#f8fafc',
        paper: '#ffffff',
        line: '#e2e8f0',
        accent: '#1e3a5f',
        accentMuted: '#334155',
        bronze: '#92764a',
        danger: '#991b1b',
        warning: '#92400e',
        success: '#166534',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(15, 23, 42, 0.08)',
        card: '0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 48px rgba(15, 23, 42, 0.06)',
      },
      backgroundImage: {
        'app-surface': 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        'panel-dark': 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)',
      },
    },
  },
  plugins: [],
};
