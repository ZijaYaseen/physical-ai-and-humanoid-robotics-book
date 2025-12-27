/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./docusaurus/**/*.{js,jsx,ts,tsx}",
    "./docs/**/*.{md,mdx}",
    "./node_modules/@docusaurus/core/lib/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@docusaurus/theme-classic/lib/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@docusaurus/theme-common/lib/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@docusaurus/preset-classic/lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}