/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-fixed-dim": "#93d3c3",
        "secondary-fixed": "#bfeaf1",
        "on-secondary-fixed-variant": "#224d53",
        "surface-variant": "#e9e2d0",
        "tertiary": "#7f5161",
        "on-secondary-fixed": "#001f23",
        "on-surface-variant": "#3f4946",
        "outline": "#6f7976",
        "inverse-on-surface": "#f7f0dd",
        "secondary": "#3b656b",
        "tertiary-container": "#f6bcce",
        "on-primary-fixed": "#00201a",
        "surface-dim": "#e0dac7",
        "primary-container": "#98d8c8",
        "on-tertiary-fixed-variant": "#643a49",
        "surface-container-lowest": "#ffffff",
        "surface-container-highest": "#e9e2d0",
        "secondary-fixed-dim": "#a3ced5",
        "inverse-primary": "#93d3c3",
        "on-surface": "#1e1c10",
        "error": "#ba1a1a",
        "on-primary-container": "#1d6053",
        "tertiary-fixed": "#ffd9e3",
        "on-primary": "#ffffff",
        "surface-bright": "#fff9ec",
        "on-tertiary": "#ffffff",
        "on-error-container": "#93000a",
        "outline-variant": "#bfc9c5",
        "on-tertiary-fixed": "#32101e",
        "surface-container": "#f4eedb",
        "background": "#fff9ec",
        "surface": "#fff9ec",
        "inverse-surface": "#333024",
        "surface-container-high": "#efe8d5",
        "secondary-container": "#bce7ee",
        "on-secondary": "#ffffff",
        "on-tertiary-container": "#754958",
        "primary": "#28695c",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-primary-fixed-variant": "#045044",
        "on-secondary-container": "#40696f",
        "primary-fixed": "#afefdf",
        "surface-container-low": "#faf3e0",
        "on-background": "#1e1c10",
        "tertiary-fixed-dim": "#f1b7c9",
        "surface-tint": "#28695c"
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
      spacing: {
        "container-padding-mobile": "24px",
        "container-padding-desktop": "48px",
        "unit": "8px",
        "section-gap": "40px",
        "gutter": "16px"
      },
      fontFamily: {
        "headline-lg-mobile": ["Plus Jakarta Sans", "sans-serif"],
        "headline-xl": ["Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "sans-serif"],
        "label-md": ["Quicksand", "sans-serif"],
        "body-lg": ["Quicksand", "sans-serif"],
        "body-md": ["Quicksand", "sans-serif"],
        "label-sm": ["Quicksand", "sans-serif"]
      }
    }
  },
  plugins: [],
}
