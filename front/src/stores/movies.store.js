import { defineStore } from 'pinia'
// import moviesService from '@/api/movies.service'

// --- MOCK DATA ---
// Données de films pour le développement sans backend.
const mockMovies = [
  {
    id: 1,
    title: 'Lumières de la Ville',
    genre: 'Comédie Dramatique',
    duration: 138,
    rating: 4.7,
    year: 2025,
    ageRating: '12+',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    description: 'Dans une métropole futuriste, un artiste marginal découvre un complot qui menace l\'équilibre de la société. Entre action spectaculaire et réflexion profonde sur l\'humanité.',
    synopsis: 'Dans une métropole futuriste où la technologie et l\'art se côtoient, Max, un artiste de rue marginal, découvre par hasard un complot orchestré par les plus hautes sphères du pouvoir. Contraint de fuir, il s\'allie à une journaliste déterminée et à un groupe de rebelles pour dévoiler la vérité. Entre poursuites haletantes, trahisons et révélations, Max doit choisir entre sa liberté et le destin de millions de personnes.',
    director: 'Sophie Martin',
    writer: 'Jean Dupont',
    producer: 'Marie Laurent',
    studio: 'CineVision Productions',
    releaseDate: '15 Mars 2025',
    budget: '45 millions €',
    cast: [
      { name: 'Thomas Bernard', role: 'Max' },
      { name: 'Clara Dubois', role: 'Emma' },
      { name: 'Lucas Moreau', role: 'Le Colonel' },
      { name: 'Sophie Petit', role: 'Nina' }
    ],
    sessions: [
      { date: 'Aujourd\'hui', time: '14:30', room: '3', availableSeats: 45 },
      { date: 'Aujourd\'hui', time: '18:00', room: '1', availableSeats: 12 },
      { date: 'Aujourd\'hui', time: '21:15', room: '3', availableSeats: 28 },
      { date: 'Demain', time: '14:00', room: '2', availableSeats: 67 },
      { date: 'Demain', time: '20:30', room: '1', availableSeats: 34 }
    ]
  },
  { id: 2, title: 'Océan Bleu', genre: 'Documentaire', duration: 102, rating: 4.3, image: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=800&q=80', year: 2024, description: 'Explorez les profondeurs inconnues des abysses et découvrez des créatures marines fascinantes.', synopsis: 'Un voyage époustouflant dans les fonds marins, révélant des écosystèmes fragiles et des espèces encore jamais filmées. Ce documentaire suit une équipe de scientifiques passionnés à bord d\'un submersible de pointe.' },
  { id: 3, title: 'Nocturne', genre: 'Thriller', duration: 116, rating: 4.1, image: 'https://images.unsplash.com/photo-1505432197924-c36723205007?w=800&q=80', year: 2025, description: 'Un détective privé hanté par son passé enquête sur une série de meurtres mystérieux qui n\'ont lieu que la nuit.', synopsis: 'À la retraite, le détective Miller est rappelé pour une dernière affaire. Un tueur en série sème la panique, laissant derrière lui des indices énigmatiques. Miller doit affronter ses propres démons pour arrêter le coupable avant qu\'il ne frappe à nouveau.' },
  { id: 4, title: 'Atlas', genre: 'Aventure', duration: 129, rating: 4.5, image: 'https://images.unsplash.com/photo-1511203348235-99893a036329?w=800&q=80', year: 2024, description: 'Une jeune exploratrice part à la recherche d\'une cité antique perdue, guidée par un journal de famille.', synopsis: 'Lara, une jeune archéologue intrépide, suit les traces de son grand-père disparu pour trouver la légendaire cité d\'Atlas. Son périple la mènera à travers des jungles denses, des ruines dangereuses et des énigmes complexes.' },
  { id: 5, title: 'Le Dernier Acte', genre: 'Drame', duration: 112, rating: 4.0, image: 'https://images.unsplash.com/photo-1542838132-350bf684758b?w=800&q=80', year: 2023, description: 'La vie d\'une troupe de théâtre est bouleversée par l\'arrivée d\'un nouveau metteur en scène aux méthodes peu orthodoxes.', synopsis: 'Une troupe de théâtre en difficulté voit sa dernière chance de succès dans une nouvelle pièce. Mais le metteur en scène engagé, connu pour son exigence extrême, pousse les acteurs dans leurs derniers retranchements, révélant des tensions et des secrets enfouis.' },
  { id: 6, title: 'Hyperdrive', genre: 'Science-Fiction', duration: 138, rating: 4.6, image: 'https://images.unsplash.com/photo-1610296669228-602fa827fc1f?w=800&q=80', year: 2025, description: 'L\'équipage d\'un vaisseau spatial doit survivre à un voyage interstellaire semé d\'embûches pour livrer un colis précieux.', synopsis: 'Dans un futur lointain, le cargo spatial "Stardust" et son équipage hétéroclite acceptent une mission à haut risque. Ce qui semblait être une livraison de routine se transforme en une course pour la survie contre des pirates de l\'espace et une intelligence artificielle rebelle.' },
  { id: 7, title: 'Echo', genre: 'Mystère', duration: 104, rating: 3.9, image: 'https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=800&q=80', year: 2023, description: 'Une scientifique découvre un signal radio provenant d\'une galaxie lointaine, mais son contenu pourrait changer le cours de l\'humanité.', synopsis: 'Dr. Aris Thorne passe ses nuits à écouter le cosmos. Un soir, un signal structuré et complexe parvient à son télescope. En le déchiffrant, elle réalise qu\'il ne s\'agit pas d\'un phénomène naturel, mais d\'un message. Un message qui porte un lourd avertissement.' },
  { id: 8, title: 'Renaissance', genre: 'Historique', duration: 145, rating: 4.2, image: 'https://images.unsplash.com/photo-1533109721025-d1ae7ee7c452?w=800&q=80', year: 2024, description: 'Plongez au cœur de la Florence du XVe siècle et suivez le destin croisé de deux artistes rivaux.', synopsis: 'Le film dépeint la rivalité intense entre deux grands maîtres de la Renaissance, de leur formation dans les ateliers florentins jusqu\'à la réalisation de leurs chefs-d\'œuvre. Une histoire de passion, de jalousie et de génie artistique.' },
]
// --- FIN MOCK DATA ---


export const useMoviesStore = defineStore('movies', {
    state: () => ({
        movies: [],
        selectedMovie: null,
        loading: false,
        error: null
    }),

    getters: {
        getAllMovies: (state) => state.movies,
        // Le getter est modifié pour accepter un ID numérique ou une chaîne
        getMovieById: (state) => (id) => state.movies.find(m => m.id == id)
    },

    actions: {
        // Simule un appel API pour récupérer tous les films
        async fetchMovies() {
            this.loading = true
            this.error = null
            try {
                // Simule une latence réseau
                await new Promise(resolve => setTimeout(resolve, 500))
                // Affecte les données mockées à l'état
                this.movies = mockMovies
            } catch (error) {
                this.error = 'Erreur simulée lors du chargement des films.'
                console.error(this.error, error)
            } finally {
                this.loading = false
            }
        },

        // Simule un appel API pour récupérer un film par son ID
        async fetchMovieById(id) {
            this.loading = true
            this.error = null
            try {
                await new Promise(resolve => setTimeout(resolve, 300))
                const movie = mockMovies.find(m => m.id == id)
                if (movie) {
                    this.selectedMovie = movie
                    return movie
                } else {
                    throw new Error('Film non trouvé')
                }
            } catch (error) {
                this.error = error.message
                console.error('Erreur lors du chargement du film:', error)
            } finally {
                this.loading = false
            }
        },

        // Simule la création d'un film
        async createMovie(movieData) {
            this.loading = true
            this.error = null
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                const newMovie = {
                    id: Math.max(0, ...mockMovies.map(m => m.id)) + 1, // Génère un nouvel ID
                    ...movieData
                }
                mockMovies.push(newMovie)
                this.movies.push(newMovie)
                return newMovie
            } catch (error) {
                this.error = 'Erreur simulée lors de la création du film.'
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // Simule la mise à jour d'un film
        async updateMovie(id, movieData) {
            this.loading = true
            this.error = null
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                const index = mockMovies.findIndex(m => m.id == id)
                if (index > -1) {
                    mockMovies[index] = { ...mockMovies[index], ...movieData }
                    // Met aussi à jour la liste dans le state si elle est chargée
                    const stateIndex = this.movies.findIndex(m => m.id == id)
                    if (stateIndex > -1) {
                        this.movies[stateIndex] = mockMovies[index]
                    }
                    return mockMovies[index]
                } else {
                    throw new Error('Film non trouvé pour la mise à jour.')
                }
            } catch (error) {
                this.error = error.message
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // Simule la suppression d'un film
        async deleteMovie(id) {
            this.loading = true
            this.error = null
            try {
                await new Promise(resolve => setTimeout(resolve, 500))
                const index = mockMovies.findIndex(m => m.id == id)
                if (index > -1) {
                    mockMovies.splice(index, 1)
                    this.movies = this.movies.filter(m => m.id != id)
                } else {
                    throw new Error('Film non trouvé pour la suppression.')
                }
            } catch (error) {
                this.error = error.message
                console.error(this.error, error)
                throw error
            } finally {
                this.loading = false
            }
        },

        // Simule la récupération de statistiques
        async getStats() {
            try {
                return {
                    totalMovies: mockMovies.length,
                    averageRating: (mockMovies.reduce((acc, m) => acc + m.rating, 0) / mockMovies.length).toFixed(2)
                }
            } catch (error) {
                console.error('Erreur simulée lors de la récupération des stats:', error)
                throw error
            }
        }
    }
})