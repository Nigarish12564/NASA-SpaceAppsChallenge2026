/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: '#05070D',
        accent: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
      },
      boxShadow: {
        'accent-glow': '0 0 30px 0 var(--color-accent-glow)',
      },
    },
  },
  plugins: [],
};
