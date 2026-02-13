import http from './http'

// Microservice Bookings: Gestion des réservations
export const bookingsService = {
    // Récupérer toutes les réservations (Admin)
    getBookings: () => http.get('/sessions/reservation'),

    // Récupérer les réservations de l'utilisateur connecté
    getUserBookings: () => http.get('/sessions/reservation/my'),

    // Récupérer une réservation spécifique
    getBookingById: (id) => http.get(`/sessions/reservation/${id}`),

    // Créer une nouvelle réservation
    createBooking: (bookingData) => http.post('/sessions/reservation', bookingData),

    // Mettre à jour une réservation
    updateBooking: (id, bookingData) => http.put(`/sessions/reservation/${id}`, bookingData),

    // Annuler une réservation
    cancelBooking: (id) => http.delete(`/sessions/reservation/${id}`),

    // Vérifier la disponibilité des places
    checkAvailability: (sessionId, seats) => http.post(`/sessions/bookings/check-availability`, { sessionId, seats }),

    // Récupérer les places occupées pour une séance
    getOccupiedSeats: (sessionId) => http.get(`/sessions/${sessionId}/occupied-seats`)
}

export default bookingsService
