/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7",
        ink: "#16161A",
        muted: "#5E5E66",
        faint: "#8D8D94",
        line: "#E6E4DE",
        accent: {
          DEFAULT: "#E8590C",
          soft: "#FFE3D3",
        },
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        page: "68rem",
        prose: "40rem",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        blink: "blink 1.1s step-end infinite",
      },
      boxShadow: {
        hard: "6px 6px 0 0 #16161A",
        photo: "0 24px 50px -20px rgba(22, 22, 26, 0.45)",
      },
    },
  },
  plugins: [],
};
