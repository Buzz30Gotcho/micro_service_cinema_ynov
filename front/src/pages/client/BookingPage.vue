<template>
  <div class="min-h-screen bg-dark-bg text-light-text flex flex-col">
    <Header />
    
    <main class="flex-1 px-6 md:px-12 py-8">
      <div class="max-w-7xl mx-auto space-y-6">
        <div v-if="bookingStep === 1 && !selectedSession">
          <div class="flex items-center gap-3 mb-6">
            <Film :size="28" class="text-primary-accent" />
            <h2 class="text-2xl font-bold text-light-text">Choisissez un film</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="movie in moviesStore.movies" 
              :key="movie.id"
              @click="selectMovie(movie)"
              class="cursor-pointer group bg-dark-card rounded-xl overflow-hidden border border-dark-border hover:border-primary-accent transition-all hover:shadow-xl hover:shadow-primary-accent/20"
            >
              <div class="relative aspect-[2/3] overflow-hidden">
                                  <img 
                                    :src="movie.image" 
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

        <div v-if="bookingStep === 2 && !selectedSession">
          <button @click="bookingStep = 1" class="text-muted-text hover:text-light-text mb-4 flex items-center gap-2 text-sm">
            <ChevronLeft :size="16" /> Retour aux films
          </button>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-1">
              <div class="bg-dark-card rounded-xl border border-dark-border overflow-hidden sticky top-24">
                <img v-if="selectedMovie" :src="selectedMovie.image" class="w-full aspect-[4/3] object-cover">
                <div class="p-6">
                  <h2 class="text-2xl font-bold text-light-text mb-2">{{ selectedMovie?.title }}</h2>
                  <p class="text-muted-text text-sm leading-relaxed mt-2">
                    Sélectionnez une séance pour continuer votre réservation.
                  </p>
                </div>
              </div>
            </div>

            <div class="lg:col-span-2 space-y-4">
              <div class="flex items-center gap-3 mb-4">
                <Calendar :size="24" class="text-primary-accent" />
                <h3 class="text-xl font-bold text-light-text">Séances disponibles</h3>
              </div>
              <div 
                v-for="session in availableSessions" 
                :key="session.time"
                class="bg-dark-card border border-dark-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary-accent/50 transition-colors"
              >
                <div class="space-y-2">
                  <div class="flex items-center gap-3">
                    <Clock :size="20" class="text-primary-accent" />
                    <span class="text-2xl font-bold text-light-text">{{ session.time }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-sm text-muted-text">
                    <Calendar :size="16" />
                    <span>{{ session.date }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <MapPin :size="16" class="text-muted-text" />
                    <span class="px-2 py-0.5 rounded bg-dark-bg text-xs text-light-text">Salle {{ session.room }}</span>
                  </div>
                </div>
                <button 
                  @click="selectSession(session)"
                  class="px-6 py-2 bg-primary-accent text-light-text font-bold rounded-lg hover:bg-primary-hover transition-all flex items-center gap-2"
                >
                  <Armchair :size="18" />
                  Choisir vos places
                </button>
              </div>

              <div v-if="!availableSessions || availableSessions.length === 0" class="text-muted-text italic p-4 text-center">
                Aucune séance disponible pour ce film.
              </div>
            </div>
          </div>
        </div>

        <div v-if="bookingStep === 3 || selectedSession">
          <button 
            @click="goBackToSessions" 
            class="text-muted-text hover:text-light-text mb-4 flex items-center gap-2 text-sm"
          >
            <ChevronLeft :size="16" /> Retour aux séances
          </button>

          <div class="bg-dark-card rounded-xl border border-dark-border p-8 max-w-5xl mx-auto">
            <div class="bg-dark-bg rounded-lg p-4 mb-8 flex flex-wrap items-center justify-center gap-6 text-sm">
              <div class="flex items-center gap-2 text-muted-text">
                <Film :size="16" class="text-primary-accent" />
                <span class="font-semibold text-light-text">{{ selectedMovie?.title }}</span>
              </div>
              <div class="flex items-center gap-2 text-muted-text">
                <Clock :size="16" class="text-primary-accent" />
                <span>{{ selectedSession?.time }}</span>
              </div>
              <div class="flex items-center gap-2 text-muted-text">
                <Calendar :size="16" class="text-primary-accent" />
                <span>{{ selectedSession?.date }}</span>
              </div>
              <div class="flex items-center gap-2 text-muted-text">
                <MapPin :size="16" class="text-primary-accent" />
                <span>Salle {{ selectedSession?.room }}</span>
              </div>
            </div>

            <div class="flex items-center justify-center gap-3 mb-8">
              <Armchair :size="24" class="text-primary-accent" />
              <h2 class="text-center text-xl font-bold text-light-text">Sélectionnez vos places</h2>
            </div>
            
            <div class="w-full h-3 bg-gradient-to-b from-dark-border to-transparent rounded-full mb-1 shadow-[0_15px_40px_rgba(139,92,246,0.15)]"></div>
            <p class="text-center text-sm text-muted-text uppercase tracking-widest mb-12 flex items-center justify-center gap-2">
              <Monitor :size="16" class="text-primary-accent" />
              Écran
            </p>

            <div class="flex flex-col gap-3 items-center mb-12">
              <div v-for="row in 7" :key="row" class="flex gap-3 items-center">
                <span class="text-xs text-muted-text font-bold w-6 text-center">{{ String.fromCharCode(64 + row) }}</span>
                <button 
                  v-for="seat in 10" 
                  :key="`${row}-${seat}`"
                  @click="toggleSeat(row, seat)"
                  class="w-10 h-10 rounded-t-xl rounded-b-sm text-xs font-semibold flex items-center justify-center transition-all relative group"
                  :class="isSelected(row, seat) ? 'bg-primary-accent text-light-text shadow-lg shadow-primary-accent/50 scale-105' : isOccupied(row, seat) ? 'bg-red-900/30 text-red-400 cursor-not-allowed' : 'bg-emerald-900/20 hover:bg-primary-accent/70 hover:text-light-text text-emerald-300 hover:scale-105'"
                  :disabled="isOccupied(row, seat)"
                >
                  <Armchair :size="16" />
                  <span class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {{ String.fromCharCode(64 + row) }}{{ seat }}
                  </span>
                </button>
                <span class="text-xs text-muted-text font-bold w-6 text-center">{{ String.fromCharCode(64 + row) }}</span>
              </div>
            </div>

            <div class="flex justify-center gap-8 text-sm text-muted-text border-t border-slate-700 pt-6 mb-8">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-t-lg rounded-b-sm bg-emerald-900/20 flex items-center justify-center">
                  <Armchair :size="14" class="text-emerald-300" />
                </div>
                <span>Libre</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-t-lg rounded-b-sm bg-red-900/30 flex items-center justify-center">
                  <Armchair :size="14" class="text-red-400" />
                </div>
                <span>Occupé</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-t-lg rounded-b-sm bg-primary-accent flex items-center justify-center">
                  <Armchair :size="14" class="text-light-text" />
                </div>
                <span>Votre sélection</span>
              </div>
            </div>

            <div class="flex items-center justify-between bg-dark-bg rounded-lg p-4">
                <div class="text-lg">
                    <Ticket :size="20" class="inline text-primary-accent mr-2" />
                    <span class="font-bold text-light-text">{{ selectedSeats.size }}</span>
                    <span class="text-muted-text"> place(s) sélectionnée(s)</span>
                </div>
                <button 
                @click="showConfirmationModal = true"
                :disabled="selectedSeats.size === 0"
                class="px-8 py-3 bg-primary-accent text-light-text font-bold rounded-lg hover:bg-primary-hover shadow-lg shadow-primary-accent/20 transition-all disabled:bg-slate-700 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2"
                >
                <CheckCircle :size="20" />
                Confirmer ({{ ((parseFloat(selectedSession?.price) || 12.50) * selectedSeats.size).toFixed(2) }} €)
                </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div 
      v-if="showConfirmationModal" 
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      @click.self="showConfirmationModal = false"
    >
      <div class="bg-dark-card border border-dark-border rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-primary-accent/20 animate-scale-in">
        <div class="flex items-center justify-center mb-6">
          <div class="w-16 h-16 rounded-full bg-primary-accent/20 flex items-center justify-center">
            <CheckCircle :size="32" class="text-primary-accent" />
          </div>
        </div>
        
        <h3 class="text-2xl font-bold text-center text-light-text mb-2">Confirmer votre réservation</h3>
        <p class="text-center text-muted-text text-sm mb-6">Vérifiez les détails de votre réservation</p>
        
        <div class="space-y-4 bg-dark-bg rounded-lg p-4 mb-6">
          <div class="flex items-start gap-3">
            <Film :size="18" class="text-primary-accent mt-0.5" />
            <div class="flex-1">
              <div class="text-xs text-muted-text uppercase">Film</div>
              <div class="text-light-text font-semibold">{{ selectedMovie?.title }}</div>
            </div>
          </div>
          
          <div class="flex items-start gap-3">
            <Calendar :size="18" class="text-primary-accent mt-0.5" />
            <div class="flex-1">
              <div class="text-xs text-muted-text uppercase">Date & Heure</div>
              <div class="text-light-text font-semibold">{{ selectedSession?.date }} à {{ selectedSession?.time }}</div>
            </div>
          </div>
          
          <div class="flex items-start gap-3">
            <MapPin :size="18" class="text-primary-accent mt-0.5" />
            <div class="flex-1">
              <div class="text-xs text-muted-text uppercase">Salle</div>
              <div class="text-light-text font-semibold">Salle {{ selectedSession?.room }}</div>
            </div>
          </div>
          
          <div class="flex items-start gap-3">
            <Armchair :size="18" class="text-primary-accent mt-0.5" />
            <div class="flex-1">
              <div class="text-xs text-muted-text uppercase">Places sélectionnées</div>
              <div class="text-light-text font-semibold">{{ Array.from(selectedSeats).join(', ') }}</div>
            </div>
          </div>
          
          <div class="flex items-start gap-3 pt-4 border-t border-dark-border">
            <Ticket :size="18" class="text-primary-accent mt-0.5" />
            <div class="flex-1">
              <div class="text-xs text-muted-text uppercase">Total</div>
              <div class="text-2xl font-bold text-primary-accent">{{ ((parseFloat(selectedSession?.price) || 12.50) * selectedSeats.size).toFixed(2) }} €</div>
            </div>
          </div>
        </div>
        
        <div class="flex gap-3">
          <button 
            @click="showConfirmationModal = false"
            class="flex-1 px-6 py-3 bg-dark-bg text-light-text font-semibold rounded-lg hover:bg-slate-700 transition-colors"
          >
            Annuler
          </button>
          <button 
            @click="confirmBooking"
            :disabled="isBooking"
            class="flex-1 px-6 py-3 bg-primary-accent text-light-text font-bold rounded-lg hover:bg-primary-hover transition-all shadow-lg shadow-primary-accent/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isBooking" :size="20" class="animate-spin" />
            <CheckCircle v-else :size="20" />
            {{ isBooking ? 'Réservation...' : 'Confirmer la réservation' }}
          </button>
        </div>
      </div>
    </div>

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
import { 
  Film, 
  Calendar, 
  Clock, 
  MapPin, 
  Armchair, 
  CheckCircle, 
  ChevronLeft, 
  Ticket,
  Monitor,
  Loader2
} from 'lucide-vue-next'

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
const showConfirmationModal = ref(false)
const isBooking = ref(false)

const availableSessions = computed(() => {
  if (!selectedMovie.value || !allSessions.value) {
    return [];
  }
  
  
  const filtered = allSessions.value.filter(session => {
    const matchById = session.movieId == selectedMovie.value.id;
    const matchByName = session.nameMovie && session.nameMovie.toLowerCase() === selectedMovie.value.title.toLowerCase();
    const match = matchById || matchByName;
    
    if (match) {
    }
    
    return match;
  });
  
  return filtered;
});

onMounted(async () => {
  
  try {
    if (moviesStore.movies.length === 0) {
      await moviesStore.fetchMovies()
    } else {
    }
  } catch (error) {
  }
  
  await sessionsStore.fetchAllSessions()

  const movieIdFromUrl = route.query.movieId;
  const sessionIdFromUrl = route.params.sessionId;

  if (sessionIdFromUrl) {
    const session = sessionsStore.getSessionById(sessionIdFromUrl);
    
    if (session) {
      selectedSession.value = session;
      
      let movie = null;
      
      if (session.movieId && moviesStore.movies.length > 0) {
        movie = moviesStore.movies.find(m => {
          const match = m.id == session.movieId;
          return match;
        });
      }
      
      if (!movie && session.nameMovie && moviesStore.movies.length > 0) {
        movie = moviesStore.movies.find(m => {
          const match = m.title.toLowerCase() === session.nameMovie.toLowerCase();
          return match;
        });
      }
      
      if (movie) {
        selectedMovie.value = movie;
      } else {
        selectedMovie.value = {
          id: session.movieId || `temp-${session.nameMovie}`,
          title: session.nameMovie || 'Film inconnu',
          poster: session.posterPath || 'https://via.placeholder.com/300x450.png?text=Film',
          genre: session.genre || '',
          duration: session.duration || 120,
          rating: session.rating || 0,
          description: ''
        };
      }
      
      bookingStep.value = 3;
      await bookingsStore.fetchOccupiedSeats(session.id);
    } else {
      bookingStep.value = 1;
    }
  } else if (movieIdFromUrl) {
    const movie = moviesStore.movies.find(m => m.id === parseInt(movieIdFromUrl, 10));
    if (movie) {
      selectedMovie.value = movie;
      bookingStep.value = 2;
    }
  } else {
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

const goBackToSessions = () => {
  bookingStep.value = 2
  selectedSession.value = null
  selectedSeats.value.clear()
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
  const occupied = occupiedSeats.value.includes(seatCode)
  if (occupied) {
  }
  return occupied
}

const confirmBooking = async () => {
  if (selectedSeats.value.size === 0 || !authStore.currentUser) {
    alert('Veuillez sélectionner au moins une place et être connecté.')
    showConfirmationModal.value = false
    return
  }

  isBooking.value = true
  const bookingPromises = []
  const failedBookings = []

  const seatPrice = parseFloat(selectedSession.value?.price) || 12.50

  for (const seatCode of selectedSeats.value) {
    const bookingPayload = {
      name: `${authStore.currentUser.firstName} ${authStore.currentUser.lastName}`,
      email: authStore.currentUser.email,
      seanceId: selectedSession.value.id,
      seatNumber: seatCode,
      price: seatPrice,
    }
    bookingPromises.push(
      bookingsStore.createBooking(bookingPayload).catch(error => {
        failedBookings.push(seatCode)
      })
    )
  }

  try {
    await Promise.all(bookingPromises)
    isBooking.value = false
    showConfirmationModal.value = false
    
    if (failedBookings.length > 0) {
      alert(`Certaines réservations ont échoué pour les places : ${failedBookings.join(', ')}. Veuillez réessayer.`)
    } else {
      alert('Réservation(s) effectuée(s) avec succès !')
    }
    router.push('/client/my-bookings')
  } catch (error) {
    isBooking.value = false
    showConfirmationModal.value = false
    alert('Une erreur inattendue est survenue lors de la finalisation des réservations.')
  }
}
</script>

<style scoped>
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}
</style>
