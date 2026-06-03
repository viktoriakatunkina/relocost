import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "pine-tree": "var(--pine-tree)",
        "kombu-green": "var(--kombu-green)",
        dingley: "var(--dingley)",
        brandy: "var(--brandy)",
        "pale-copper": "var(--pale-copper)",
        copper: "var(--copper)",
        cream: "var(--white)",
        "muted-green": "var(--muted)",
        "dim-green": "var(--dim)",
        surface: "var(--surface)",
        "surface-elevated": "var(--surface-elevated)",
        hairline: "var(--hairline)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      fontSize: {
        display: ["clamp(2.75rem, 6vw + 1rem, 6rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        pill: "100px",
      },
      boxShadow: {
        glow: "0 24px 80px -32px rgba(196, 134, 109, 0.55)",
        card: "0 32px 64px -32px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
