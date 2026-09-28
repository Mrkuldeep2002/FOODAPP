/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#F6F3ED',
        'bg-cream': '#EFECE5',
        'bg-white': '#FFFFFF',
        'brand-red': '#C91E1E',
        'brand-red-hover': '#AC1818',
        'brand-red-light': '#FCEFEF',
        'brand-orange': '#E86E2F',
        'brand-olive': '#5B6E46',
        'brand-olive-light': '#EAF0E6',
        'brand-sand': '#F4EFE6',
        'text-primary': '#1A1A1A',
        'text-secondary': '#6B6862',
        'text-tertiary': '#9E9A92',
        'success': '#2B8049',
        'success-light': '#E9F5ED',
        'warning': '#D9892B',
        'warning-light': '#FFF8ED',
        'error': '#C91E1E',
        'error-light': '#FCEFEF',
        'border': '#E5E1D8',
        'border-light': '#F0ECE4',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        cursive: ['"Caveat"', 'cursive', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(27, 25, 21, 0.06)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'float': '0 10px 30px rgba(201, 30, 30, 0.25)',
      }
    },
  },
  plugins: [],
}
