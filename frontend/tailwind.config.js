/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#B57EDC",
        accent: "#FF8FB1",
        bgdark: "#0F0A1A",
        glass: "rgba(255,255,255,0.08)",
        soft: "#F5F0FF",
      },
      boxShadow: {
        glow: "0 0 40px rgba(181,126,220,0.4)",
        "accent-glow": "0 0 40px rgba(255,143,177,0.4)",
      },
      keyframes: {
        "gradient-move": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.2)" },
        },
      },
      animation: {
        "gradient-move": "gradient-move 15s ease infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};