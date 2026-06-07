import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // monochrome palette — resolves via CSS variables so light/dark swap cleanly
        forest: {
          50: "rgb(var(--c-fg) / <alpha-value>)",
          100: "rgb(var(--c-fg) / <alpha-value>)",
          300: "rgb(var(--c-accent-1) / <alpha-value>)",
          500: "rgb(var(--c-accent-2) / <alpha-value>)",
          700: "rgb(var(--c-accent-3) / <alpha-value>)",
          900: "rgb(var(--c-accent-3) / <alpha-value>)",
        },
        ember: {
          400: "rgb(var(--c-warm-1) / <alpha-value>)",
          500: "rgb(var(--c-warm-2) / <alpha-value>)",
          600: "rgb(var(--c-warm-3) / <alpha-value>)",
        },
        ink: {
          900: "rgb(var(--c-bg-1) / <alpha-value>)",
          800: "rgb(var(--c-bg-2) / <alpha-value>)",
          700: "rgb(var(--c-bg-3) / <alpha-value>)",
        },
        // forest-clearing scene palette
        scene: {
          "sky-top": "rgb(var(--s-sky-top) / <alpha-value>)",
          "sky-bottom": "rgb(var(--s-sky-bottom) / <alpha-value>)",
          sun: "rgb(var(--s-sun) / <alpha-value>)",
          "pine-far": "rgb(var(--s-pine-far) / <alpha-value>)",
          "pine-mid": "rgb(var(--s-pine-mid) / <alpha-value>)",
          "pine-near": "rgb(var(--s-pine-near) / <alpha-value>)",
          water: "rgb(var(--s-water) / <alpha-value>)",
          "water-deep": "rgb(var(--s-water-deep) / <alpha-value>)",
          ground: "rgb(var(--s-ground) / <alpha-value>)",
          "ground-shadow": "rgb(var(--s-ground-shadow) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        spotlight: {
          "0%": { opacity: "0", transform: "translate(-72%, -62%) scale(0.5)" },
          "100%": { opacity: "1", transform: "translate(-50%,-40%) scale(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        spotlight: "spotlight 2s ease 0.4s 1 forwards",
        "fade-up": "fade-up 0.6s ease-out forwards",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
