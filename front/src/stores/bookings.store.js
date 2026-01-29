import { defineStore } from 'pinia'
// import bookingsService from '@/api/bookings.service'

// --- MOCK DATA ---
// Les réservations de l'utilisateur seront stockées ici en mémoire.
const mockUserBookings = [];
// --- FIN MOCK DATA ---

export const useBookingsStore = defineStore('bookings', {
    state: () => ({
        bookings: [], // Pourrait être utilisé par un admin
        userBookings: mockUserBookings,
        selectedBooking: null,
        loading: false,
        error: null
    }),

    getters: {
        getAllBookings: (state) => state.bookings,
        getUserBookings: (state) => state.userBookings,
    },

    actions: {
        // Simule la récupération des réservations de l'utilisateur connecté
        async fetchUserBookings() {
            this.loading = true
            this.error = null
            try {
                await new Promise(resolve => setTimeout(resolve, 300))
                // Les données sont déjà dans le state, donc on ne fait rien de plus.
                // Dans un vrai cas, on affecterait la réponse de l'API ici.
                this.userBookings = mockUserBookings;
            } catch (error) {
                this.error = 'Erreur simulée lors du chargement des réservations.'
                console.error(this.error, error)
            } finally {
                this.loading = false
            }
        },

        // Simule la création d'une nouvelle réservation
        async createBooking(bookingData) {
            this.loading = true
            this.error = null
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                const newBooking = {
                    id: Date.now(), // ID unique simple pour le mock
                    ...bookingData,
                    bookingDate: new Date().toISOString()
                }
                mockUserBookings.unshift(newBooking) // Ajoute au début de la liste
                this.userBookings = mockUserBookings
                return newBooking
            } catch (error) {
                this.error = 'Erreur simulée lors de la création de la réservation.'
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // Simule l'annulation d'une réservation
        async cancelBooking(id) {
            this.loading = true
            this.error = null
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                const index = mockUserBookings.findIndex(b => b.id === id)
                if (index > -1) {
                    mockUserBookings.splice(index, 1)
                    this.userBookings = mockUserBookings;
                }
            } catch (error) {
                this.error = 'Erreur simulée lors de l\'annulation.'
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },
    }
})