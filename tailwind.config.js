/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],

  darkMode: "class",
  theme: {
    extend: {
      maxHeight: { maxScrollH: "calc(100vh - 20rem)" },
      height: {
        scrollH: "calc(100vh - 15.5rem)",
        H7HalfRem: "calc(100vh - 8.5rem)",
        HMobile: "calc(100vh - 5rem)",
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
      animation: {
        "spin-slow": "spin 4s linear infinite",
        "spin-mid": "spin 2s linear infinite",
        "bounce-fast": "bounce 0.5s infinite",
      },
      fontSize: {
        mashJijigiinJijig: ["12px", "12px"],
        mashJijigiinDundaj: ["10px", "10px"],
        buurJijig: ["8px", "8px"],
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
