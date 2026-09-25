/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-navy': '#1e293b',
        'brand-gray': '#f8fafc',
        'brand-blue': '#2563eb',
        'status-critical': '#dc2626',
        'status-warning': '#d97706',
        'status-normal': '#16a34a',
        gov: {
          teal: '#0b272f',
          tealLight: '#0f3741',
          tealLighter: '#1a515f',
          saffron: '#ff9933',
          green: '#138808',
          paper: '#f4f6f8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
