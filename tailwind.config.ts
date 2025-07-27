import type {Config} from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    500: '#00B981',
                    600: '#059669'
                }
            },
            typography: {
                DEFAULT: {
                    css: {
                        'thead th': {
                            fontWeight: '600',
                        },
                        'tbody td, tbody th': {
                            padding: '0.5rem 0.75rem',
                        },
                        'table': {
                            borderCollapse: 'collapse',
                        },
                    },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
};
export default config;
