/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1a73e8',
          'blue-hover': '#185abc',
          gray: '#5f6368',
          'light-gray': '#f1f3f4',
          'border': '#dadce0',
        }
      },
      fontFamily: {
        sans: ['Product Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        'xs': '400px',
      },
    },
  },
  plugins: [],
}
