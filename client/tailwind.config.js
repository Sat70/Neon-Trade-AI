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
      animation: {
        'skeleton-shimmer': 'skeleton-shimmer 1.8s ease-in-out infinite',
      },
      keyframes: {
        'skeleton-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

