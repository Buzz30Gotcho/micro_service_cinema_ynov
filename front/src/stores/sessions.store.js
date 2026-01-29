import { defineStore } from 'pinia'
import sessionsService from '@/api/sessions.service'

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    sessions: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSessions() {
      this.loading = true
      this.error = null
      try {
        const response = await sessionsService.adminGetSessions()
        this.sessions = response.data
      } catch (e) {
        this.error = e.response?.data?.message || 'Impossible de charger les séances.'
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    async createSession(sessionData) {
      this.loading = true
      this.error = null
      try {
        await sessionsService.createSession(sessionData)
        await this.fetchSessions() // Refresh the list
      } catch (e) {
        this.error = e.response?.data?.message || 'Erreur lors de la création de la séance.'
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
        await sessionsService.updateSession(id, sessionData)
        await this.fetchSessions() // Refresh the list
      } catch (e) {
        this.error = e.response?.data?.message || 'Erreur lors de la mise à jour de la séance.'
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
        this.error = e.response?.data?.message || 'Erreur lors de la suppression de la séance.'
        console.error(e)
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
