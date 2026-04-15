import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        "4xl": "2rem",
      },
      colors: {
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        "surface-low": "var(--color-surface-low)",
        "on-surface": "var(--color-on-surface)",
        accent: "var(--color-accent)",
        "secondary-accent": "#D4AF37",
        "utility-chip": "#acf2c7",
        "qatar-sand": "#E3D5C8",
        "qatar-maroon": "#8A1538",
        "page-bg": "#faf9f6",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
