import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Ensure all app files are included
    ],
    theme: {
        container: {
            center: true,
            padding: "1rem",
            screens: {
                "2xl": "1280px",
            },
        },
        extend: {
            colors: {
                primary: "#2563EB",
            },
            keyframes: {
                scroll: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                wiggle: {
                    "0%, 100%": { transform: "rotate(-3deg)" },
                    "50%": { transform: "rotate(3deg)" },
                },
                "pulse-ring": {
                    "0%": { transform: "scale(0.8)", opacity: "0.7" },
                    "100%": { transform: "scale(2.5)", opacity: "0" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                "bounce-subtle": {
                    "0%, 100%": { transform: "translateY(0)", animationTimingFunction: "cubic-bezier(0.8,0,1,1)" },
                    "50%": { transform: "translateY(-10%)", animationTimingFunction: "cubic-bezier(0,0,0.2,1)" },
                }
            },
            animation: {
                scroll: "scroll 25s linear infinite",
                wiggle: "wiggle 2s ease-in-out infinite",
                "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                float: "float 6s ease-in-out infinite",
                "spin-slow": "spin 8s linear infinite",
                "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
export default config;
