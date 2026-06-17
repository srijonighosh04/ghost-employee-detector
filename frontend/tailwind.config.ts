import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#06091A",
        panel: "#0D1326",
        "panel-raised": "#121A33",
        mist: "rgba(255,255,255,0.06)",
        line: "rgba(255,255,255,0.10)",
        signal: {
          DEFAULT: "#F0A93B",
          dim: "#8A6324",
          glow: "#FFC876",
        },
        pulse: {
          DEFAULT: "#46C2D8",
          dim: "#1E5A66",
          glow: "#8FE4F2",
        },
        alert: {
          DEFAULT: "#E15C5C",
          dim: "#7A2F2F",
          glow: "#FF8A8A",
        },
        bone: "#EDEFF5",
        slate: {
          DEFAULT: "#8891A8",
          dim: "#5A6178",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "radial-amber": "radial-gradient(circle at 50% 50%, rgba(240,169,59,0.25), transparent 70%)",
        "radial-cyan": "radial-gradient(circle at 50% 50%, rgba(70,194,216,0.22), transparent 70%)",
        "grain": "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC45IiBudW1PY3RhdmVzPSIyIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glow-amber": "0 0 0 1px rgba(240,169,59,0.4), 0 0 24px rgba(240,169,59,0.25)",
        "glow-cyan": "0 0 0 1px rgba(70,194,216,0.4), 0 0 24px rgba(70,194,216,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "dash": {
          to: { strokeDashoffset: "-24" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        dash: "dash 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
