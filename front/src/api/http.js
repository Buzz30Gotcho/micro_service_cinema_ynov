import axios from 'axios'
import { useAuthStore } from '@/stores/auth.store'

const API_BASE_URL = 'http://localhost:3030' // URL de base de l'API gateway

const http = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

// --- Intercepteur de REQUÊTE ---
// Le header Authorization n'est plus nécessaire, le navigateur gère les cookies httpOnly
/*
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
*/

// --- Intercepteur de RÉPONSE ---
// Gère le renouvellement du token et les erreurs 401
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

http.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const status = error.response?.status
        const url = originalRequest?.url || ''
        const authStore = useAuthStore() // Get the store instance here

        // ✅ CAS 1 : ERREUR LOGIN / REGISTER → on laisse passer
        if (
            status === 401 &&
            (url.includes('auth/login') || url.includes('auth/register'))
        ) {
            return Promise.reject(error)
        }

        // ✅ CAS 2 : TOKEN EXPIRÉ SUR UNE ROUTE PROTÉGÉE
        // et n'est pas déjà une requête de rafraîchissement
        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject })
                })
                    .then(token => {
                        return http(originalRequest)
                    })
                    .catch(err => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            return new Promise(async (resolve, reject) => {
                try {
                    await authStore.refreshToken() // Assuming this updates the tokens internally
                    isRefreshing = false
                    processQueue(null)
                    resolve(http(originalRequest))
                } catch (refreshError) {
                    processQueue(refreshError)
                    await authStore.logout() // Call logout only if refresh fails
                    reject(refreshError)
                } finally {
                    isRefreshing = false
                }
            })
        }
        return Promise.reject(error)
    }
)


export default http
