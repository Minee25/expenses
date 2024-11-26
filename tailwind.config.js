/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/js/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        "prompt": ["Prompt", "sans-serif"],
        "kanit": ["Kanit", "sans-serif"],
        "IPST": ["IBM Plex Sans Thai", "sans-serif"]
      }, 
    },
  },
  plugins: [],
}