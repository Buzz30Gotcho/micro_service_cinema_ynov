/** @type {import('tailwindcss').Config} */

export default {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            colors: {
                // Base Dark Palette
                'dark-bg': '#101010', // Deep charcoal background
                'dark-card': '#1a1a1a', // Slightly lighter for cards/elements
                'dark-border': '#333333', // Subtle borders

                // Text Colors
                'light-text': '#E0E0E0', // Primary light text
                'muted-text': '#A0A0A0', // Secondary/muted text
                'dark-text': '#505050', // Darker text on light backgrounds (if any)

                // Accent & Interactive Colors (Inspired by a deep, rich blue/purple)
                'primary-accent': '#007bff', // A strong, vibrant blue for main actions
                'primary-hover': '#0056b3',  // Darker blue for hover states
                'secondary-accent': '#6c757d', // Muted gray for secondary actions
                'secondary-hover': '#5a6268', // Darker gray for secondary hover

                // Semantic Colors
                'success': '#28a745', // Green for success
                'info': '#17a2b8',    // Cyan for info
                'warning': '#ffc107',  // Yellow for warning
                'danger': '#dc3545',   // Red for errors

                // Legacy cinema colors (if still needed, otherwise remove)
                cinema: {
                    dark: '#0f172a',
                    darkAlt: '#1e293b',
                    highlightEdit: '#FFFF00',
                    highlightDelete: '#FF00FF',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'], // Body text
                heading: ['Poppins', 'sans-serif'], // For titles and prominent text
            }
        }
    },
    plugins: [],
}