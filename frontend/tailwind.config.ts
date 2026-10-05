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
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: {
          DEFAULT: "#070A12",
          elevated: "#0D1322",
          card: "#121A2D",
          highlight: "#18233D",
        },
        prachar: {
          void: "#000000",
          charcoal: "#070A12",
          obsidian: "#050811",
          surface: "#0E1424",
          surfaceElevated: "#141C33",
          ivory: "#FBF8F3",
          ivoryWarm: "#F4EFEB",
          yellow: "#FF8800",
          yellowGlow: "rgba(255, 136, 0, 0.35)",
          red: "#E53935",
          redGlow: "rgba(229, 57, 53, 0.35)",
          blue: "#0EA5E9",
          blueGlow: "rgba(14, 165, 233, 0.35)",
          copper: "#E4B592",
          gold: "#D4AF37",
        },
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        copper: {
          DEFAULT: "#E4B592",
          light: "#F0D1BC",
          dark: "#B57C58",
          glow: "rgba(228, 181, 146, 0.35)",
        },
        space: {
          void: "#000000",
          obsidian: "#050811",
          starlight: "#FFF3EA",
          telemetry: "#DAD0C8",
          deep: "#090D16",
        },
        accent: {
          saffron: "#FF8800",
          amber: "#F59E0B",
          emerald: "#10B981",
          sky: "#0EA5E9",
          rose: "#E53935",
          violet: "#8B5CF6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(234, 88, 12, 0.25)',
        'glow-md': '0 0 25px -5px rgba(234, 88, 12, 0.35)',
        'glow-lg': '0 0 40px -10px rgba(234, 88, 12, 0.45)',
        'glow-copper': '0 0 25px -5px rgba(228, 181, 146, 0.35)',
        'glow-saffron': '0 0 35px 4px rgba(255, 136, 0, 0.4)',
        'glow-blue': '0 0 30px 4px rgba(14, 165, 233, 0.35)',
        'card-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'card-elevated': '0 25px 60px -15px rgba(0, 0, 0, 0.95)',
        'ivory-soft': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 0 1px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
