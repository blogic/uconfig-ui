/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      primary: colors.blue,
      secondary: colors.cyan,
      tertiary: colors.teal,
      success: colors.green,
      danger: colors.red,
      warning: colors.yellow,
      current: colors.current,
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      transparent: colors.transparent,
    },
    extend: {},
  },
  plugins: [],
};
