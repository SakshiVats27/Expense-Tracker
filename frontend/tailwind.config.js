/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}","./node_modules/tw-elements/dist/js/**/*.js"
],
  theme: {
    extend: {
      colors: {
    'brand-purple': '#7c3aed',
    'brand-yellow': '#facc15',
  },
      fontFamily: {
        handjet: ['Handjet', 'cursive'],
    mont: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
}