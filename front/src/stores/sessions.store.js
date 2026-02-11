import { defineStore } from 'pinia'
import sessionsService from '@/api/sessions.service'

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    loading: false,
    error: null,
  }),

  getters: {
    getAllSessions: (state) => state.sessions,

    sessionsByMovie: (state) => (dateLabel) => {
      // Filter sessions by date label, then group by movie
      const today = new Date()
      const tomorrow = new Date()
      tomorrow.setDate(today.getDate() + 1)

      const formatDate = (d) => d.toISOString().split('T')[0] // YYYY-MM-DD

      let targetDate = null
      if (dateLabel === 'Aujourd\'hui') targetDate = formatDate(today)
      else if (dateLabel === 'Demain') targetDate = formatDate(tomorrow)
      else targetDate = dateLabel // already a date string

      // Filter sessions matching the target date
      const filtered = state.sessions.filter(s => {
        if (!s.date) return false
        const sessionDate = s.date.split('T')[0] // handle ISO or plain date
        return sessionDate === targetDate
      })

      // Group by movie
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
        const response = await sessionsService.adminGetSessions()
        // Map the NestJS seance entity fields to what the front expects
        this.sessions = (response.data || []).map(s => ({
          id: s.id,
          movieId: s.nameMovie,       // nameMovie = movie title or ID used as link
          nameMovie: s.nameMovie,
          date: s.dateSeance,
          time: s.hourStart,
          hourEnd: s.hourEnd,
          room: s.salleId || 'N/A',
          capacity: s.numberPlace || 0,
          availableSeats: (s.numberPlace || 0) - (s.reservations?.length || 0),
          booked: s.reservations?.length || 0,
          price: s.price,
          reservations: s.reservations || [],
        }))
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
        // Map front-end format to booking service DTO
        const dto = {
          nameMovie: sessionData.nameMovie || sessionData.movieId,
          numberPlace: sessionData.capacity || sessionData.numberPlace,
          hourStart: sessionData.time || sessionData.hourStart,
          hourEnd: sessionData.hourEnd || null,
          dateSeance: sessionData.date || sessionData.dateSeance,
          salleId: sessionData.room || sessionData.salleId,
          price: sessionData.price || null,
        }
        const response = await sessionsService.createSession(dto)
        await this.fetchAllSessions() // refresh
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
        const dto = {
          nameMovie: sessionData.nameMovie || sessionData.movieId,
          numberPlace: sessionData.capacity || sessionData.numberPlace,
          hourStart: sessionData.time || sessionData.hourStart,
          hourEnd: sessionData.hourEnd || null,
          dateSeance: sessionData.date || sessionData.dateSeance,
          salleId: sessionData.room || sessionData.salleId,
          price: sessionData.price || null,
        }
        const response = await sessionsService.updateSession(id, dto)
        await this.fetchAllSessions() // refresh
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
