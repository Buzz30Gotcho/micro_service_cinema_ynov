<template>
  <div class="min-h-screen bg-gradient-to-b from-dark-bg via-dark-card/20 to-dark-bg text-light-text">
    <Header />

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-40 text-muted-text">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent"></div>
      <p class="mt-4">Chargement du film...</p>
    </div>

    <!-- Error State -->
    <div v-if="error && !movie" class="text-center py-40">
      <p class="text-red-500 text-xl">{{ error }}</p>
    </div>

    <!-- Main Content -->
    <div v-if="movie && !loading" class="overflow-hidden">
      <!-- Hero Section -->
      <section class="relative h-[60vh] flex items-end overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <!-- Content -->
        <div class="relative z-10 w-full px-4 md:px-12 pb-8 md:pb-12">
          <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end">
            <!-- Poster -->
            <div class="hidden md:block md:col-span-1 transform hover:scale-105 transition-transform duration-300">
              <div class="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-primary-accent/20 backdrop-blur max-w-xs">
                <img :src="movie.posterUrl || movie.image" :alt="movie.title" class="w-full h-full object-cover">
              </div>
            </div>

            <!-- Info -->
            <div class="md:col-span-2 space-y-4 animate-fadeIn">
              <!-- Title -->
              <div>
                <h1 class="text-3xl md:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                  {{ movie.title }}
                </h1>
                <p class="text-muted-text mt-2 text-base md:text-lg">{{ movie.year }}</p>
              </div>

              <!-- Rating and Info Pills -->
              <div class="flex flex-wrap gap-2">
                <div class="flex items-center gap-2 bg-primary-accent/20 backdrop-blur px-3 py-1.5 rounded-full border border-primary-accent/40">
                  <span class="text-lg">⭐</span>
                  <span class="font-semibold">{{ movie.rating }}/5</span>
                </div>
                <div class="bg-dark-card/60 backdrop-blur px-3 py-1.5 rounded-full border border-dark-border text-sm">
                  <span>⏱️ {{ movie.duration }} min</span>
                </div>
                <div class="bg-dark-card/60 backdrop-blur px-3 py-1.5 rounded-full border border-dark-border text-sm">
                  <span>{{ movie.ageRating }}</span>
                </div>
                <div class="bg-primary-accent/10 backdrop-blur px-3 py-1.5 rounded-full border border-primary-accent/30 text-sm">
                  <span>{{ movie.genre }}</span>
                </div>
              </div>

              <!-- Description -->
              <p class="text-light-text/90 leading-relaxed max-w-2xl line-clamp-3">
                {{ movie.description || movie.synopsis }}
              </p>

              <!-- CTA Buttons -->
              <div class="flex flex-wrap gap-3 pt-4">
                <button @click="goToBooking" 
                  class="px-6 py-2.5 bg-primary-accent hover:bg-primary-hover text-dark-bg font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm md:text-base">
                  🎫 Réserver des places
                </button>
                <button class="px-6 py-2.5 bg-dark-card/60 hover:bg-dark-card text-light-text font-semibold rounded-lg border border-dark-border transition-all duration-300 backdrop-blur text-sm md:text-base">
                  ❤️ Ajouter à la liste
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Details Section -->
      <section class="px-4 md:px-12 py-16 md:py-24">
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-12">
            <!-- Synopsis -->
            <div class="bg-dark-card/40 backdrop-blur border border-dark-border rounded-2xl p-8 hover:bg-dark-card/60 transition-colors duration-300">
              <h2 class="text-3xl font-bold text-primary-accent mb-6">Synopsis</h2>
              <p class="text-light-text/80 text-lg leading-relaxed">
                {{ movie.synopsis || movie.description }}
              </p>
            </div>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-if="movie.director" class="bg-dark-card/40 backdrop-blur border border-dark-border rounded-xl p-6 hover:bg-dark-card/60 transition-colors duration-300">
                <h3 class="text-sm uppercase tracking-widest text-muted-text font-semibold mb-3">Réalisateur</h3>
                <p class="text-xl font-semibold text-light-text">{{ movie.director }}</p>
              </div>
              <div v-if="movie.writer" class="bg-dark-card/40 backdrop-blur border border-dark-border rounded-xl p-6 hover:bg-dark-card/60 transition-colors duration-300">
                <h3 class="text-sm uppercase tracking-widest text-muted-text font-semibold mb-3">Scénariste</h3>
                <p class="text-xl font-semibold text-light-text">{{ movie.writer }}</p>
              </div>
              <div v-if="movie.producer" class="bg-dark-card/40 backdrop-blur border border-dark-border rounded-xl p-6 hover:bg-dark-card/60 transition-colors duration-300">
                <h3 class="text-sm uppercase tracking-widest text-muted-text font-semibold mb-3">Producteur</h3>
                <p class="text-xl font-semibold text-light-text">{{ movie.producer }}</p>
              </div>
              <div v-if="movie.studio" class="bg-dark-card/40 backdrop-blur border border-dark-border rounded-xl p-6 hover:bg-dark-card/60 transition-colors duration-300">
                <h3 class="text-sm uppercase tracking-widest text-muted-text font-semibold mb-3">Studio</h3>
                <p class="text-xl font-semibold text-light-text">{{ movie.studio }}</p>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-8">
            <!-- Booking Card -->
            <div class="bg-gradient-to-br from-primary-accent/20 to-primary-accent/5 backdrop-blur border border-primary-accent/30 rounded-2xl p-8 sticky top-24">
              <h3 class="text-2xl font-bold mb-6 flex items-center gap-2">🎬 Réserver maintenant</h3>
              <button @click="goToBooking" 
                class="w-full px-6 py-4 bg-primary-accent hover:bg-primary-hover text-dark-bg font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg">
                Voir les séances
              </button>
              <p class="text-sm text-muted-text mt-4 text-center">Choisissez vos places et vos horaires</p>
            </div>

            <!-- Info Card -->
            <div class="bg-dark-card/40 backdrop-blur border border-dark-border rounded-2xl p-8">
              <h3 class="text-xl font-bold mb-6">ℹ️ Infos pratiques</h3>
              <div class="space-y-4 text-sm">
                <div>
                  <p class="text-muted-text uppercase tracking-wider text-xs font-semibold mb-1">Genre</p>
                  <p class="text-light-text font-medium">{{ movie.genre }}</p>
                </div>
                <div>
                  <p class="text-muted-text uppercase tracking-wider text-xs font-semibold mb-1">Durée</p>
                  <p class="text-light-text font-medium">{{ movie.duration }} minutes</p>
                </div>
                <div>
                  <p class="text-muted-text uppercase tracking-wider text-xs font-semibold mb-1">Classification</p>
                  <p class="text-light-text font-medium">{{ movie.ageRating }}</p>
                </div>
                <div>
                  <p class="text-muted-text uppercase tracking-wider text-xs font-semibold mb-1">Année de sortie</p>
                  <p class="text-light-text font-medium">{{ movie.year }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Similar Movies -->
      <section v-if="similarMovies.length" class="px-4 md:px-12 py-16 md:py-24 border-t border-dark-border">
        <div class="max-w-7xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold mb-12">Films similaires</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div v-for="similar in similarMovies" :key="similar.id" 
              @click="goToMovie(similar.id)"
              class="group cursor-pointer transform hover:scale-110 transition-transform duration-300">
              <div class="relative aspect-[2/3] rounded-xl overflow-hidden border border-dark-border/50 hover:border-primary-accent/50 transition-colors duration-300">
                <img :src="similar.posterUrl || similar.image" :alt="similar.title" class="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300">
                <div class="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 class="font-bold text-sm mb-1">{{ similar.title }}</h3>
                  <p class="text-xs text-muted-text">{{ similar.genre }}</p>
                  <span class="text-sm font-semibold text-primary-accent mt-2">⭐ {{ similar.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMoviesStore } from '@/stores/movies.store'
import { storeToRefs } from 'pinia'
import Header from '@/components/common/Header.vue'

const route = useRoute()
const router = useRouter()
const moviesStore = useMoviesStore()

// Reactive references to the store state
const { selectedMovie: movie, movies, loading, error } = storeToRefs(moviesStore)

// Fetch all movies if the list is empty (for similar movies)
onMounted(() => {
  if (movies.value.length === 0) {
    moviesStore.fetchMovies()
  }
})

// Function to load movie data
const loadMovie = (id) => {
  moviesStore.fetchMovieById(id)
}

// Load movie data when component mounts
onMounted(() => {
  loadMovie(route.params.id)
})

// Watch for route changes to load new movie data
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadMovie(newId)
  }
})

// Computed property for similar movies
const similarMovies = computed(() => {
  if (!movie.value || movies.value.length === 0) return []
  // Exclude current movie and filter by genre, then take top 5
  return movies.value
    .filter(m => m.id !== movie.value.id && m.genre === movie.value.genre)
    .slice(0, 5)
})

// Navigation functions
const goToBooking = () => {
  if (movie.value) {
    router.push(`/client/booking?movieId=${movie.value.id}`)
  }
}
const goToMovie = (id) => {
  router.push(`/film/${id}`)
  window.scrollTo(0, 0)
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}
</style>