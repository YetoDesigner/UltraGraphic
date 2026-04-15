/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Digital sans EF"', 'Outfit', 'sans-serif'],
      },
      colors: {
        primary: '#F27D26',
        surface: '#121212',
        card: '#1E1E1E',
      }
    },
  },
  plugins: [],
}
