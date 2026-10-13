export default {
  prefix: "tw:",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        luxury: ["Cormorant Garamond", "serif"],
        headings:["Libre Caslon Text","serif"],
        buttons:["Manrope","serif"]
      },
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        background: "#FFF5F8",
        primary: "#E91E63",
        textMain: "#37252C",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        sparkle: "sparkle 8s infinite",
      },

      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },

        sparkle: {
          "0%,100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
};
