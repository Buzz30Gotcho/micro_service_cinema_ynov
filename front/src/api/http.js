// src/api/http.js
// centralise la communication avec l'API gateaway
import axios from 'axios'

const http = axios.create({
    baseURL: 'http://localhost:3030', // URL de base de l'API gateaway
    withCredentials: true, // Inclure les cookies dans les requêtes
})

// Interceptor pour gérer les erreurs de réponse
http.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Gérer la déconnexion de l'utilisateur
            console.error("Non autorisé. Redirection vers la page de connexion.");
            // Vous pouvez supprimer les informations utilisateur du localStorage si nécessaire
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default http
