/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#CF2791',
        'secondary': '#fff5fc',
      },
    },
  },
  plugins: [require('daisyui'),require('@tailwindcss/line-clamp')],
  daisyui: {
    themes: ["light"],
  },
}

