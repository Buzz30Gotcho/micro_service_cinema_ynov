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
                        :src="movie.poster" 
                        :alt="movie.title"
                        class="w-full sm:w-32 h-48 sm:h-auto object-cover rounded-lg cursor-pointer"
                        @click="goToMovieDetail(movie.id)"
                      />
            <div class="flex-1">
              <h2 @click="goToMovieDetail(movie.id)" class="text-2xl font-heading font-bold mb-2 cursor-pointer hover:text-primary-accent transition text-light-text">{{ movie.title }}</h2>
              <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-text mb-4">
                <span>{{ movie.genre }}</span>
                <span>• {{ movie.duration }} min</span>
                <span class="inline-flex items-center gap-1">• <Star :size="14" /> {{ movie.rating }}</span>
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
                @click="goToSessionBooking(session.id)"
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
import { Star } from 'lucide-vue-next'

const router = useRouter()
const sessionsStore = useSessionsStore()
const moviesStore = useMoviesStore()

// Reactive state from the stores
const { sessions, loading, error } = storeToRefs(sessionsStore)
const { movies } = storeToRefs(moviesStore)

// --- Date Logic ---
function formatDateISO(date) {
  return date.toISOString().split('T')[0];
}

function generateDates(n) {
  const arr = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const value = formatDateISO(d);
    let dayLabel = d.toLocaleDateString('fr-FR', { weekday: 'long' });
    dayLabel = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);
    if (i === 0) dayLabel = "Aujourd'hui";
    else if (i === 1) dayLabel = 'Demain';
    arr.push({ day: dayLabel, value });
  }
  return arr;
}

const dates = ref(generateDates(7));
const selectedDate = ref(formatDateISO(new Date()));

// --- Computed Properties for Display ---

  const moviesForSelectedDate = computed(() => {
    if (sessions.value.length === 0) {
      return [];
    }

    const durationFromSession = (s) => {
      if (s.duration) return s.duration;
      if (!s.hourStart || !s.hourEnd) return null;
      const [h1, m1] = String(s.hourStart).split(':').map(Number);
      const [h2, m2] = String(s.hourEnd).split(':').map(Number);
      let start = h1 * 60 + (m1 || 0);
      let end = h2 * 60 + (m2 || 0);
      if (end <= start) end += 24 * 60;
      return end - start;
    };

    // 1. Filter sessions for the selected date
    const todaysSessions = sessions.value.filter(session => session.date === selectedDate.value);

    const sessionsByMovie = todaysSessions.reduce((acc, session) => {
      const key = session.movieId ?? session.nameMovie ?? 'unknown';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(session);
      return acc;
    }, {});

    return Object.keys(sessionsByMovie).map(key => {
      let movie = movies.value.find(m => String(m.id) === key);
      if (!movie) {
        movie = movies.value.find(m => m.title === key);
      }

      if (!movie) {
        const s = sessionsByMovie[key][0];
        return {
          id: `session-${key}`,
          title: s.nameMovie || 'Film inconnu',
          genre: s.genre || null,
          duration: s.duration || durationFromSession(s) || null,
          rating: s.rating || null,
          description: s.description || null,
          poster: s.posterPath || 'https://via.placeholder.com/300x450.png?text=Poster',
          sessions: sessionsByMovie[key],
        };
      }

      return { ...movie, sessions: sessionsByMovie[key] };
    }).filter(Boolean);
  });

const selectedDateFormatted = computed(() => {
    const date = dates.value.find(d => d.value === selectedDate.value);
    return date ? date.day.toLowerCase() : '';
});

// --- Lifecycle ---

onMounted(async () => {
  await Promise.all([
    sessionsStore.fetchAllSessions(),
    movies.value.length === 0 ? moviesStore.fetchMovies() : Promise.resolve()
  ]);

  // If there are sessions, default the selected date to the earliest session date
  if (sessions.value.length > 0) {
    const uniqueDates = Array.from(new Set(sessions.value.map(s => s.date))).filter(Boolean).sort();
    if (uniqueDates.length > 0) {
      // If earliest session date is not in our dates list, prepend it
      const earliest = uniqueDates[0];
      const exists = dates.value.find(d => d.value === earliest);
      if (!exists) {
        // Add at front with a readable label
        dates.value.unshift({ day: new Date(earliest).toLocaleDateString('fr-FR', { weekday: 'long' }), value: earliest });
      }
      selectedDate.value = earliest;
    }
  }
})

// --- Navigation ---

const goToSessionBooking = (sessionId) => {
  router.push(`/reserver/${sessionId}`)
}

const goToMovieDetail = (movieId) => {
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