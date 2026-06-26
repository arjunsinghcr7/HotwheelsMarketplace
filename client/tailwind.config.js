/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Theme-dependent tokens read CSS variables that flip in light mode
        // (see index.css :root / html.light). RGB-triple form keeps Tailwind's
        // /alpha opacity modifiers working.
        "surface-dim": "rgb(var(--c-surface-dim) / <alpha-value>)",
        "background": "rgb(var(--c-background) / <alpha-value>)",
        "surface": "rgb(var(--c-surface) / <alpha-value>)",
        "surface-bright": "rgb(var(--c-surface-bright) / <alpha-value>)",
        "surface-container-high": "rgb(var(--c-surface-container-high) / <alpha-value>)",
        "surface-container": "rgb(var(--c-surface-container) / <alpha-value>)",
        "surface-container-highest": "rgb(var(--c-surface-container-highest) / <alpha-value>)",
        "surface-container-lowest": "rgb(var(--c-surface-container-lowest) / <alpha-value>)",
        "surface-container-low": "rgb(var(--c-surface-container-low) / <alpha-value>)",
        "surface-variant": "rgb(var(--c-surface-variant) / <alpha-value>)",
        "on-surface": "rgb(var(--c-on-surface) / <alpha-value>)",
        "on-background": "rgb(var(--c-on-surface) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--c-on-surface-variant) / <alpha-value>)",
        "outline": "rgb(var(--c-outline) / <alpha-value>)",
        "outline-variant": "rgb(var(--c-outline-variant) / <alpha-value>)",
        "inverse-surface": "rgb(var(--c-inverse-surface) / <alpha-value>)",
        "inverse-on-surface": "rgb(var(--c-inverse-on-surface) / <alpha-value>)",

        // Accent tokens — identical in both themes
        "tertiary-fixed-dim": "#fabd00",
        "primary-container": "#ff544c",
        "on-secondary": "#003063",
        "on-tertiary-fixed": "#261a00",
        "on-error-container": "#ffdad6",
        "secondary": "#a9c7ff",
        "secondary-container": "#005db7",
        "on-primary-container": "#5c0005",
        "on-secondary-container": "#c6d9ff",
        "secondary-fixed-dim": "#a9c7ff",
        "tertiary": "#fabd00",
        "primary-fixed-dim": "#ffb4ac",
        "on-primary": "#690006",
        "on-primary-fixed-variant": "#93000d",
        "error": "#ffb4ab",
        "secondary-fixed": "#d6e3ff",
        "on-tertiary-fixed-variant": "#5b4300",
        "tertiary-fixed": "#ffdf9e",
        "primary-fixed": "#ffdad6",
        "inverse-primary": "#bb171c",
        "on-tertiary": "#3f2e00",
        "on-primary-fixed": "#410002",
        "on-tertiary-container": "#372700",
        "error-container": "#93000a",
        "primary": "#ffb4ac",
        "surface-tint": "#ffb4ac",
        "on-error": "#690005",
        "on-secondary-fixed": "#001b3d",
        "tertiary-container": "#b78a00",
        "on-secondary-fixed-variant": "#00468c"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "gutter": "20px",
        "md": "24px",
        "margin-desktop": "48px",
        "sm": "16px",
        "base": "4px",
        "xl": "64px",
        "lg": "40px",
        "xs": "8px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "body-md": ["Inter", "sans-serif"],
        "headline-lg": ["Hanken Grotesk", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "label-sm": ["Geist", "monospace"],
        "headline-md": ["Hanken Grotesk", "sans-serif"],
        "headline-lg-mobile": ["Hanken Grotesk", "sans-serif"],
        "headline-xl": ["Hanken Grotesk", "sans-serif"],
        "label-md": ["Geist", "monospace"]
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "1.2", letterSpacing: "0.02em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-xl": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "label-md": ["14px", { lineHeight: "1.2", letterSpacing: "0.05em", fontWeight: "500" }]
      }
    },
  },
  plugins: [],
}
