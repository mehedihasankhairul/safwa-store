/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        'book-maroon': '#800000',
        'book-gold': '#D4A017',
        'book-offwhite': '#F9F6F2',
        'book-charcoal': '#333333',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        opensans: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
};
