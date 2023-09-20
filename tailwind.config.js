/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        body: "#F6F6F6",
        default: "#252525",
        primary: "#D83442",

        red: { DEFAULT: "#EB5353", 600: "#bc4242" },
        blue: { DEFAULT: "#548CFF" },
        green: { DEFAULT: "#36AE7C", 600: "#2b8b63", 700: "#20684a" },
        yellow: { DEFAULT: "#F8BF45", 600: "#dfac3e" },

        yemeksepeti: "#D93550",
        getir: "#5D3EBC",
        trendyol: "#EF6236",
      },
      fontFamily: {
        sans: ["Gilroy"],
      },
      borderRadius: {
        DEFAULT: "4px",
      },
      boxShadow: {
        DEFAULT: "0 0 12px 0 rgba(0, 0, 0, 0.03)",
      },
    },
  },
  plugins: [],
};
