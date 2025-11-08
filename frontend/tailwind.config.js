/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'tmobile-magenta': '#E20074',
        'tmobile-pink': '#EA0A8E',
        'tmobile-purple': '#9B26B6',
      },
    },
  },
  plugins: [],
}
