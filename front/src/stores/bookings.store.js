import { defineStore } from 'pinia'
import bookingsService from '@/api/bookings.service'

export const useBookingsStore = defineStore('bookings', {
    state: () => ({
        bookings: [], // Pourrait être utilisé par un admin
        userBookings: [],
        selectedBooking: null,
        loading: false,
        error: null,
        occupiedSeats: [], // Nouvelle propriété pour stocker les places occupées

    }),

    getters: {
        getAllBookings: (state) => state.bookings,
        getUserBookings: (state) => state.userBookings,
    },

    actions: {
        // Récupère les réservations de l'utilisateur connecté via le service backend
        async fetchUserBookings() {
            this.loading = true
            this.error = null
            try {
                const response = await bookingsService.getUserBookings()
                console.log('Réservations reçues du backend:', response.data) // DEBUG
                this.userBookings = response.data // L'API renvoie un tableau de réservations
            } catch (error) {
                this.error = 'Erreur lors du chargement des réservations de l\'utilisateur.'
                this.userBookings = [] // En cas d'erreur (ex: 404), vider la liste
                console.error(this.error, error)
            } finally {
                this.loading = false
            }
        },

        // Crée une nouvelle réservation via le service backend
        async createBooking(bookingData) {
            this.loading = true
            this.error = null
            try {
                console.log('Création de réservation avec:', bookingData) // DEBUG
                const response = await bookingsService.createBooking(bookingData)
                console.log('Réservation créée:', response.data) // DEBUG
                // Après la création, on rafraîchit les réservations de l'utilisateur
                await this.fetchUserBookings();
                return response.data
            } catch (error) {
                this.error = 'Erreur lors de la création de la réservation.'
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // Annule une réservation
        async cancelBooking(id) {
            this.loading = true
            this.error = null
            try {
                await bookingsService.cancelBooking(id)
                // Après l'annulation, on rafraîchit la liste des réservations
                await this.fetchUserBookings()
            } catch (error) {
                this.error = 'Erreur lors de l\'annulation de la réservation.'
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // Nouvelle action pour récupérer les places occupées pour une séance
        async fetchOccupiedSeats(sessionId) {
            this.loading = true
            this.error = null
            try {
                const response = await bookingsService.getOccupiedSeats(sessionId)
                this.occupiedSeats = response.data // Supposons que l'API renvoie un tableau de strings
            } catch (error) {
                // Ne pas afficher d'erreur si c'est une erreur 404 ou si l'endpoint n'existe pas
                // Garder les places occupées vides par défaut
                console.warn('Erreur lors du chargement des places occupées (non bloquant):', error)
                this.occupiedSeats = []
            } finally {
                this.loading = false
            }
        },
    }
})