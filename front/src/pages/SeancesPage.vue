<template>
  <div class="min-h-screen bg-dark-bg text-light-text">
    <Header />

    <main class="max-w-7xl mx-auto px-6 md:px-12 py-10">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-heading font-bold mb-2 text-light-text">Planning des séances</h1>
        <p class="text-muted-text">Retrouvez tous les films par jour et par horaire.</p>
      </div>

      <!-- Date selector -->
      <div class="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          v-for="date in dates"
          :key="date.value"
          @click="selectedDate = date.value"
          :class="[
            'px-6 py-3 rounded-lg border-2 font-semibold whitespace-nowrap transition-all',
            selectedDate === date.value
              ? 'bg-primary-accent border-primary-accent text-light-text'
              : 'bg-dark-card border-dark-border text-muted-text hover:border-primary-accent'
          ]"
        >
          <div class="text-sm">{{ date.day }}</div>
        </button>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="text-center text-muted-text py-16">Chargement des séances...</div>
      <div v-if="error" class="text-center text-danger py-16">{{ error }}</div>

      <!-- Sessions by movie -->
      <div v-if="!loading && !error" class="space-y-8">
        <div
          v-for="movie in moviesForSelectedDate"
          :key="movie.id"
          class="bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-md transition hover:border-primary-accent"
        >
          <!-- Movie header -->
          <div class="flex flex-col sm:flex-row gap-6 p-6">
            <img 
              :src="movie.image" 
              :alt="movie.title"
              class="w-full sm:w-32 h-48 sm:h-auto object-cover rounded-lg cursor-pointer"
              @click="goToMovie(movie.id)"
            />

            <div class="flex-1">
              <h2 @click="goToMovie(movie.id)" class="text-2xl font-heading font-bold mb-2 cursor-pointer hover:text-primary-accent transition text-light-text">{{ movie.title }}</h2>
              <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-text mb-4">
                <span>{{ movie.genre }}</span>
                <span>• {{ movie.duration }} min</span>
                <span>• ⭐ {{ movie.rating }}</span>
              </div>
              <p class="text-light-text text-sm line-clamp-2">{{ movie.description }}</p>
            </div>
          </div>

          <!-- Sessions grid -->
          <div class="p-6 border-t border-dark-border bg-dark-bg">
            <h3 class="text-sm font-semibold text-muted-text uppercase mb-4">Horaires disponibles pour {{ selectedDateFormatted }}</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <button
                v-for="session in movie.sessions"
                :key="session.id"
                @click="goToMovie(movie.id)"
                class="p-4 rounded-lg border-2 transition-all bg-dark-card border-dark-border hover:border-primary-accent hover:bg-dark-card/70 cursor-pointer"
              >
                <div class="text-xl font-bold mb-1 text-light-text">{{ session.time }}</div>
                <div class="text-xs text-muted-text">Salle {{ session.room }}</div>
              </button>
            </div>
          </div>
        </div>
         <div v-if="moviesForSelectedDate.length === 0 && !loading" class="text-center text-muted-text py-16">
            Aucune séance trouvée pour cette date.
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSessionsStore } from '@/stores/sessions.store'
import { useMoviesStore } from '@/stores/movies.store'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

const router = useRouter()
const sessionsStore = useSessionsStore()
const moviesStore = useMoviesStore()

// Reactive state from the store
const { loading, error } = storeToRefs(sessionsStore)
const { movies } = storeToRefs(moviesStore)

// Computed property for sessions grouped by movie and date
const groupedSessions = computed(() => {
  return sessionsStore.sessionsByMovie(selectedDate.value);
});

// Date selection logic
const dates = ref([
  { day: 'Aujourd\'hui', value: 'Aujourd\'hui' },
  { day: 'Demain', value: 'Demain' },
])
const selectedDate = ref('Aujourd\'hui')

// Computed property to get movies for the selected date, enriched with movie details
const moviesForSelectedDate = computed(() => {
  return groupedSessions.value.map(sessionGroup => {
    const movie = movies.value.find(m => m.id === sessionGroup.id);
    return movie ? { ...movie, sessions: sessionGroup.sessions } : null;
  }).filter(Boolean); // Filter out any nulls if a movie isn't found
});

const selectedDateFormatted = computed(() => {
    const date = dates.value.find(d => d.value === selectedDate.value);
    return date ? date.day.toLowerCase() : '';
});

// Fetch data on component mount
onMounted(() => {
  sessionsStore.fetchAllSessions()
  if (movies.value.length === 0) { // Fetch movies if not already loaded
    moviesStore.fetchMovies();
  }
})

// Navigation
const goToMovie = (movieId) => {
  router.push(`/film/${movieId}`)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>