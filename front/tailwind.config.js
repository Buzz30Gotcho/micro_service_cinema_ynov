/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                cinema: {
                    50: '#f0f7ff',
                    100: '#e0efff',
                    200: '#bae6ff',
                    300: '#7dd3ff',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c3d66',
                    950: '#051e3e',
                    accent: '#06b6d4',
                    accentLight: '#22d3ee',
                    accentHover: '#0891b2',
                    dark: '#0f172a',
                    darkAlt: '#1e293b'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif']
            }
        }
    },
    plugins: []
}
