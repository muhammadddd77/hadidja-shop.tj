
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        background: "var(--color-bg)",
        foreground: "var(--color-fg)",
        card: "var(--color-card)",
        "card-foreground": "var(--color-card-fg)",
        border: "var(--color-border)",
        input: "var(--color-input)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-fg)",

        gold: {
          primary: "#c5a880",
          light: "#ecd9c2",
          dark: "#9d7d54",
        },

        noir: {
          DEFAULT: "#0e0d0c",
          soft: "#181615",
          card: "#211f1d",
          border: "rgba(255, 255, 255, 0.12)",
        },

        silk: {
          bg: "#fdfbf7",
          surface: "#f7f3ec",
          card: "#ffffff",
          border: "#ede4d6",
          line: "rgba(197, 168, 128, 0.25)",
        },

        whatsapp: {
          DEFAULT: "#25d366",
          dark: "#128c7e",
          glow: "rgba(37, 211, 102, 0.35)",
        },

        champagne: {
          DEFAULT: "#D4AF37",
          light: "#F0E5C9",
          dark: "#A8893E",
        },

        ivory: "#FFFFF0",
        "silk-beige": "#F5F0E6",
      },

      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
      },

      boxShadow: {
        gold: "0 8px 25px rgba(197, 168, 128, 0.25)",
        "gold-lg": "0 14px 40px rgba(197, 168, 128, 0.35)",
        card: "0 4px 20px rgba(0, 0, 0, 0.05)",
        "card-dark": "0 4px 20px rgba(0, 0, 0, 0.4)",
      },
    },
  },

  plugins: [],
};
