/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
import tailwindScrollbar from "tailwind-scrollbar-daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {keyframes: {
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(20px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
    animation: {
      fadeIn: 'fadeIn 1.5s ease-in forwards',
    },
   },
  },
  plugins: [daisyui, tailwindScrollbar],
  variants: {
    // ...
    scrollbar: ["rounded"],
  }, 
  daisyui: {
    themes: ["light"], 
  },
};
