<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <Header />
    
    <main class="flex-1 px-6 md:px-12 py-8">
      <div class="max-w-7xl mx-auto space-y-6">
        <h2 class="text-2xl font-bold text-white">Mes Réservations</h2>

      <!-- Loading State -->
      <div v-if="bookingsStore.loading" class="flex justify-center py-12">
        <div class="text-slate-400">
          <i class="fa-solid fa-spinner animate-spin text-2xl"></i>
          <p class="mt-2">Chargement...</p>
        </div>
      </div>

      <!-- Bookings List -->
      <div v-else-if="bookingsStore.userBookings.length > 0" class="space-y-6">
        <div 
          v-for="booking in bookingsStore.userBookings" 
          :key="booking.id"
          class="bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col md:flex-row gap-6 items-start"
        >
          <!-- Movie Poster -->
          <div class="w-full md:w-32 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
            <img :src="getMovieImage(booking.movieId)" class="w-full h-full object-cover">
          </div>

          <!-- Booking Details -->
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-bold text-white">{{ getMovieTitle(booking.movieId) }}</h3>
                <p class="text-slate-400 text-sm mt-1">
                  {{ booking.room }} • {{ booking.dateTime }}
                </p>
              </div>
              <span 
                class="px-3 py-1 text-xs rounded-full border"
                :class="booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'"
              >
                {{ booking.status === 'confirmed' ? 'Confirmé' : 'En attente' }}
              </span>
            </div>

            <!-- Booking Info -->
            <div class="mt-6 grid grid-cols-2 gap-4 max-w-sm">
              <div class="bg-slate-900 p-3 rounded border border-slate-700">
                <p class="text-xs text-slate-500 uppercase">Places</p>
                <p class="text-white font-mono">{{ booking.seats?.join(', ') || 'N/A' }}</p>
              </div>
              <div class="bg-slate-900 p-3 rounded border border-slate-700">
                <p class="text-xs text-slate-500 uppercase">Référence</p>
                <p class="text-white font-mono">#{{ booking.id }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex gap-2">
              <button 
                @click="viewDetails(booking)"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
              >
                Détails
              </button>
              <button 
                @click="cancelBooking(booking.id)"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>

          <!-- QR Code -->
          <div class="flex-shrink-0 self-center">
            <div class="w-24 h-24 bg-white p-2 rounded-lg">
              <div 
                class="w-full h-full bg-black opacity-80"
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
        <div class="text-slate-400 mb-4">
          <i class="fa-solid fa-ticket text-4xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">Aucune réservation</h3>
        <p class="text-slate-400">Vous n'avez pas encore effectué de réservation.</p>
        <router-link 
          to="/client/booking"
          class="mt-4 inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          Réserver maintenant
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
    moviesStore.fetchMovies()
  ])
})

const getMovieTitle = (movieId) => {
  const movie = moviesStore.getMovieById(movieId)
  return movie?.title || 'Film inconnu'
}

const getMovieImage = (movieId) => {
  const movie = moviesStore.getMovieById(movieId)
  return movie?.image || 'https://via.placeholder.com/100x150'
}

const viewDetails = (booking) => {
  // TODO: Implement details view
  alert('Détails de la réservation: ' + booking.id)
}

const cancelBooking = async (bookingId) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
    try {
      await bookingsStore.cancelBooking(bookingId)
      alert('Réservation annulée')
    } catch (error) {
      alert('Erreur: ' + error.message)
    }
  }
}
</script>
