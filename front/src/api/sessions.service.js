// src/api/sessions.service.js
import http from './http'

// Ce service communique avec le microservice des sessions/réservations
export const sessionsService = {
    // === SÉANCES PUBLIQUES ===
    getAllSessions: () => http.get('/sessions'),

    // === ADMINISTRATION DES SÉANCES ===

    // Récupérer toutes les séances
    adminGetSessions: () => http.get('/sessions'),

    // Récupérer une séance spécifique par son ID
    adminGetSessionById: (id) => http.get(`/sessions/${id}`),

    // Créer une nouvelle séance
    createSession: (sessionData) => http.post('/sessions', sessionData),

    // Mettre à jour une séance
    updateSession: (id, sessionData) => http.put(`/sessions/${id}`, sessionData),

    // Supprimer une séance
    deleteSession: (id) => http.delete(`/sessions/${id}`)
}

export default sessionsService
