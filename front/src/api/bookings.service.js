import http from './http'

// Microservice Bookings: Gestion des réservations
export const bookingsService = {
    // Récupérer toutes les réservations (Admin)
    getBookings: () => http.get('/bookings'),

    // Récupérer les réservations de l'utilisateur connecté
    getUserBookings: () => http.get('/reservation/my'),

    // Récupérer une réservation spécifique
    getBookingById: (id) => http.get(`/reservation/${id}`),

    // Créer une nouvelle réservation
    createBooking: (bookingData) => http.post('/reservation', bookingData),

    // Mettre à jour une réservation
    updateBooking: (id, bookingData) => http.put(`/reservation/${id}`, bookingData),

    // Annuler une réservation
    cancelBooking: (id) => http.delete(`/reservation/${id}`),

    // Vérifier la disponibilité des places
    checkAvailability: (sessionId, seats) => http.post(`/bookings/check-availability`, { sessionId, seats }),

    // Récupérer les places occupées pour une séance
    getOccupiedSeats: (sessionId) => http.get(`/sessions/${sessionId}/occupied-seats`)
}

export default bookingsService
