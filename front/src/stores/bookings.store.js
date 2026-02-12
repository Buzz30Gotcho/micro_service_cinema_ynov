import { defineStore } from 'pinia'
import bookingsService from '@/api/bookings.service'

export const useBookingsStore = defineStore('bookings', {
    state: () => ({
        bookings: [],
        userBookings: [],
        selectedBooking: null,
        loading: false,
        error: null,
        occupiedSeats: [],
    }),

    getters: {
        getAllBookings: (state) => state.bookings,
        getUserBookings: (state) => state.userBookings,
    },

    actions: {
        async fetchUserBookings() {
            this.loading = true
            this.error = null
            try {
                const response = await bookingsService.getUserBookings()
                this.userBookings = response.data || []
            } catch (error) {
                this.error = 'Erreur lors du chargement des reservations.'
                this.userBookings = []
                console.error(this.error, error)
            } finally {
                this.loading = false
            }
        },

        async createBooking(bookingData) {
            this.loading = true
            this.error = null
            try {
                const response = await bookingsService.createBooking(bookingData)
                await this.fetchUserBookings()
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || 'Erreur lors de la creation de la reservation.'
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async cancelBooking(id) {
            this.loading = true
            this.error = null
            try {
                await bookingsService.cancelBooking(id)
                await this.fetchUserBookings()
            } catch (error) {
                this.error = 'Erreur lors de l annulation de la reservation.'
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async fetchOccupiedSeats(sessionId) {
            this.loading = true
            this.error = null
            try {
                const response = await bookingsService.getOccupiedSeats(sessionId)
                this.occupiedSeats = response.data || []
            } catch (error) {
                this.error = 'Erreur lors du chargement des places occupees.'
                console.error(this.error, error)
            } finally {
                this.loading = false
            }
        },
    }
})