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
          <!-- Booking Details -->
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-bold text-white">{{ booking.name || 'Réservation' }}</h3>
                <p class="text-slate-400 text-sm mt-1">
                  {{ booking.seance?.salleId || 'N/A' }} • {{ booking.seance?.dateSeance || '' }} {{ booking.seance?.hourStart || '' }}
                </p>
              </div>
              <span 
                class="px-3 py-1 text-xs rounded-full border bg-green-500/10 text-green-400 border-green-500/20"
              >
                Confirmé
              </span>
            </div>

            <!-- Booking Info -->
            <div class="mt-6 grid grid-cols-2 gap-4 max-w-sm">
              <div class="bg-slate-900 p-3 rounded border border-slate-700">
                <p class="text-xs text-slate-500 uppercase">Places</p>
                <p class="text-white font-mono">{{ booking.seatNumber || 'N/A' }}</p>
              </div>
              <div class="bg-slate-900 p-3 rounded border border-slate-700">
                <p class="text-xs text-slate-500 uppercase">Référence</p>
                <p class="text-white font-mono text-xs">#{{ booking.id?.substring(0, 8) || booking.id }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex gap-2">
              <button 
                @click="cancelBooking(booking.id)"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                Annuler
              </button>
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
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { useBookingsStore } from '@/stores/bookings.store'

const bookingsStore = useBookingsStore()

onMounted(() => {
  bookingsStore.fetchUserBookings()
})

const cancelBooking = async (bookingId) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
    try {
      await bookingsStore.cancelBooking(bookingId)
    } catch (error) {
      alert('Erreur: ' + error.message)
    }
  }
}
</script>
