/** @type {import('tailwindcss').Config} */
module.exports = {
	daisyui: {
		themes: [
			{
				mytheme: {

					"primary": "#4b6bfb",

					"secondary": "#ec6090",

					"accent": "#67cba0",

					"neutral": "#181a2a",

					"base-100": "#ffffff",

					"info": "#3abff8",

					"success": "#36d399",

					"warning": "#fbbd23",

					"error": "#f87272",
				},
			},
		],
	},
	content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				forum_bg: "var(--forum_bg-color)",
				forum_theme: "var(--forum_theme-color)",
				forum_pink: "var(--forum_pink-color)",
				forum_gray: "var(--forum_gray-color)",
				forum_white: "var(--forum_white-color)",
				forum_black: "var(--forum_black-color)",
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
			screens: {
				lg_max: { max: "1023px" },
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("daisyui")],
};
