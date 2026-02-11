<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <Header />
    
    <main class="flex-1 px-6 md:px-12 py-8">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Step 1: Select Movie -->
        <div v-if="bookingStep === 1">
          <h2 class="text-2xl font-bold text-white mb-6">Choisissez un film</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="movie in moviesStore.movies" 
              :key="movie.id"
              @click="selectMovie(movie)"
              class="cursor-pointer group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div class="relative aspect-[2/3] overflow-hidden">
                <img 
                  :src="movie.image" 
                  :alt="movie.title" 
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>
                <div class="absolute bottom-0 left-0 right-0 p-5">
                  <h3 class="text-xl font-bold text-white leading-tight mb-2">{{ movie.title }}</h3>
                  <button class="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-500 transition-colors mt-2">
                    Choisir les séances
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Select Session -->
        <div v-if="bookingStep === 2">
          <button @click="bookingStep = 1" class="text-slate-400 hover:text-white mb-4 flex items-center gap-2 text-sm">
            ← Retour aux films
          </button>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-1">
              <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden sticky top-24">
                <img v-if="selectedMovie" :src="selectedMovie.image" class="w-full aspect-[4/3] object-cover">
                <div class="p-6">
                  <h2 class="text-2xl font-bold text-white mb-2">{{ selectedMovie?.title }}</h2>
                  <p class="text-slate-400 text-sm leading-relaxed mt-2">
                    Sélectionnez une séance pour continuer votre réservation.
                  </p>
                </div>
              </div>
            </div>

            <div class="lg:col-span-2 space-y-4">
              <h3 class="text-xl font-bold text-white mb-4">Séances disponibles</h3>
              <div 
                v-for="session in availableSessions" 
                :key="session.time"
                class="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/50 transition-colors"
              >
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <span class="text-2xl font-bold text-white">{{ session.time }}</span>
                    <span class="px-2 py-0.5 rounded bg-slate-700 text-xs text-slate-300">Salle {{ session.room }}</span>
                  </div>
                   <p class="text-sm text-slate-400">{{ session.date }}</p>
                </div>
                <button 
                  @click="selectSession(session)"
                  class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-all"
                >
                  Choisir
                </button>
              </div>

              <div v-if="!availableSessions || availableSessions.length === 0" class="text-slate-500 italic p-4 text-center">
                Aucune séance disponible pour ce film.
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Seat Selection -->
        <div v-if="bookingStep === 3">
          <button @click="bookingStep = 2" class="text-slate-400 hover:text-white mb-4 flex items-center gap-2 text-sm">
            ← Retour aux séances
          </button>

          <div class="bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-4xl mx-auto">
            <h2 class="text-center text-xl font-bold text-white mb-8">Sélectionnez vos places</h2>
            
            <div class="w-full h-2 bg-slate-600 rounded-full mb-1 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"></div>
            <p class="text-center text-xs text-slate-500 uppercase tracking-widest mb-12">Écran</p>

            <div class="flex flex-col gap-3 items-center mb-12">
              <div v-for="row in 6" :key="row" class="flex gap-3">
                <button 
                  v-for="seat in 8" 
                  :key="`${row}-${seat}`"
                  @click="toggleSeat(row, seat)"
                  class="w-8 h-8 rounded-t-lg rounded-b-sm text-xs flex items-center justify-center transition-all"
                  :class="isSelected(row, seat) ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50' : isOccupied(row, seat) ? 'bg-slate-900 text-slate-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-400'"
                  :disabled="isOccupied(row, seat)"
                >
                  {{ String.fromCharCode(64 + row) }}{{ seat }}
                </button>
              </div>
            </div>

            <div class="flex justify-center gap-6 text-sm text-slate-400 border-t border-slate-700 pt-6 mb-8">
              <div class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-slate-700"></div> Libre</div>
              <div class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-slate-900"></div> Occupé</div>
              <div class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-blue-600"></div> Sélection</div>
            </div>

            <div class="flex items-center justify-between">
                <div class="text-lg">
                    <span class="font-bold text-white">{{ selectedSeats.size }}</span>
                    <span class="text-slate-400"> place(s) sélectionnée(s)</span>
                </div>
                <button 
                @click="confirmBooking"
                :disabled="selectedSeats.size === 0"
                class="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all disabled:bg-slate-700 disabled:cursor-not-allowed"
                >
                Confirmer ({{ (12.50 * selectedSeats.size).toFixed(2) }} €)
                </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { useMoviesStore } from '@/stores/movies.store'
import { useBookingsStore } from '@/stores/bookings.store'
import { useSessionsStore } from '@/stores/sessions.store' // Import sessions store
import { storeToRefs } from 'pinia' // Import storeToRefs

const route = useRoute()
const router = useRouter()
const moviesStore = useMoviesStore()
const bookingsStore = useBookingsStore()
const sessionsStore = useSessionsStore() // Initialize sessions store

// Get reactive access to all sessions from the store
const { sessions: allSessions } = storeToRefs(sessionsStore)

const bookingStep = ref(1)
const selectedMovie = ref(null)
const selectedSession = ref(null)
const selectedSeats = ref(new Set())

// Filter sessions from the sessionsStore based on the selected movie
const availableSessions = computed(() => {
  if (!selectedMovie.value || !allSessions.value) return [];
  return allSessions.value.filter(session => session.movieId === selectedMovie.value.id);
});

// Charge les films et toutes les sessions au montage de la page et gère le movieId de l'URL
onMounted(async () => {
  if (moviesStore.movies.length === 0) {
    await moviesStore.fetchMovies()
  }
  await sessionsStore.fetchAllSessions() // Fetch all sessions

  const movieIdFromUrl = route.query.movieId
  if (movieIdFromUrl) {
    const movie = moviesStore.movies.find(m => m.id.toString() === movieIdFromUrl)
    if (movie) {
      selectMovie(movie)
    }
  }
})

const selectMovie = (movie) => {
  selectedMovie.value = movie
  bookingStep.value = 2
}

const selectSession = (session) => {
  selectedSession.value = session
  bookingStep.value = 3
}

const toggleSeat = (row, seat) => {
  const seatCode = `${String.fromCharCode(64 + row)}${seat}`
  if (!isOccupied(row, seat)) {
    if (selectedSeats.value.has(seatCode)) {
      selectedSeats.value.delete(seatCode)
    } else {
      selectedSeats.value.add(seatCode)
    }
  }
}

const isSelected = (row, seat) => {
  const seatCode = `${String.fromCharCode(64 + row)}${seat}`
  return selectedSeats.value.has(seatCode)
}

// Simule des sièges déjà occupés de manière cohérente pour une session
const occupiedSeats = computed(() => {
    if (!selectedSession.value) return new Set();
    const mockOccupied = new Set();
    const capacity = 6 * 8;
    const occupiedCount = Math.floor(Math.random() * capacity * 0.4); // 40% occupied
    for (let i = 0; i < occupiedCount; i++) {
        const row = Math.floor(Math.random() * 6) + 1;
        const seat = Math.floor(Math.random() * 8) + 1;
        mockOccupied.add(`${String.fromCharCode(64 + row)}${seat}`);
    }
    return mockOccupied;
});

const isOccupied = (row, seat) => {
  const seatCode = `${String.fromCharCode(64 + row)}${seat}`
  return occupiedSeats.value.has(seatCode)
}

const confirmBooking = async () => {
  if (selectedSeats.value.size === 0) {
    alert('Veuillez sélectionner au moins une place.')
    return
  }

  try {
    // Note: createBooking est simulé dans le store pour fonctionner sans backend
    await bookingsStore.createBooking({
      movieId: selectedMovie.value.id,
      movieTitle: selectedMovie.value.title,
      sessionId: selectedSession.value.id, // Assurez-vous que les sessions ont des ID uniques
      sessionTime: selectedSession.value.time,
      sessionDate: selectedSession.value.date,
      seats: Array.from(selectedSeats.value),
      totalPrice: (12.50 * selectedSeats.value.size).toFixed(2)
    })
    
    // Redirection vers la page des réservations de l'utilisateur
    router.push('/client/my-bookings')
    
  } catch (error) {
    alert('Erreur lors de la réservation: ' + error.message)
  }
}
</script>