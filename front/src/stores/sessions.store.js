import { defineStore } from 'pinia'
import sessionsService from '@/api/sessions.service'
import { useMoviesStore } from '@/stores/movies.store'

const normalizeSession = (session, movies) => {
  const normalized = {
    id: session.id,
    movieId: session.movieId ?? null,
    nameMovie: session.nameMovie ?? '',
    date: session.date ?? session.dateSeance ?? '',
    time: session.time ?? session.hourStart ?? '',
    room: session.room ?? session.salleId ?? '',
    capacity: session.capacity ?? session.numberPlace ?? 0,
    price: session.price ?? null,
    booked: session.booked ?? (session.reservations?.length ?? 0),
    hourEnd: session.hourEnd ?? null,
    reservations: session.reservations ?? [],
  }

  // If movieId is not already set, try to find it from the movies catalog
  if (!normalized.movieId && normalized.nameMovie && movies) {
    const movie = movies.find(m => m.title === normalized.nameMovie)
    if (movie) {
      normalized.movieId = String(movie.id)
    }
  }

  return normalized
}

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    loading: false,
    error: null,
  }),

  getters: {
    getAllSessions: (state) => state.sessions,

    sessionsByMovie: (state) => (dateLabel) => {
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)

      const formatDate = (d) => d.toISOString().split('T')[0]

      let targetDate = null
      if (dateLabel === "Aujourd'hui") targetDate = formatDate(today)
      else if (dateLabel === 'Demain') targetDate = formatDate(tomorrow)
      else targetDate = dateLabel

      const filtered = state.sessions.filter(s => {
        if (!s.date) return false
        const sessionDate = s.date.split('T')[0]
        return sessionDate === targetDate
      })

      const groups = {}
      for (const session of filtered) {
        const key = session.movieId || session.nameMovie || 'unknown'
        if (!groups[key]) {
          groups[key] = { id: key, sessions: [] }
        }
        groups[key].sessions.push(session)
      }
      return Object.values(groups)
    },

    getSessionById: (state) => (id) => state.sessions.find(session => session.id === id),
  },

  actions: {
    async fetchAllSessions() {
      this.loading = true
      this.error = null
      try {
        const response = await sessionsService.getAllSessions()
        const rawSessions = response.data || []

        // Fetch movies to enrich session data with movieId
        const moviesStore = useMoviesStore()
        if (moviesStore.movies.length === 0) {
          await moviesStore.fetchMovies()
        }
        const movies = moviesStore.movies

        this.sessions = rawSessions.map(session => normalizeSession(session, movies))
      } catch (e) {
        this.error = 'Erreur lors du chargement des seances.'
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
        await this.fetchAllSessions()
        return response.data
      } catch (e) {
        this.error = 'Erreur lors de la creation de la seance.'
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
        await this.fetchAllSessions()
        return response.data
      } catch (e) {
        this.error = 'Erreur lors de la mise a jour de la seance.'
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
        this.error = 'Erreur lors de la suppression de la seance.'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})