/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "mobile": { "min": "400px", "max": "768px" },
        "mobile1": { "min": "10px", "max": "400px" },
        "mobile2": { "min": "10px", "max": "768px" },
      }
    },
  },
  plugins: [],
}