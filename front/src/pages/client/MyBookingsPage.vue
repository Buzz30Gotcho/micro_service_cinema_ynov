<template>
  <div class="min-h-screen bg-dark-bg text-light-text flex flex-col">
    <Header />
    
    <main class="flex-1 px-6 md:px-12 py-8">
      <div class="max-w-7xl mx-auto space-y-6">
        <h2 class="text-2xl font-bold text-light-text">Mes Réservations</h2>

      <!-- Loading State -->
      <div v-if="bookingsStore.loading" class="flex justify-center py-12">
        <div class="text-muted-text">
          <i class="fa-solid fa-spinner animate-spin text-2xl"></i>
          <p class="mt-2">Chargement...</p>
        </div>
      </div>

      <!-- Bookings List -->
      <div v-else-if="bookingsStore.userBookings.length > 0" class="space-y-6">
        <div 
          v-for="booking in bookingsStore.userBookings" 
          :key="booking.id"
          class="bg-dark-card rounded-xl border border-dark-border p-6 flex flex-col md:flex-row gap-6 items-start"
        >
          <!-- Movie Poster -->
          <div class="w-full md:w-32 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
            <img :src="getMovieImage(booking.seance?.movieId)" class="w-full h-full object-cover">
          </div>

          <!-- Booking Details -->
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-bold text-light-text">{{ getMovieTitle(booking.seance?.movieId) }}</h3>
                <p class="text-muted-text text-sm mt-1">
                  {{ booking.seance?.room || 'Salle inconnue' }} • {{ formatDateTime(booking.seance?.dateTime) }}
                </p>
              </div>
            </div>

            <!-- Booking Info -->
            <div class="mt-6 grid grid-cols-2 gap-4 max-w-sm">
              <div class="bg-dark-bg p-3 rounded border border-dark-border">
                <p class="text-xs text-muted-text uppercase">Place</p>
                <p class="text-light-text font-mono">{{ booking.seatNumber || 'N/A' }}</p>
              </div>
              <div class="bg-dark-bg p-3 rounded border border-dark-border">
                <p class="text-xs text-muted-text uppercase">Référence</p>
                <p class="text-light-text font-mono">#{{ booking.id.substring(0, 8) }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex gap-2">
              <button 
                @click="viewDetails(booking)"
                class="px-4 py-2 bg-primary-accent hover:bg-primary-hover text-light-text text-sm rounded-lg transition-colors"
              >
                Détails
              </button>
              <button 
                @click="handleCancelBooking(booking.id)"
                class="px-4 py-2 bg-danger hover:bg-danger-hover text-light-text text-sm rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>

          <!-- QR Code -->
          <div class="flex-shrink-0 self-center">
            <div class="w-24 h-24 bg-light-text p-2 rounded-lg">
              <div 
                class="w-full h-full bg-dark-bg opacity-80"
                :style="{
                  backgroundImage: 'linear-gradient(135deg, #000 25%, transparent 25%), linear-gradient(225deg, #000 25%, transparent 25%), linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(315deg, #000 25%, transparent 25%)',
                  backgroundPosition: '10px 0, 10px 0, 0 0, 0 0',
                  backgroundSize: '10px 10px',
                  backgroundRepeat: 'repeat'
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="text-muted-text mb-4">
          <i class="fa-solid fa-ticket text-4xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-light-text mb-2">Aucune réservation</h3>
        <p class="text-muted-text" v-if="bookingsStore.error">
          {{ bookingsStore.error }}
        </p>
        <p class="text-muted-text" v-else>
          Vous n'avez pas encore effectué de réservation.
        </p>
        <router-link 
          to="/"
          class="mt-4 inline-block px-4 py-2 bg-primary-accent hover:bg-primary-hover text-light-text rounded-lg transition-colors"
        >
          Voir les films
        </router-link>
      </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { useBookingsStore } from '@/stores/bookings.store'
import { useMoviesStore } from '@/stores/movies.store'

const router = useRouter()
const bookingsStore = useBookingsStore()
const moviesStore = useMoviesStore()

onMounted(async () => {
  await Promise.all([
    bookingsStore.fetchUserBookings(),
    moviesStore.fetchMovies() // Nécessaire pour obtenir les détails des films
  ])
})

const getMovieTitle = (movieId) => {
  if (!movieId) return 'Film inconnu';
  const movie = moviesStore.movies.find(m => m.id === movieId)
  return movie?.title || 'Titre non trouvé'
}

const getMovieImage = (movieId) => {
    if (!movieId) return 'https://via.placeholder.com/100x150';
    const movie = moviesStore.movies.find(m => m.id === movieId);
    // Préfixer avec le chemin public si l'image n'est pas une URL complète
    const posterPath = movie?.posterPath?.startsWith('http') ? movie.posterPath : `/${movie?.posterPath}`;
    return movie?.posterPath ? posterPath : 'https://via.placeholder.com/100x150';
}

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'Date inconnue'
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTimeString).toLocaleDateString('fr-FR', options);
}

const viewDetails = (booking) => {
  // TODO: Implement details view
  alert('Détails de la réservation: ' + booking.id)
}

const handleCancelBooking = async (bookingId) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
    try {
      await bookingsStore.cancelBooking(bookingId)
      // Le store rafraîchit déjà la liste, pas besoin d'action supplémentaire ici
    } catch (error) {
      alert('Erreur lors de l\'annulation: ' + (error.response?.data?.message || error.message))
    }
  }
}
</script>
