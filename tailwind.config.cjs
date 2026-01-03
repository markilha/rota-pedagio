/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        body: ["'Work Sans'", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          900: "#0b0f14",
          800: "#121826",
          700: "#1b2332",
          600: "#2b3548",
          500: "#3b465c",
          400: "#5a6a85",
          300: "#7e90aa",
          200: "#c7d1e0",
          100: "#e7ecf4",
        },
        highlight: {
          500: "#f59f0b",
          400: "#ffd166",
        },
        emerald: {
          500: "#2ec4b6",
          400: "#7bdff2",
        },
      },
      boxShadow: {
        glow: "0 20px 45px rgba(0,0,0,0.25)",
      },
    },
  },
  plugins: [],
};
