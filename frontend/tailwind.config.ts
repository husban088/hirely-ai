import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // "obsidian" now IS the page background: pure white.
        obsidian: "#ffffff",
        // "charcoal" is a soft secondary surface (dropdown options, subtle panels).
        charcoal: "#fafafa",
        // "gold" is repurposed as the site's signature deep-blue luxury accent
        // used for headings, buttons, borders and icon backgrounds everywhere.
        gold: {
          DEFAULT: "#004F8E",
          light: "#2E86C8",
          dark: "#00263F",
        },
        // "ivory" is the primary text color — near-black for crisp legibility on white.
        ivory: "#18181b",
        // Overriding Tailwind's built-in "white" so every bg-white/X, border-white/X,
        // hover:bg-white/X utility across the app (originally tuned as light washes
        // over a dark theme) now renders as a soft dark-on-white wash instead —
        // this alone re-themes nearly every card, input and hover state app-wide.
        white: "#18181b",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #2E86C8 0%, #004F8E 55%, #00263F 100%)",
        noise:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        // Flat, shadow-free look — depth now comes from borders, gradients
        // and motion instead of drop shadows.
        gold: "none",
        "gold-lg": "none",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shine: {
          "0%": { transform: "translateX(-120%) skewX(-20deg)" },
          "100%": { transform: "translateX(220%) skewX(-20deg)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.04)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1.02)" },
          "100%": { transform: "scale(1.14)" },
        },
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        float: "float 6s ease-in-out infinite",
        shine: "shine 1.1s ease-in-out",
        "fade-up": "fadeUp 0.6s ease-out both",
        "glow-pulse": "glowPulse 3.5s ease-in-out infinite",
        "ken-burns": "kenBurns 8s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
