// src/stores/dashboard.store.js
import { defineStore } from 'pinia'
import dashboardService from '@/api/dashboard.service'

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        services: {
            catalog: { status: 'unknown', health: null, loading: false },
            auth:    { status: 'unknown', health: null, loading: false },
            booking: { status: 'unknown', health: null, loading: false },
        },
        loading: false,
        error: null
    }),

    actions: {
        // Check Docker container state (running/exited/…)
        async fetchServiceStatus(serviceKey) {
            this.services[serviceKey].loading = true
            try {
                const res = await dashboardService.getServiceStatus(serviceKey)
                this.services[serviceKey].status = res.data.state || 'unknown'
            } catch (e) {
                this.services[serviceKey].status = 'error'
                console.error(`Status check failed for ${serviceKey}:`, e)
            } finally {
                this.services[serviceKey].loading = false
            }
        },

        // Health-check via the microservice's own /health endpoint
        async fetchServiceHealth(serviceKey) {
            this.services[serviceKey].loading = true
            try {
                let res
                if (serviceKey === 'catalog') res = await dashboardService.getCatalogHealth()
                else if (serviceKey === 'auth') res = await dashboardService.getAuthHealth()
                else if (serviceKey === 'booking') res = await dashboardService.getBookingHealth()

                this.services[serviceKey].health = 'healthy'
            } catch (e) {
                this.services[serviceKey].health = 'unhealthy'
            } finally {
                this.services[serviceKey].loading = false
            }
        },

        async stopService(serviceKey) {
            this.services[serviceKey].loading = true
            try {
                await dashboardService.stopService(serviceKey)
                this.services[serviceKey].status = 'exited'
                this.services[serviceKey].health = 'unhealthy'
            } catch (e) {
                console.error(`Stop failed for ${serviceKey}:`, e)
                throw e
            } finally {
                this.services[serviceKey].loading = false
            }
        },

        async startService(serviceKey) {
            this.services[serviceKey].loading = true
            try {
                await dashboardService.startService(serviceKey)
                this.services[serviceKey].status = 'running'
                // Wait a bit for the service to boot then health-check
                setTimeout(() => this.fetchServiceHealth(serviceKey), 3000)
            } catch (e) {
                console.error(`Start failed for ${serviceKey}:`, e)
                throw e
            } finally {
                this.services[serviceKey].loading = false
            }
        },

        // Refresh all three at once
        async fetchAll() {
            await Promise.allSettled([
                this.fetchServiceStatus('catalog'),
                this.fetchServiceStatus('auth'),
                this.fetchServiceStatus('booking'),
                this.fetchServiceHealth('catalog'),
                this.fetchServiceHealth('auth'),
                this.fetchServiceHealth('booking'),
            ])
        }
    }
})
