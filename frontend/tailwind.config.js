/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // Modern color palette with better contrast
        primary: {
          light: '#8B5CF6',  // lighter purple
          DEFAULT: '#7C3AED', // your existing brand purple
          dark: '#6D28D9'     // darker purple
        },
        secondary: {
          light: '#FDE047',   // lighter yellow
          DEFAULT: '#FACC15', // your existing brand yellow
          dark: '#EAB308'     // darker yellow
        },
        // Additional colors for complete palette
        accent: '#EC4899',    // pink accent
        success: '#10B981',    // emerald green
        warning: '#F59E0B',    // amber
        danger: '#EF4444',     // red
        dark: '#1E293B',       // slate-800
        light: '#F8FAFC'       // slate-50
      },
      fontFamily: {
        handjet: ['Handjet', 'cursive'],
        mont: ['Montserrat', 'sans-serif'],
        // Adding a system font stack as default
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ]
      },
      // Enhanced responsive breakpoints
      screens: {
        'xs': '475px',   // Extra small devices
        'sm': '640px',  // Small devices
        'md': '768px',  // Medium devices
        'lg': '1024px', // Large devices
        'xl': '1280px', // Extra large devices
        '2xl': '1536px' // Double extra large
      }
    },
  },
  plugins: [
    require("tw-elements/dist/plugin.cjs"),
    require('@tailwindcss/forms'), // Optional: for better form styling
    require('@tailwindcss/typography') // Optional: for prose content
  ],
}