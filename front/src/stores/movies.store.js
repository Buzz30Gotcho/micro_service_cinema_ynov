import { defineStore } from 'pinia'
import moviesService from '@/api/movies.service'

export const useMoviesStore = defineStore('movies', {
    state: () => ({
        movies: [],
        selectedMovie: null,
        loading: false,
        error: null
    }),

    getters: {
        getAllMovies: (state) => state.movies,
        getMovieById: (state) => (id) => state.movies.find(m => m.id == id)
    },

    actions: {
        async fetchMovies() {
            this.loading = true
            this.error = null
            try {
                const response = await moviesService.getMovies()
                this.movies = response.data
            } catch (error) {
                this.error = 'Erreur lors du chargement des films.'
                console.error(this.error, error)
            } finally {
                this.loading = false
            }
        },

        async fetchMovieById(id) {
            this.loading = true
            this.error = null
            try {
                const response = await moviesService.getMovieById(id)
                this.selectedMovie = response.data
                return response.data
            } catch (error) {
                this.error = error.response?.data?.error || 'Film non trouvé'
                console.error('Erreur lors du chargement du film:', error)
            } finally {
                this.loading = false
            }
        },

        async createMovie(movieData) {
            this.loading = true
            this.error = null
            try {
                const response = await moviesService.createMovie(movieData)
                const newMovie = response.data
                this.movies.unshift(newMovie)
                return newMovie
            } catch (error) {
                this.error = error.response?.data?.error || 'Erreur lors de la création du film.'
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updateMovie(id, movieData) {
            this.loading = true
            this.error = null
            try {
                const response = await moviesService.updateMovie(id, movieData)
                const updated = response.data
                const index = this.movies.findIndex(m => m.id == id)
                if (index > -1) {
                    this.movies[index] = updated
                }
                return updated
            } catch (error) {
                this.error = error.response?.data?.error || 'Erreur lors de la mise à jour du film.'
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async deleteMovie(id) {
            this.loading = true
            this.error = null
            try {
                await moviesService.deleteMovie(id)
                this.movies = this.movies.filter(m => m.id != id)
            } catch (error) {
                this.error = error.response?.data?.error || 'Erreur lors de la suppression du film.'
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async getStats() {
            try {
                const response = await moviesService.getMovieStats()
                return response.data
            } catch (error) {
                console.error('Erreur lors de la récupération des stats:', error)
                throw error
            }
        }
    }
})