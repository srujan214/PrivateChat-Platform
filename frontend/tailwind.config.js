/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#B57EDC",
        accent: "#FF8FB1",
        soft: "#F5F0FF",
      },
    },
  },
  plugins: [],
};