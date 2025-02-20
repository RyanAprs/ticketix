/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      screens: {
        xs: "460px",
        xxl: "1920px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        jetbrainsMono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        custom: "4px 4px 0px #5A534F",
        hover: "2px 2px 0px #5A534F",
      },
      colors: {
        bg: "#FFE4E1",
        mainAccent: "#2764F3",
        secondaryAccent: "#D9C3F2",
        thirdAccent: "#C3CFF2",
        title: "#3E3D39",
        subtext: "#4E4C47",
        caption: "#7A6858",
        border: "hsl(var(--border))",
        shadow: "#5A534F",
        offWhite: "#FFFBFA",
        FFE4E1: "#FFE4E1",
        FEC2C3: "#FEC2C3",
        D9C3F2: "#D9C3F2",
        C3CFF2: "#C3CFF2",
        F0AAAB: "#F0AAAB",
        "4E4C47": "#4E4C47",
        "7A6858": "#7A6858",
        "3E3D39": "#3E3D39",
        "5A534F": "#5A534F",
        gradientStart: "#6495ED",
        gradientEnd: "#0057D9",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
