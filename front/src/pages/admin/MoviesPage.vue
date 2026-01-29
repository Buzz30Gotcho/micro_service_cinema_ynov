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
          class="group bg-cinema-800 rounded-xl overflow-hidden border border-cinema-700 hover:border-cinema-accent/50 transition-all hover:shadow-lg hover:shadow-cinema-accent/10"
        >
          <div class="relative aspect-[2/3] overflow-hidden">
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
            
            <!-- Actions Overlay -->
            <div class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                @click="editMovie(movie)"
                class="w-8 h-8 rounded-full bg-black/50 backdrop-blur text-white hover:bg-cinema-accent flex items-center justify-center transition-colors"
              >
                <i class="fa-solid fa-pen text-xs"></i>
              </button>
              <button 
                @click="deleteMovie(movie.id)"
                class="w-8 h-8 rounded-full bg-black/50 backdrop-blur text-white hover:bg-red-600 flex items-center justify-center transition-colors"
              >
                <i class="fa-solid fa-trash text-xs"></i>
              </button>
            </div>
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

    <!-- Modal Add/Edit Movie (Simplified for now) -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div class="bg-cinema-800 rounded-xl border border-cinema-700 p-8 max-w-2xl w-full mx-4">
        <h3 class="text-xl font-bold text-white mb-4">{{ editingMovie ? 'Modifier le film' : 'Ajouter un film' }}</h3>
        <p class="text-slate-400 mb-4">Feature à implémenter avec formulaire complet</p>
        <button 
          @click="closeModal"
          class="px-4 py-2 bg-cinema-700 hover:bg-cinema-600 text-white rounded-lg"
        >
          Fermer
        </button>
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

onMounted(async () => {
  await moviesStore.fetchMovies()
})

const openAddMovieModal = () => {
  editingMovie.value = null
  showModal.value = true
}

const editMovie = (movie) => {
  editingMovie.value = movie
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingMovie.value = null
}

const deleteMovie = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
    await moviesStore.deleteMovie(id)
  }
}
</script>
