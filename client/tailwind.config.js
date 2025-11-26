/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          neon: '#7c3aed',
          mint: '#2dd4bf',
        },
      },
    },
  },
  plugins: [],
}

