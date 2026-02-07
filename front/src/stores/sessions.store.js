import { defineStore } from 'pinia'
// import sessionsService from '@/api/sessions.service' // Commented out for mock data

// --- MOCK DATA FOR SESSIONS ---
const mockSessions = [
  // Session pour le film ID 1 (Lumières de la Ville)
  { id: 101, movieId: 1, date: 'Aujourd\'hui', time: '14:30', room: '3', availableSeats: 45, capacity: 100, booked: 55 },
  { id: 102, movieId: 1, date: 'Aujourd\'hui', time: '18:00', room: '1', availableSeats: 12, capacity: 80, booked: 68 },
  { id: 103, movieId: 1, date: 'Aujourd\'hui', time: '21:15', room: '3', availableSeats: 28, capacity: 100, booked: 72 },
  { id: 104, movieId: 1, date: 'Demain', time: '14:00', room: '2', availableSeats: 67, capacity: 120, booked: 53 },
  { id: 105, movieId: 1, date: 'Demain', time: '20:30', room: '1', availableSeats: 34, capacity: 80, booked: 46 },

  // Session pour le film ID 2 (Océan Bleu)
  { id: 201, movieId: 2, date: 'Aujourd\'hui', time: '16:00', room: '2', availableSeats: 50, capacity: 120, booked: 70 },
  { id: 202, movieId: 2, date: 'Demain', time: '10:00', room: '3', availableSeats: 80, capacity: 100, booked: 20 },

  // Session pour le film ID 3 (Nocturne)
  { id: 301, movieId: 3, date: 'Aujourd\'hui', time: '19:30', room: '4', availableSeats: 20, capacity: 70, booked: 50 },
  { id: 302, movieId: 3, date: 'Demain', time: '22:00', room: '2', availableSeats: 10, capacity: 120, booked: 110 },
];
// --- FIN MOCK DATA ---

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    loading: false,
    error: null,
  }),

  getters: {
    // Getter pour obtenir toutes les sessions (filtrables par date si besoin dans les composants)
    getAllSessions: (state) => state.sessions,

    // Getter pour obtenir les sessions regroupées par film pour une date donnée
    sessionsByMovie: (state) => (dateFilter) => {
      const filteredSessions = state.sessions.filter(session => session.date === dateFilter);
      const moviesMap = new Map();

      // On a besoin des infos des films pour les sessions
      // Pour l'instant, on se base sur les mockMovies du moviesStore si on les avait
      // Mais comme il n'est pas directement accessible ici, on va faire simple.
      // Une meilleure implémentation nécessiterait de passer un `getMovie` fonction
      // ou d'importer moviesStore.

      // Ici, nous allons simplement créer une structure simple avec movieId comme clé
      // et ajouter les sessions. Les détails du film seront fusionnés dans le composant
      // SeancesPage.vue

      filteredSessions.forEach(session => {
        if (!moviesMap.has(session.movieId)) {
          // Temporairement, on ne met que l'ID du film. Les détails seront fusionnés dans le composant.
          moviesMap.set(session.movieId, {
            id: session.movieId,
            sessions: []
          });
        }
        moviesMap.get(session.movieId).sessions.push(session);
      });
      return Array.from(moviesMap.values());
    },

    // Un getter pour obtenir une session par ID, utile pour la réservation
    getSessionById: (state) => (id) => state.sessions.find(session => session.id === id),
  },

  actions: {
    async fetchAllSessions() {
      this.loading = true
      this.error = null
      try {
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate network latency
        this.sessions = mockSessions.map(s => ({...s})) // Return a copy to prevent direct modification
      } catch (e) {
        this.error = 'Erreur simulée lors du chargement des séances.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async createSession(sessionData) {
      this.loading = true
      this.error = null
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        const newSession = {
          id: Math.max(0, ...mockSessions.map(s => s.id)) + 1,
          ...sessionData
        }
        mockSessions.push(newSession)
        this.sessions.push(newSession)
        return newSession
      } catch (e) {
        this.error = 'Erreur simulée lors de la création de la séance.'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateSession(id, sessionData) {
      this.loading = true
      this.error = null
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockSessions.findIndex(s => s.id === id)
        if (index !== -1) {
          mockSessions[index] = { ...mockSessions[index], ...sessionData }
          const stateIndex = this.sessions.findIndex(s => s.id === id)
          if (stateIndex !== -1) {
            this.sessions[stateIndex] = mockSessions[index]
          }
          return mockSessions[index]
        } else {
          throw new Error('Séance non trouvée pour la mise à jour.')
        }
      } catch (e) {
        this.error = 'Erreur simulée lors de la mise à jour de la séance.'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteSession(id) {
      this.loading = true
      this.error = null
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockSessions.findIndex(s => s.id === id)
        if (index !== -1) {
          mockSessions.splice(index, 1)
          this.sessions = this.sessions.filter(s => s.id !== id)
        } else {
          throw new Error('Séance non trouvée pour la suppression.')
        }
      } catch (e) {
        this.error = 'Erreur simulée lors de la suppression de la séance.'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
