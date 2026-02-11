// src/api/sessions.service.js
import http from './http'

// Ce service communique avec le microservice booking (NestJS) via l'API gateway
// Le gateway proxy /sessions → booking:4003
// Le booking service expose /seance et /reservation
export const sessionsService = {
    // === ADMINISTRATION DES SÉANCES ===

    // Récupérer toutes les séances
    adminGetSessions: () => http.get('/sessions/seance'),

    // Récupérer une séance spécifique par son ID
    adminGetSessionById: (id) => http.get(`/sessions/seance/${id}`),

    // Créer une nouvelle séance
    createSession: (sessionData) => http.post('/sessions/seance', sessionData),

    // Mettre à jour une séance
    updateSession: (id, sessionData) => http.put(`/sessions/seance/${id}`, sessionData),

    // Supprimer une séance
    deleteSession: (id) => http.delete(`/sessions/seance/${id}`),

    // === RÉSERVATIONS ===
    getReservations: () => http.get('/sessions/reservation'),
    getReservationById: (id) => http.get(`/sessions/reservation/${id}`),
    createReservation: (data) => http.post('/sessions/reservation', data),
    deleteReservation: (id) => http.delete(`/sessions/reservation/${id}`),

    // Health check
    health: () => http.get('/sessions/hello'),
}

export default sessionsService
