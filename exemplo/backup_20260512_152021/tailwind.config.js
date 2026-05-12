/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#F8FAFC",
        primary: "#2563EB",
        text: "#111827",
        spot: {
          available: "#16A34A",
          occupied: "#DC2626",
          reserved: "#F59E0B",
        },
      },
      boxShadow: {
        soft: "0 10px 25px -10px rgba(17,24,39,0.18)",
      },
    },
  },
  plugins: [],
};

