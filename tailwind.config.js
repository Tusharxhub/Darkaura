import { heroui } from "@heroui/react";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		// Expose custom fontSize.small at root so plugin utilities using theme(fontSize.small) resolve to a primitive value
		fontSize: {
			small: '0.875rem',
		},
		extend: {
			animation: {
				orbit: "orbit calc(var(--duration)*1s) linear infinite",
				 gradient: 'gradient 8s linear infinite'
			},
			keyframes: {
				orbit: {
					"0%": {
						transform: "rotate(calc(var(--angle)*1deg)) translateY(calc(var(--radius)*1px)) rotate(calc(var(--angle)*-1deg))",
					},
					"100%": {
						transform: "rotate(calc(var(--angle)*1deg + 360deg)) translateY(calc(var(--radius)*1px)) rotate(calc(var(--angle)*-1deg - 360deg))",
					},
				},
				gradient: {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
			},
			screens: {
				mdplus: "1040px",
			}
		},
	},
	darkMode: "class",
	plugins: [
		heroui(),
		// Option 3: custom utility to replace invalid calc(theme(fontSize.small)+10px)
		plugin(({ addUtilities }) => {
			addUtilities({
				'.mt-label-fix': {
					marginTop: 'calc(0.875rem + 10px)', // 14px + 10px = 24px
				},
			});
		}),
	],
};