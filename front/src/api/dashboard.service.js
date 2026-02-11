// src/api/dashboard.service.js
import http from './http'

// Service Admin/DevOps: Gestion des microservices via le admin service (Fastify + Dockerode)
export const dashboardService = {
    // --- Health checks directs (via gateway) ---
    getCatalogHealth: () => http.get('/catalogue/health'),
    getBookingHealth: () => http.get('/sessions/health'),
    getAuthHealth: () => http.get('/auth/health'),

    // --- Docker container management (via admin service) ---
    getServiceStatus: (service) => http.get(`/admin/${service}/status`),
    stopService: (service) => http.post(`/admin/${service}/stop`),
    startService: (service) => http.post(`/admin/${service}/start`),
}

export default dashboardService
