/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "#0F172A",
          600: "#2563EB",
        },
        surface: "#F8FAFC",
        card: "#FFFFFF",
        text: {
          primary: "#111827",
          secondary: "#64748B",
        },
        border: "#E5E7EB",
        success: "#22C55E",
        warning: "#FACC15",
        danger: "#EF4444",
        spot: {
          available: "#22C55E",
          occupied: "#EF4444",
          reserved: "#FACC15",
        },
      },
      boxShadow: {
        soft: "0 10px 25px -10px rgba(17,24,39,0.18)",
        card: "0 12px 30px -18px rgba(15,23,42,0.35)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.1rem",
      },
    },
  },
  plugins: [],
};
