/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
  './node_modules/preline/preline.js',
  'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#043D3D',
        'table-header-color': '#04847c',
        'color': '#043D3D',
        'input-bord-color': '#E5E7EB',
        'input-focus-color': '#000',
        'secondary-color': '#04847C',
        'color-active':'#47B0A4',
        'hr-color':'#47B0A4'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('preline/plugin')
  ],
}
