import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FBF9F5",
          subtle: "#F5F0E8",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F7F5F0",
        },
        border: {
          DEFAULT: "#E7E2D8",
          focus: "#D97706",
          dark: "#D1CABE",
        },
        primary: {
          DEFAULT: "#D97706", // Burnt Amber
          hover: "#B45309",
          active: "#92400E",
          soft: "#FEF3C7",
        },
        terracotta: {
          DEFAULT: "#C2410C", // Alert & emphasis
          hover: "#9A3412",
          soft: "#FFEDD5",
        },
        charcoal: {
          900: "#1C1917", // Primary text
          700: "#44403C", // Secondary text
          500: "#78716C", // Muted text
          300: "#A8A29E",
          100: "#F5F5F4",
        },
        success: {
          DEFAULT: "#059669",
          soft: "#D1FAE5",
        }
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "Helvetica", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "'Liberation Mono'", "'Courier New'", "monospace"],
      },
      boxShadow: {
        "warm-sm": "0 1px 3px 0 rgba(28, 25, 23, 0.04), 0 1px 2px -1px rgba(28, 25, 23, 0.04)",
        "warm-md": "0 4px 6px -1px rgba(28, 25, 23, 0.06), 0 2px 4px -2px rgba(28, 25, 23, 0.06)",
        "warm-lg": "0 10px 15px -3px rgba(28, 25, 23, 0.07), 0 4px 6px -4px rgba(28, 25, 23, 0.07)",
        "warm-xl": "0 20px 25px -5px rgba(28, 25, 23, 0.08), 0 8px 10px -6px rgba(28, 25, 23, 0.08)",
      },
      borderRadius: {
        "tactile": "12px",
      }
    },
  },
  plugins: [],
};

export default config;
