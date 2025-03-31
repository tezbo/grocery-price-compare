/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',  // Make sure this is included for Next.js 13+ app directory
    './pages/**/*.{js,ts,jsx,tsx}', // For the pages directory
    './components/**/*.{js,ts,jsx,tsx}', // For components directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};