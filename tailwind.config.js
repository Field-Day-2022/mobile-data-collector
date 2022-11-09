/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'asu-maroon': '#8C1D40',
        'asu-gold': '#FFC627'
      },
      fontFamily: {
        'openSans': ['Open\\ Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}
