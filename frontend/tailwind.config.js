/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hertz: {
          yellow: '#FFCC00',
          yellowHover: '#E5B800',
          dark: '#111827',
          surface: '#1F2937',
          charcoal: '#0B0F19'
        }
      }
    },
  },
  plugins: [],
}
