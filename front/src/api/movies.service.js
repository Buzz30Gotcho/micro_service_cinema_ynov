// src/api/movies.service.js
import http from './http'

// Microservice Movies: Gestion du catalogue de films via le microservice Catalog (PHP)
export const moviesService = {
    // Récupérer tous les films
    getMovies: () => http.get('/catalogue/movies'),

    // Récupérer un film spécifique
    getMovieById: (id) => http.get(`/catalogue/movies/${id}`),

    // Créer un nouveau film (Admin)
    createMovie: (movieData) => http.post('/catalogue/movies', movieData),

    // Mettre à jour un film (Admin)
    updateMovie: (id, movieData) => http.put(`/catalogue/movies/${id}`, movieData),

    // Supprimer un film (Admin)
    deleteMovie: (id) => http.delete(`/catalogue/movies/${id}`),

    // Obtenir les statistiques des films
    getMovieStats: () => http.get('/catalogue/movies/stats/all'),

    // Health check
    health: () => http.get('/catalogue/health'),
}

export default moviesService