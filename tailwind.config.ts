import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        midnight: {
          base: "#040711",
          dark: "#070C1E",
          card: "#0B1026",
        },
        aurora: {
          purple: "#A855F7",
          cyan: "#06B6D4",
          blue: "#3B82F6",
          orange: "#F97316",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-jakarta)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        montserrat: ["var(--font-jakarta)", "var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "radial-aurora":
          "radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(6, 182, 212, 0.12) 50%, transparent 80%)",
      },
    },
  },
  plugins: [],
};

export default config;
