<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <Header />

    <main class="max-w-7xl mx-auto px-6 md:px-12 py-10">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Planning des séances</h1>
        <p class="text-slate-400">Retrouvez tous les films par jour et par horaire.</p>
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
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-blue-500'
          ]"
        >
          <div class="text-sm">{{ date.day }}</div>
        </button>
      </div>

      <!-- Loading / Error -->
      <div v-if="loading" class="text-center text-slate-400 py-16">Chargement des séances...</div>
      <div v-if="error" class="text-center text-red-500 py-16">{{ error }}</div>

      <!-- Sessions by movie -->
      <div v-if="!loading && !error" class="space-y-8">
        <div
          v-for="movie in moviesForSelectedDate"
          :key="movie.id"
          class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition hover:border-slate-700"
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
              <h2 @click="goToMovie(movie.id)" class="text-2xl font-bold mb-2 cursor-pointer hover:text-blue-400 transition">{{ movie.title }}</h2>
              <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400 mb-4">
                <span>{{ movie.genre }}</span>
                <span>• {{ movie.duration }} min</span>
                <span>• ⭐ {{ movie.rating }}</span>
              </div>
              <p class="text-slate-300 text-sm line-clamp-2">{{ movie.description }}</p>
            </div>
          </div>

          <!-- Sessions grid -->
          <div class="p-6 border-t border-slate-800 bg-slate-950/50">
            <h3 class="text-sm font-semibold text-slate-400 uppercase mb-4">Horaires disponibles pour {{ selectedDateFormatted }}</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <button
                v-for="session in movie.sessions"
                :key="session.id"
                @click="goToMovie(movie.id)"
                class="p-4 rounded-lg border-2 transition-all bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-700/50 cursor-pointer"
              >
                <div class="text-xl font-bold mb-1">{{ session.time }}</div>
                <div class="text-xs text-slate-400">Salle {{ session.room }}</div>
              </button>
            </div>
          </div>
        </div>
         <div v-if="moviesForSelectedDate.length === 0 && !loading" class="text-center text-slate-500 py-16">
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
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

const router = useRouter()
const sessionsStore = useSessionsStore()

// Reactive state from the store
const { loading, error } = storeToRefs(sessionsStore)
const sessionsByMovie = computed(() => sessionsStore.sessionsByMovie)

// Date selection logic
const dates = ref([
  { day: 'Aujourd\'hui', value: 'Aujourd\'hui' },
  { day: 'Demain', value: 'Demain' },
])
const selectedDate = ref('Aujourd\'hui')

// Computed property to get movies for the selected date
const moviesForSelectedDate = computed(() => {
  return sessionsByMovie.value(selectedDate.value)
})

const selectedDateFormatted = computed(() => {
    const date = dates.value.find(d => d.value === selectedDate.value);
    return date ? date.day.toLowerCase() : '';
});

// Fetch data on component mount
onMounted(() => {
  sessionsStore.fetchAllSessions()
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