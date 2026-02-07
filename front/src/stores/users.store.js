import { defineStore } from 'pinia'
import authService from '@/api/auth.service'

export const useUsersStore = defineStore('users', {
    state: () => ({
        users: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchUsers() {
            this.loading = true
            this.error = null
            try {
                // Utilise la fonction admin-specifique
                const response = await authService.adminGetUsers()
                this.users = response.data
            } catch (error) {
                this.error = error.response?.data?.message || error.message || 'Une erreur inconnue est survenue.'
                console.error('Erreur lors du chargement des utilisateurs:', error.response?.data || error.message, error)
            } finally {
                this.loading = false
            }
        },

        async createUser(userData) {
            this.loading = true
            this.error = null
            try {
                // Utilise la fonction admin-specifique
                await authService.adminRegister(userData)
                // Rafraîchit la liste après la création
                await this.fetchUsers()
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                console.error('Erreur lors de la création de l\'utilisateur:', error)
                throw error // Propage l'erreur pour la gérer dans le composant (ex: afficher un message)
            } finally {
                this.loading = false
            }
        },

        async updateUser(id, userData) {
            this.loading = true
            this.error = null
            try {
                // Utilise la fonction admin-specifique
                const response = await authService.adminUpdate(id, userData)
                const index = this.users.findIndex(u => u.id === id)
                if (index !== -1) {
                    this.users[index] = response.data
                }
                // Rafraîchit la liste après la mise à jour pour être sûr
                await this.fetchUsers()
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                console.error('Erreur lors de la mise à jour de lutilisateur: ', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteUser(id) {
            this.loading = true
            this.error = null
            try {
                // Utilise la fonction admin-specifique
                await authService.adminDelete(id)
                this.users = this.users.filter(u => u.id !== id)
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                console.error('Erreur lors de la suppression de lutilisateur:', error)
                throw error
            } finally {
                this.loading = false
            }
        }
    }
})
