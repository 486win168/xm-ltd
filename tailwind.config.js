/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#002b5b",
          dark: "#001f42",
          accent: "#ff6a00",
        },
      },
    },
  },
  plugins: [],
};
