<template>
  <app-layout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white">Gestion des Films</h2>
          <p class="text-slate-400 text-sm">Ajouter, modifier ou supprimer des films du catalogue.</p>
        </div>
        <button 
          @click="openAddMovieModal"
          class="bg-cinema-accent hover:bg-cinema-accentHover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <i class="fa-solid fa-plus"></i> Nouveau Film
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="moviesStore.loading" class="flex justify-center py-12">
        <div class="text-slate-400">
          <i class="fa-solid fa-spinner animate-spin text-2xl"></i>
          <p class="mt-2">Chargement...</p>
        </div>
      </div>

      <!-- Movies Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="movie in moviesStore.movies" 
          :key="movie.id"
          class="group bg-cinema-800 rounded-xl overflow-hidden border border-cinema-700 hover:border-cinema-accent/50 transition-all hover:shadow-lg hover:shadow-cinema-accent/10 flex flex-col"
        >
          <div class="relative aspect-[2/3] overflow-hidden flex-shrink-0">
            <img 
              :src="movie.image" 
              :alt="movie.title" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-cinema-900 via-transparent to-transparent opacity-80"></div>
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <span class="text-xs font-bold text-cinema-accent uppercase tracking-wider mb-1 block">{{ movie.genre }}</span>
              <h3 class="text-lg font-bold text-white leading-tight">{{ movie.title }}</h3>
              <p class="text-xs text-slate-300 mt-1 flex items-center gap-1">
                <i class="fa-regular fa-clock"></i> {{ movie.duration }}
              </p>
            </div>
          </div>
          
          <!-- Actions Buttons -->
          <div class="p-3 space-y-2 flex-grow flex flex-col justify-end">
            <button 
              @click="editMovie(movie)"
              class="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <i class="fa-solid fa-pen"></i> Modifier
            </button>
            <button 
              @click="deleteMovie(movie.id)"
              class="w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <i class="fa-solid fa-trash"></i> Supprimer
            </button>
          </div>
        </div>

        <!-- Add New Placeholder -->
        <button 
          @click="openAddMovieModal"
          class="bg-cinema-800/50 rounded-xl border-2 border-dashed border-cinema-700 hover:border-cinema-accent hover:bg-cinema-800 transition-all flex flex-col items-center justify-center gap-3 aspect-[2/3] group"
        >
          <div class="w-12 h-12 rounded-full bg-cinema-700 group-hover:bg-cinema-accent flex items-center justify-center transition-colors">
            <i class="fa-solid fa-plus text-white text-xl"></i>
          </div>
          <span class="text-sm font-medium text-slate-400 group-hover:text-white">Ajouter un film</span>
        </button>
      </div>
    </div>

    <!-- Modal Add/Edit Movie -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 dark">
      <div class="bg-cinema-800 dark:bg-cinema-800 rounded-xl border border-cinema-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-bold text-white mb-6">{{ editingMovie ? 'Modifier le film' : 'Ajouter un film' }}</h3>
        
        <form @submit.prevent="saveMovie" class="space-y-4">
          <!-- Charger un film existant -->
          <div v-if="!editingMovie">
            <label class="block text-sm font-medium text-slate-300 mb-2">Charger un film existant (optionnel)</label>
            <select 
              @change="loadExistingMovie"
              class="w-full px-4 py-2 bg-cinema-700 border border-cinema-600 rounded-lg text-white focus:outline-none focus:border-cinema-accent transition-colors"
            >
              <option value="">Ou créer un nouveau film</option>
              <option v-for="movie in moviesStore.movies" :key="movie.id" :value="movie.id">
                {{ movie.title }} ({{ movie.genre }})
              </option>
            </select>
          </div>

          <!-- Titre -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Titre du film</label>
            <input 
              v-model="formData.title"
              type="text"
              placeholder="Entrez le titre du film"
              class="w-full px-4 py-2 bg-cinema-700 border border-cinema-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cinema-accent transition-colors"
              required
            />
          </div>

          <!-- Genre -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Genre</label>
            <select 
              v-model="formData.genre"
              class="w-full px-4 py-2 bg-cinema-700 border border-cinema-600 rounded-lg text-white focus:outline-none focus:border-cinema-accent transition-colors"
              required
            >
              <option value="">Sélectionner un genre</option>
              <option value="Action">Action</option>
              <option value="Drame">Drame</option>
              <option value="Comédie">Comédie</option>
              <option value="Science-Fiction">Science-Fiction</option>
              <option value="Horreur">Horreur</option>
              <option value="Thriller">Thriller</option>
              <option value="Aventure">Aventure</option>
              <option value="Romance">Romance</option>
              <option value="Animation">Animation</option>
            </select>
          </div>

          <!-- Durée -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Durée (minutes)</label>
            <input 
              v-model="formData.duration"
              type="number"
              placeholder="120"
              class="w-full px-4 py-2 bg-cinema-700 border border-cinema-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cinema-accent transition-colors"
              required
            />
          </div>

          <!-- Note -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Note (0-10)</label>
            <input 
              v-model="formData.rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="8.5"
              class="w-full px-4 py-2 bg-cinema-700 border border-cinema-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cinema-accent transition-colors"
              required
            />
          </div>

          <!-- Classification d'âge -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Classification d'âge</label>
            <select 
              v-model="formData.ageRating"
              class="w-full px-4 py-2 bg-cinema-700 border border-cinema-600 rounded-lg text-white focus:outline-none focus:border-cinema-accent transition-colors"
              required
            >
              <option value="">Sélectionner une classification</option>
              <option value="U">U (Tout public)</option>
              <option value="PG">PG (Parental Guidance)</option>
              <option value="12A">12A</option>
              <option value="15A">15A</option>
              <option value="18A">18A</option>
            </select>
          </div>

          <!-- Image de l'affiche -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Affiche du film</label>
            <select 
              v-model="formData.poster"
              class="w-full px-4 py-2 bg-cinema-700 border border-cinema-600 rounded-lg text-white focus:outline-none focus:border-cinema-accent transition-colors"
              required
            >
              <option value="">Sélectionner une affiche</option>
              <option value="/images/posters/the-matrix.jpg">The Matrix</option>
              <option value="/images/posters/avatar-the-way-of-water.jpg">Avatar 2</option>
              <option value="/images/posters/inception.jpg">Inception</option>
              <option value="/images/posters/dune.jpg">Dune</option>
              <option value="/images/posters/interstellar.jpg">Interstellar</option>
              <option value="/images/posters/titanic.jpg">Titanic</option>
              <option value="/images/posters/the-dark-knight.jpg">The Dark Knight</option>
              <option value="/images/posters/the-godfather-part-ii.jpg">The Godfather 2</option>
              <option value="/images/posters/the-shawshank-redemption.jpg">Shawshank</option>
              <option value="/images/posters/spider-man-far-from-home.jpg">Spider-Man</option>
              <option value="/images/posters/the-avengers.jpg">The Avengers</option>
              <option value="/images/posters/aquaman.jpg">Aquaman</option>
              <option value="/images/posters/parasite.jpg">Parasite</option>
              <option value="/images/posters/forrest-gump.jpg">Forrest Gump</option>
              <option value="/images/posters/jumanji.jpg">Jumanji</option>
              <option value="/images/posters/wonder-woman.jpg">Wonder Woman</option>
              <option value="/images/posters/star-wars-the-last-jedi.jpg">Star Wars</option>
              <option value="/images/posters/insaisissable.jpg">Insaisissable</option>
              <option value="/images/posters/tirailleurs.jpg\">Tirailleurs</option>
              <option value="/images/posters/la-noire-de.jpg">La Noire de</option>
            </select>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Résumé du film</label>
            <textarea 
              v-model="formData.description"
              placeholder="Décrivez brièvement le film..."
              rows="3"
              class="w-full px-4 py-2 bg-cinema-700 border border-cinema-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cinema-accent transition-colors resize-none"
            />
          </div>

          <!-- Boutons -->
          <div class="flex gap-3 justify-end pt-4">
            <button 
              @click="closeModal"
              type="button"
              class="px-4 py-2 bg-cinema-700 hover:bg-cinema-600 text-white rounded-lg font-medium transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-cinema-accent hover:bg-cinema-accentHover text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <i class="fa-solid fa-save"></i> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </app-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useMoviesStore } from '@/stores/movies.store'

const moviesStore = useMoviesStore()
const showModal = ref(false)
const editingMovie = ref(null)
const formData = ref({
  title: '',
  genre: '',
  duration: '',
  rating: '',
  ageRating: '',
  poster: '',
  description: ''
})

onMounted(async () => {
  await moviesStore.fetchMovies()
})

const openAddMovieModal = () => {
  editingMovie.value = null
  resetForm()
  showModal.value = true
}

const editMovie = (movie) => {
  editingMovie.value = movie
  formData.value = {
    title: movie.title,
    genre: movie.genre,
    duration: movie.duration,
    rating: movie.rating,
    ageRating: movie.ageRating,
    poster: movie.poster || movie.image,
    description: movie.description || ''
  }
  showModal.value = true
}

const loadExistingMovie = (event) => {
  const movieId = event.target.value
  if (!movieId) {
    resetForm()
    return
  }
  
  const movie = moviesStore.movies.find(m => m.id == movieId)
  if (movie) {
    formData.value = {
      title: movie.title,
      genre: movie.genre,
      duration: movie.duration,
      rating: movie.rating,
      ageRating: movie.ageRating || 'U',
      poster: movie.poster || movie.image,
      description: movie.description || ''
    }
  }
}

const closeModal = () => {
  showModal.value = false
  editingMovie.value = null
  resetForm()
}

const resetForm = () => {
  formData.value = {
    title: '',
    genre: '',
    duration: '',
    rating: '',
    ageRating: '',
    poster: '',
    description: ''
  }
}

const saveMovie = async () => {
  try {
    if (editingMovie.value) {
      // Modification
      await moviesStore.updateMovie(editingMovie.value.id, {
        title: formData.value.title,
        genre: formData.value.genre,
        duration: parseInt(formData.value.duration),
        rating: parseFloat(formData.value.rating),
        ageRating: formData.value.ageRating,
        poster: formData.value.poster,
        image: formData.value.poster,
        description: formData.value.description
      })
    } else {
      // Ajout
      await moviesStore.createMovie({
        title: formData.value.title,
        genre: formData.value.genre,
        duration: parseInt(formData.value.duration),
        rating: parseFloat(formData.value.rating),
        ageRating: formData.value.ageRating,
        poster: formData.value.poster,
        image: formData.value.poster,
        description: formData.value.description
      })
    }
    closeModal()
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du film:', error)
  }
}

const deleteMovie = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
    await moviesStore.deleteMovie(id)
  }
}
</script>

<style scoped>
input, select, textarea {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  background-color: #1a1a1a !important;
  caret-color: #ffffff !important;
}

input::placeholder, textarea::placeholder {
  color: #a0a0a0 !important;
  -webkit-text-fill-color: #a0a0a0 !important;
  opacity: 0.8 !important;
}

/* Force background color for all input states */
input:focus, select:focus, textarea:focus {
  background-color: #1a1a1a !important;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  outline: 2px solid #fbbf24 !important;
  outline-offset: -1px;
}

/* Autofill styling */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
select:-webkit-autofill,
textarea:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #1a1a1a inset !important;
  -webkit-text-fill-color: #ffffff !important;
}

/* Remove spinner buttons from number inputs */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

/* Style select options */
select option {
  background-color: #1a1a1a;
  color: #ffffff;
}

select option:checked {
  background: linear-gradient(#fbbf24, #fbbf24);
  background-color: #fbbf24 !important;
  color: #1a1a1a !important;
}
</style>
