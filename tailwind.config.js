/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        gideon: ['"Gideon Roman"', 'serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}

