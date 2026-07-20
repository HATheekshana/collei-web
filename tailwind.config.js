/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        canopy: {
          950: "#0b120d",
          900: "#0f1a12",
          800: "#152417",
          700: "#1c3120",
          600: "#28442c",
          500: "#3a5c3e"
        },
        moss: "#7fae5a",
        sprout: "#c7e88f",
        bloom: "#e7c65a",
        parchment: "#efe6cf",
        bark: "#6e5636"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      backgroundImage: {
        "leaf-glow": "radial-gradient(circle at top, rgba(199,232,143,0.12), transparent 60%)"
      }
    }
  },
  plugins: []
};
