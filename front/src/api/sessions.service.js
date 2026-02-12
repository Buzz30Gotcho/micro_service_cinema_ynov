// src/api/sessions.service.js
import http from './http'

// Ce service communique avec le microservice booking (NestJS) via l'API gateway
// Le gateway proxy /sessions -> booking:4003 (pas de reecriture, matches @Controller('sessions'))
export const sessionsService = {
    // Recuperer toutes les seances
    getAllSessions: () => http.get('/sessions'),

    // Recuperer une seance specifique par son ID
    getSessionById: (id) => http.get(`/sessions/${id}`),

    // Creer une nouvelle seance
    createSession: (sessionData) => http.post('/sessions', sessionData),

    // Mettre a jour une seance
    updateSession: (id, sessionData) => http.put(`/sessions/${id}`, sessionData),

    // Supprimer une seance
    deleteSession: (id) => http.delete(`/sessions/${id}`),

    // Health check
    health: () => http.get('/sessions/hello'),
}

export default sessionsService