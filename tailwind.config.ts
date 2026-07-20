// tailwind.config.ts — extend with aurora color tokens & shadow utilities
// This file already exists; we reference it to ensure tokens are available
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
      },
      colors: {
        "midnight": "#030509",
        "midnight-elevated": "#060a12",
        "aurora-cyan": "rgba(6, 182, 212, 1)",
        "aurora-purple": "rgba(168, 85, 247, 1)",
      },
      boxShadow: {
        "glass-lg": "0 8px 32px -4px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 0 rgba(255,255,255,0.08)",
        "aurora-glow": "0 0 40px -8px rgba(6,182,212,0.3), 0 0 80px -16px rgba(168,85,247,0.2), 0 8px 32px -4px rgba(0,0,0,0.5)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "aurora-drift": {
          "0%": { opacity: "0.7", transform: "scale(1) translate(0, 0)" },
          "100%": { opacity: "1", transform: "scale(1.05) translate(-2%, 1%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out both",
        "aurora-drift": "aurora-drift 20s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};
export default config;
