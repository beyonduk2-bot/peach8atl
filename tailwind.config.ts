import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07162f",
        ocean: "#0b2d57",
        skysoft: "#e7f5ff",
        mist: "#f4fbff",
        teal: "#14b8a6",
        mint: "#ccfbf1",
        slatecopy: "#475569"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(7, 22, 47, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
