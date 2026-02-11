import { defineStore } from 'pinia'
import bookingsService from '@/api/bookings.service'

export const useBookingsStore = defineStore('bookings', {
    state: () => ({
        bookings: [],
        userBookings: [],
        selectedBooking: null,
        loading: false,
        error: null
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
                const response = await bookingsService.getBookings()
                this.bookings = response.data || []
                this.userBookings = this.bookings
            } catch (error) {
                this.error = 'Erreur lors du chargement des réservations.'
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
                const newBooking = response.data
                this.bookings.unshift(newBooking)
                this.userBookings = this.bookings
                return newBooking
            } catch (error) {
                this.error = error.response?.data?.message || 'Erreur lors de la création de la réservation.'
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
                this.bookings = this.bookings.filter(b => b.id !== id)
                this.userBookings = this.bookings
            } catch (error) {
                this.error = 'Erreur lors de l\'annulation.'
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },
    }
})