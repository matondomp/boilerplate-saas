/** @type {import('tailwindcss').Config} */
export default {
  content: ['./**/*.vue'],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#0099ff",
          secondary: "teal",
        },
      },
      { dark: {

      } },
    ],
  },
  darkMode: ['class', '[data-theme="dark"]'],
  plugins: [require('daisyui')],
}
