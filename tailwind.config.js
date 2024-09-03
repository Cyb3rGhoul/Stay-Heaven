/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar-daisyui")],
  variants: {
    // ...
    scrollbar: ["rounded"],
  }, 
  daisyui: {
    themes: ["light"], 
  },
};
