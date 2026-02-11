// src/api/bookings.service.js
import http from './http'

// Microservice Bookings: Gestion des réservations via le booking service (NestJS)
export const bookingsService = {
    // Récupérer toutes les réservations
    getBookings: () => http.get('/sessions/reservation'),

    // Récupérer une réservation spécifique
    getBookingById: (id) => http.get(`/sessions/reservation/${id}`),

    // Créer une nouvelle réservation
    createBooking: (bookingData) => http.post('/sessions/reservation', bookingData),

    // Annuler une réservation
    cancelBooking: (id) => http.delete(`/sessions/reservation/${id}`),
}

export default bookingsService
