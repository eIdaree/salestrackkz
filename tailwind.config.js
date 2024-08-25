/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Add this line to enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "blue-20": "#D0E3FF",
        "blue-40": "#76A8FF",
        "blue-60": "#176FFD",
        "blue-100": "#051028",
        "white-100": "#F9F9F9",
      },
    },
  },
  plugins: [],
}
