/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/**/**/**/*.{js,ts,jsx,tsx}",
    "./components/**/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      height: {
        scrollH: "calc(100vh - 13rem)",
        H7HalfRem: "calc(100vh - 7.5rem)",
        medegdelHariltsagchPhone: "calc(100vh - 27rem)",
      },
      colors: {
        green: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
      },
    },
  },
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  plugins: [],
};
