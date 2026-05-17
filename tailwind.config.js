/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#10212f',
        sand: '#f7f3ea',
        coral: '#e76f51',
        moss: '#2a9d8f',
        sun: '#f4a261',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(16, 33, 47, 0.12)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(231, 111, 81, 0.16), transparent 30%), radial-gradient(circle at bottom right, rgba(42, 157, 143, 0.16), transparent 28%)',
      },
    },
  },
  plugins: [],
};