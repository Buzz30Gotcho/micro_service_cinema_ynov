<template>
  <div class="min-h-screen bg-dark-bg text-light-text flex flex-col">
    <Header />
    
    <main class="flex-1 px-6 md:px-12 py-8">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Step 1: Select Movie -->
        <div v-if="bookingStep === 1 && !selectedSession">
          <h2 class="text-2xl font-bold text-light-text mb-6">Choisissez un film</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="movie in moviesStore.movies" 
              :key="movie.id"
              @click="selectMovie(movie)"
              class="cursor-pointer group bg-dark-card rounded-xl overflow-hidden border border-dark-border hover:border-primary-accent transition-all hover:shadow-xl hover:shadow-primary-accent/20"
            >
              <div class="relative aspect-[2/3] overflow-hidden">
                                  <img 
                                    :src="movie.poster" 
                                    :alt="movie.title" 
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  >                <div class="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-90"></div>
                <div class="absolute bottom-0 left-0 right-0 p-5">
                  <h3 class="text-xl font-bold text-light-text leading-tight mb-2">{{ movie.title }}</h3>
                  <button class="w-full py-2 bg-primary-accent text-light-text text-sm font-medium rounded hover:bg-primary-hover transition-colors mt-2">
                    Choisir les séances
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Select Session -->
        <div v-if="bookingStep === 2 && !selectedSession">
          <button @click="bookingStep = 1" class="text-muted-text hover:text-light-text mb-4 flex items-center gap-2 text-sm">
            ← Retour aux films
          </button>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-1">
              <div class="bg-dark-card rounded-xl border border-dark-border overflow-hidden sticky top-24">
                <img v-if="selectedMovie" :src="selectedMovie.poster" class="w-full aspect-[4/3] object-cover">
                <div class="p-6">
                  <h2 class="text-2xl font-bold text-light-text mb-2">{{ selectedMovie?.title }}</h2>
                                     <p class="text-muted-text text-sm leading-relaxed mt-2">                    Sélectionnez une séance pour continuer votre réservation.
                  </p>
                </div>
              </div>
            </div>

            <div class="lg:col-span-2 space-y-4">
              <h3 class="text-xl font-bold text-light-text mb-4">Séances disponibles</h3>
              <div 
                v-for="session in availableSessions" 
                :key="session.time"
                class="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary-accent/50 transition-colors"
              >
                <div>
                  <div class="flex items-center gap-3 mb-1">
                    <span class="text-2xl font-bold text-light-text">{{ session.time }}</span>
                    <span class="px-2 py-0.5 rounded bg-dark-card text-xs text-light-text">Salle {{ session.room }}</span>
                  </div>
                   <p class="text-sm text-muted-text">{{ session.date }}</p>
                </div>
                                  <button 
                                  @click="selectSession(session)"
                                  class="px-6 py-2 bg-primary-accent text-light-text font-bold rounded-lg hover:bg-primary-hover transition-all"
                                >                  Choisir
                </button>
              </div>

              <div v-if="!availableSessions || availableSessions.length === 0" class="text-muted-text italic p-4 text-center">
                Aucune séance disponible pour ce film.
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Seat Selection -->
        <div v-if="bookingStep === 3 || selectedSession">
          <button @click="bookingStep = 2" class="text-muted-text hover:text-light-text mb-4 flex items-center gap-2 text-sm">
            ← Retour aux séances
          </button>

          <div class="bg-dark-card rounded-xl border border-dark-border p-8 max-w-4xl mx-auto">
            <h2 class="text-center text-xl font-bold text-light-text mb-8">Sélectionnez vos places</h2>
            
            <div class="w-full h-2 bg-dark-border rounded-full mb-1 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"></div>
            <p class="text-center text-xs text-muted-text uppercase tracking-widest mb-12">Écran</p>

            <div class="flex flex-col gap-3 items-center mb-12">
              <div v-for="row in 6" :key="row" class="flex gap-3">
                <button 
                  v-for="seat in 8" 
                  :key="`${row}-${seat}`"
                  @click="toggleSeat(row, seat)"
                  class="w-8 h-8 rounded-t-lg rounded-b-sm text-xs flex items-center justify-center transition-all"
                  :class="isSelected(row, seat) ? 'bg-primary-accent text-light-text shadow-lg shadow-primary-accent/50' : isOccupied(row, seat) ? 'bg-dark-bg text-muted-text cursor-not-allowed' : 'bg-dark-card hover:bg-primary-accent hover:text-light-text text-muted-text'"
                  :disabled="isOccupied(row, seat)"
                >
                  {{ String.fromCharCode(64 + row) }}{{ seat }}
                </button>
              </div>
            </div>

            <div class="flex justify-center gap-6 text-sm text-muted-text border-t border-slate-700 pt-6 mb-8">
              <div class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-dark-card"></div> Libre</div>
              <div class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-dark-bg"></div> Occupé</div>
              <div class="flex items-center gap-2"><div class="w-4 h-4 rounded bg-primary-accent"></div> Sélection</div>
            </div>

            <div class="flex items-center justify-between">
                <div class="text-lg">
                    <span class="font-bold text-light-text">{{ selectedSeats.size }}</span>
                    <span class="text-muted-text"> place(s) sélectionnée(s)</span>
                </div>
                <button 
                @click="confirmBooking"
                :disabled="selectedSeats.size === 0"
                class="px-8 py-3 bg-primary-accent text-light-text font-bold rounded-lg hover:bg-primary-hover shadow-lg shadow-primary-accent/20 transition-all disabled:bg-dark-card disabled:cursor-not-allowed"
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
import { useAuthStore } from '@/stores/auth.store'
import { useMoviesStore } from '@/stores/movies.store'
import { useBookingsStore } from '@/stores/bookings.store'
import { useSessionsStore } from '@/stores/sessions.store'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const moviesStore = useMoviesStore()
const bookingsStore = useBookingsStore()
const sessionsStore = useSessionsStore()

const { sessions: allSessions } = storeToRefs(sessionsStore)
const { occupiedSeats } = storeToRefs(bookingsStore)

const bookingStep = ref(1)
const selectedMovie = ref(null)
const selectedSession = ref(null)
const selectedSeats = ref(new Set())

const availableSessions = computed(() => {
  if (!selectedMovie.value || !allSessions.value) return [];
  return allSessions.value.filter(session => session.movieId === String(selectedMovie.value.id));
});

onMounted(async () => {
  if (moviesStore.movies.length === 0) {
    await moviesStore.fetchMovies()
  }
  await sessionsStore.fetchAllSessions()

  const movieIdFromUrl = route.query.movieId;
  const sessionIdFromUrl = route.params.sessionId;

  if (sessionIdFromUrl) {
    const session = sessionsStore.getSessionById(parseInt(sessionIdFromUrl, 10));
    if (session) {
      selectedSession.value = session;
      const movie = moviesStore.movies.find(m => m.id === session.movieId);
      if (movie) {
        selectedMovie.value = movie;
        bookingStep.value = 3;
        await bookingsStore.fetchOccupiedSeats(session.id);
      }
    }
  } else if (movieIdFromUrl) {
    const movie = moviesStore.movies.find(m => m.id === parseInt(movieIdFromUrl, 10));
    if (movie) {
      selectedMovie.value = movie;
      bookingStep.value = 2;
    }
  }
});

const selectMovie = (movie) => {
  selectedMovie.value = movie
  bookingStep.value = 2
}

const selectSession = async (session) => {
  selectedSession.value = session
  bookingStep.value = 3
  await bookingsStore.fetchOccupiedSeats(session.id);
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

const isOccupied = (row, seat) => {
  const seatCode = `${String.fromCharCode(64 + row)}${seat}`
  return occupiedSeats.value.includes(seatCode)
}

const confirmBooking = async () => {
  if (selectedSeats.value.size === 0 || !authStore.currentUser) {
    alert('Veuillez sélectionner au moins une place et être connecté.')
    return
  }

  const bookingPromises = []
  const failedBookings = []

  for (const seatCode of selectedSeats.value) {
    const bookingPayload = {
      name: `${authStore.currentUser.firstName} ${authStore.currentUser.lastName}`,
      email: authStore.currentUser.email,
      seanceId: selectedSession.value.id,
      seatNumber: seatCode,
    }
    bookingPromises.push(
      bookingsStore.createBooking(bookingPayload).catch(error => {
        failedBookings.push(seatCode)
        console.error(`Erreur lors de la réservation de la place ${seatCode}:`, error)
      })
    )
  }

  try {
    await Promise.all(bookingPromises)
    if (failedBookings.length > 0) {
      alert(`Certaines réservations ont échoué pour les places : ${failedBookings.join(', ')}. Veuillez réessayer.`)
    } else {
      alert('Réservation(s) effectuée(s) avec succès !')
    }
    router.push('/client/my-bookings')
  } catch (error) {
    alert('Une erreur inattendue est survenue lors de la finalisation des réservations.')
    console.error('Erreur finale de réservation:', error)
  }
}
</script>