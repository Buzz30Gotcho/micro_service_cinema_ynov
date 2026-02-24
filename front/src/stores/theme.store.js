import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDark: true
    }),

    getters: {
        theme: (state) => state.isDark ? 'dark' : 'light'
    },

    actions: {
        initializeTheme() {
            const saved = localStorage.getItem('theme')
            if (saved) {
                this.isDark = saved === 'dark'
            } else {
                this.isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            }
            this.applyTheme()
        },

        toggleTheme() {
            this.isDark = !this.isDark
            this.applyTheme()
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
        },

        applyTheme() {
            const html = document.documentElement
            if (this.isDark) {
                html.classList.remove('light')
                html.classList.add('dark')
            } else {
                html.classList.remove('dark')
                html.classList.add('light')
            }
        }
    }
})
