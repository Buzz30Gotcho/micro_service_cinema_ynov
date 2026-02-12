// src/api/auth.service.js
import http from './http'

// === COMPTES DE TEST (MODE DÉVELOPPEMENT) ===
// const TEST_ACCOUNTS = [
//     { id: 1, email: 'admin@test.com', password: 'password', name: 'Admin User', role: 'admin' },
//     { id: 2, email: 'user@test.com', password: 'password', name: 'John Doe', role: 'client' }
// ]

const USE_TEST_MODE = true // Passe à true pour tester sans API

// Microservice Auth/Users: Gestion des utilisateurs et authentification
export const authService = {
    // Connexion
    login: (email, password) => {
        return http.post('auth/login', { email, password })
    },

    // Inscription
    register: (userData) => {
        return http.post('auth/register', userData)
    },

    // Déconnexion
    logout: () => http.post('auth/logout'),

    // Récupérer le profil de l'utilisateur connecté
    getProfile: () => http.get('auth/me'),

    // Modifier le user
    updateUser: (userData) => http.patch('auth/me', userData),

    // mot de passe oublié
    forgotPassword: (email) => http.post('/auth/forgot', { email }),

    // Réinitialiser le mot de passe
    resetPassword: (payload) => http.post('/auth/reset', payload),

    // ---------------------------

    // ADMINISTRATION DES UTILISATEURS (pour le panel admin)

    // Récupérer tous les utilisateurs admin
    adminGetUsers: () => http.get('/auth/admin/users'),

    // Récupérer un utilisateur spécifique admin
    adminGetUserById: (id) => http.get(`/auth/admin/${id}`),

    // Enregistrer un nouvel utilisateur en tant qu'admin
    adminRegister: (userData) => http.post('/auth/admin/register', userData),

    // Mettre à jour un utilisateur admin
    adminUpdate: (id, userData) => http.put(`/auth/admin/update/${id}`, userData),

    // Supprimer un utilisateur admin
    adminDelete: (id) => http.delete(`/auth/admin/delete/${id}`),

    adminProfile() {
        return http.get('/auth/admin/me', { withCredentials: true })
    }


}

export default authService
