// src/stores/dashboard.store.js
import { defineStore } from 'pinia'
import dashboardService from '@/api/dashboard.service'

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        stats: null,
        serviceStatus: [],
        upcomingSessions: [],
        popularMovies: [],
        loading: false,
        error: null
    }),

    getters: {
        getStats: (state) => state.stats,
        getServiceStatus: (state) => state.serviceStatus,
        getUpcomingSessions: (state) => state.upcomingSessions,
        getPopularMovies: (state) => state.popularMovies
    },

    actions: {
        async fetchStats() {
            this.loading = true
            this.error = null
            try {
                const response = await dashboardService.getStats()
                this.stats = response.data
                return response.data
            } catch (error) {
                this.error = error.message
                console.error('Erreur lors de la récupération des stats:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchServiceStatus() {
            this.loading = true
            this.error = null
            try {
                const response = await dashboardService.getServiceStatus()
                this.serviceStatus = response.data
                return response.data
            } catch (error) {
                this.error = error.message
                console.error('Erreur lors de la récupération des services:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchUpcomingSessions() {
            this.loading = true
            this.error = null
            try {
                const response = await dashboardService.getUpcomingSessions()
                this.upcomingSessions = response.data
                return response.data
            } catch (error) {
                this.error = error.message
                console.error('Erreur lors de la récupération des séances:', error)
            } finally {
                this.loading = false
            }
        },

        async fetchPopularMovies() {
            this.loading = true
            this.error = null
            try {
                const response = await dashboardService.getPopularMovies()
                this.popularMovies = response.data
                return response.data
            } catch (error) {
                this.error = error.message
                console.error('Erreur lors de la récupération des films:', error)
            } finally {
                this.loading = false
            }
        }
    }
})
