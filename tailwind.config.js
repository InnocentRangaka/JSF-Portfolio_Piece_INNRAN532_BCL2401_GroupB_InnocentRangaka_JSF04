/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      zIndex: {
        '1': '1',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

