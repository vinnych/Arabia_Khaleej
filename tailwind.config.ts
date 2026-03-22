import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8A1538",
        "primary-dark": "#640023",
        "surface-low": "#f4f3f1",
        "on-surface": "#1a1c1a",
        "secondary-accent": "#D4AF37",
        "utility-chip": "#acf2c7",
        "qatar-sand": "#E3D5C8",
        "qatar-maroon": "#8A1538",
        "page-bg": "#faf9f6",
      },
      fontFamily: {
        newsreader: ["var(--font-newsreader)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
