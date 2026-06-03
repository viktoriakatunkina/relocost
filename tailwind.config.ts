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
        // Relocost palette — раздел 5 ТЗ
        "pine-tree": "var(--pine-tree)",
        "kombu-green": "var(--kombu-green)",
        dingley: "var(--dingley)",
        brandy: "var(--brandy)",
        "pale-copper": "var(--pale-copper)",
        "cream": "var(--white)",
        "muted-green": "var(--muted)",
        "dim-green": "var(--dim)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      borderRadius: {
        pill: "100px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
