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
        soc: {
          dark: '#0B0F19',
          card: '#151A2C',
          accent: '#00F0FF',
          accentHover: '#00C8DF',
          warning: '#FFAE00',
          danger: '#FF3366',
          success: '#00FF9D',
        }
      },
    },
  },
  plugins: [],
};
export default config;
