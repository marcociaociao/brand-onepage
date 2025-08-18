import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: { extend: { colors: { bg: "#0a0a0a" } } },
  plugins: []
} satisfies Config;
