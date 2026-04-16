/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{astro,tsx,ts}",
    "./node_modules/ei8studio-design-system/src/**/*.tsx",
  ],
  presets: [require("ei8studio-design-system/tailwind-preset").default],
  plugins: [require("tailwindcss-animate")],
};
