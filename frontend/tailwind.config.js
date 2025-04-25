/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // prend tous tes fichiers React dans src
  ],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['Pacifico', 'cursive'],
      },
      colors: {
        sidebar: {
          DEFAULT: '#1E3A8A',
          hover: '#1E40AF',
        },
      },
    },
  },
  plugins: [],
};
