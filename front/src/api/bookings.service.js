import http from './http'

// Microservice Bookings: Gestion des reservations via le booking service (NestJS)
// Gateway route: /reservation -> booking:4003 (no rewrite, matches @Controller('reservation'))
export const bookingsService = {
    // Recuperer toutes les reservations (Admin)
    getBookings: () => http.get('/reservation'),

    // Recuperer les reservations de l'utilisateur connecte
    getUserBookings: () => http.get('/reservation/my'),

    // Recuperer une reservation specifique
    getBookingById: (id) => http.get(`/reservation/${id}`),

    // Creer une nouvelle reservation
    createBooking: (bookingData) => http.post('/reservation', bookingData),

    // Annuler une reservation
    cancelBooking: (id) => http.delete(`/reservation/${id}`),

    // Recuperer les places occupees pour une seance (via sessions controller)
    getOccupiedSeats: (sessionId) => http.get(`/sessions/${sessionId}/occupied-seats`)
}

export default bookingsService
