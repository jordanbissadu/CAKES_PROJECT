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
        vin: "var(--vin)",
        prune: "var(--prune)",
        "rose-mauve": "var(--rose-mauve)",
        framboise: "var(--framboise)",
        "rose-bonbon": "var(--rose-bonbon)",
        "rose-bonbon-clair": "var(--rose-bonbon-clair)",
        creme: "var(--creme)",
        blush: "var(--blush)",
        texte: "var(--texte)",
        "texte-doux": "var(--texte-doux)",
        blanc: "var(--blanc)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        body: ["var(--font-body)", "Nunito Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "999px",
        card: "20px",
        image: "16px",
        input: "12px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        hover: "var(--shadow-hover)",
        nav: "var(--shadow-nav)",
        focus: "var(--shadow-focus)",
      },
      maxWidth: {
        container: "1120px",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      screens: {
        // DS main component switch point
        nav: "860px",
      },
    },
  },
  plugins: [],
};
export default config;
