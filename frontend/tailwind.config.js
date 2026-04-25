/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f7f0e6',
          100: '#efe4d4',
          500: '#d18a57',
          600: '#b56535',
          700: '#1f4d3a',
        },
      },
    },
  },
  plugins: [],
};
