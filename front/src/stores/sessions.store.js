import { defineStore } from 'pinia'
import sessionsService from '@/api/sessions.service'
import { useMoviesStore } from '@/stores/movies.store'; // Import useMoviesStore

const normalizeSession = (session, movies) => {
  const normalized = {
    id: session.id,
    movieId: session.movieId ?? null, // This will be enriched
    nameMovie: session.nameMovie ?? '',
    date: session.date ?? session.dateSeance ?? '',
    time: session.time ?? session.hourStart ?? '',
    room: session.room ?? session.salleId ?? '',
    capacity: session.capacity ?? session.numberPlace ?? 0,
    price: session.price ?? null,
    booked: session.booked ?? (session.reservations?.length ?? 0)
  };

  // If movieId is not already present, try to find it from movies
  if (!normalized.movieId && normalized.nameMovie && movies) {
    const movie = movies.find(m => m.title === normalized.nameMovie);
    if (movie) {
      normalized.movieId = movie.id;
    }
  }

  return normalized;
};

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    loading: false,
    error: null,
  }),

  getters: {
    getAllSessions: (state) => state.sessions,
    sessionsByMovie: (state) => (dateFilter) => {
      const filteredSessions = state.sessions.filter(session => session.date === dateFilter);
      const moviesMap = new Map();
      filteredSessions.forEach(session => {
        if (!moviesMap.has(session.movieId)) {
          moviesMap.set(session.movieId, {
            id: session.movieId,
            sessions: []
          });
        }
        moviesMap.get(session.movieId).sessions.push(session);
      });
      return Array.from(moviesMap.values());
    },
    getSessionById: (state) => (id) => state.sessions.find(session => session.id === id),
  },

  actions: {
    async fetchAllSessions() {
      this.loading = true
      this.error = null
      try {
        const response = await sessionsService.getAllSessions()
        const rawSessions = response.data;

        // Fetch movies to enrich session data
        const moviesStore = useMoviesStore();
        if (moviesStore.movies.length === 0) {
            await moviesStore.fetchMovies();
        }
        const movies = moviesStore.movies;

        console.log('Raw sessions from API:', rawSessions);
        this.sessions = rawSessions.map(session => normalizeSession(session, movies));
      } catch (e) {
        this.error = 'Erreur lors du chargement des séances.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    async createSession(sessionData) {
      this.loading = true
      this.error = null
      try {
        const response = await sessionsService.createSession(sessionData)
        // After creating, we need to re-fetch all sessions to ensure
        // movieId is correctly associated from movies store for the new session.
        // A simpler way is to just call fetchAllSessions again.
        await this.fetchAllSessions();
        return response.data
      } catch (e) {
        this.error = 'Erreur lors de la création de la séance.'
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
        const response = await sessionsService.updateSession(id, sessionData)
        // Re-fetch all sessions to ensure correct movieId association after update
        await this.fetchAllSessions();
        return response.data
      } catch (e) {
        this.error = 'Erreur lors de la mise à jour de la séance.'
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
        await sessionsService.deleteSession(id)
        this.sessions = this.sessions.filter(s => s.id !== id)
      } catch (e) {
        this.error = 'Erreur lors de la suppression de la séance.'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
