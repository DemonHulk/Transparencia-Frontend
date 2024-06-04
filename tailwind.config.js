/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
  './node_modules/preline/preline.js',
  'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#003C3D',
        'primary-color-50': '#003C3D',
        'primary-color-90': '#003C3D',
        'table-header-color': '#077c01',
        'color': '#003C3D',
        'input-bord-color': '#EDEDED',
        'input-focus-color': '#000',
        'secondary-color': '#008779',
        'secondary-color-90': '#008779e6',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('preline/plugin')
  ],
}
