/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
  './node_modules/preline/preline.js',
  'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#077c01',
        'primary-color-50': '#077c0180',
        'primary-color-90': '#077c01e6',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('preline/plugin')
  ],
}
