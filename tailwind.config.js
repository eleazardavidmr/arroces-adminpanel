/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)', // #ec9513
        background: {
          light: 'var(--color-background-light)', // #f8f7f6
          dark: 'var(--color-background-dark)',   // #221b10
        },
        surface: {
          light: 'var(--color-surface-light)', // #fcfaf8
          dark: 'var(--color-surface-dark)',   // #2a2215
        },
        border: {
          light: 'var(--color-border-light)', // #e7decf
          dark: 'var(--color-border-dark)',   // #403422
        },
        text: {
          light: 'var(--color-text-light)', // #1b160d
          dark: 'var(--color-text-dark)',   // #e8e3db
        },
        subtle: {
          light: 'var(--color-subtle-light)', // #9a7b4c
          dark: 'var(--color-subtle-dark)',   // #a38b63
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Asegúrate de tener esto si usas el toggle manual de dark mode
}