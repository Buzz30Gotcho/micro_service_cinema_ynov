import { defineStore } from 'pinia'
import authService from '@/api/auth.service'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        users: [], // Pour la liste des utilisateurs dans le panel admin
        role: localStorage.getItem('role') || null,
        isAuthenticated: false,
        loading: false,
        error: null
    }),

    getters: {
        isAdmin: (state) => state.role === 'admin' || state.role === 'Administrateur',
        isClient: (state) => state.role === 'client' || state.role === 'Client',
        currentUser: (state) => state.user
    },

    actions: {
        async login(email, password) {
            this.loading = true
            this.error = null
            try {
                // S'authentifier et récupérer le profil complet de l'utilisateur, incluant le rôle.
                // Le backend est censé renvoyer toutes les données nécessaires dans la réponse de login.
                const response = await authService.login(email, password)

                // Mettre à jour le store avec les données reçues.
                this.user = response.data.user
                this.role = response.data.user.role
                this.isAuthenticated = true

                localStorage.setItem('role', response.data.user.role)
                localStorage.setItem('user', JSON.stringify(response.data.user))

                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async register(userData) {
            this.loading = true
            this.error = null
            try {
                const response = await authService.register(userData)
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },
        async logout() {
            this.loading = true
            try {
                await authService.logout()
            } catch (error) {
                console.error(error)
            } finally {
                this.user = null
                this.role = null
                this.isAuthenticated = false

                localStorage.removeItem('role')
                localStorage.removeItem('user')

                this.loading = false
            }
        },

        async forgotPassword(email) {
            this.loading = true
            this.error = null
            try {
                const response = await authService.forgotPassword(email)
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },
        async resetPassword(payload) {
            this.loading = true
            this.error = null
            try {
                const response = await authService.resetPassword(payload)
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },
        async fetchProfile() {
            this.loading = true
            this.error = null
            try {
                const response = await authService.getProfile()
                this.user = response.data
                this.isAuthenticated = true
                return response.data
            } catch (error) {
                this.error = error.message
                console.error(error)
            } finally {
                this.loading = false
            }
        },
        async updateUser(userData) {
            this.loading = true
            this.error = null
            try {
                const response = await authService.updateUser(userData)
                this.user = response.data
                localStorage.setItem('user', JSON.stringify(response.data))
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        // --- ACTIONS ADMIN ---
        async adminGetUsers() {
            this.loading = true
            this.error = null
            try {
                const response = await authService.adminGetUsers()
                this.users = response.data
                return response.data
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async adminRegister(userData) {
            this.loading = true
            this.error = null
            try {
                await authService.adminRegister(userData)
                await this.adminGetUsers() // Rafraîchir la liste
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async adminUpdateUser(id, userData) {
            this.loading = true
            this.error = null
            try {
                await authService.adminUpdate(id, userData)
                await this.adminGetUsers() // Rafraîchir la liste
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        async adminDeleteUser(id) {
            this.loading = true
            this.error = null
            try {
                await authService.adminDelete(id)
                await this.adminGetUsers() // Rafraîchir la liste
            } catch (error) {
                this.error = error.response?.data?.message || error.message
                throw error
            } finally {
                this.loading = false
            }
        },

        initializeAuth() {
            const userStr = localStorage.getItem('user')
            const role = localStorage.getItem('role')

            if (userStr) {
                this.user = JSON.parse(userStr)
                this.isAuthenticated = true
            }

            if (role) {
                this.role = role
            }
        }
    }
})
