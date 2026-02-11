<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <Header />

    <main class="max-w-6xl mx-auto px-6 md:px-12 py-10">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold mb-2">Mon Profil</h1>
        <p class="text-slate-400">Gérez vos informations et vos réservations</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-4">
          <!-- User card -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white">
                {{ userInitials }}
              </div>
              <div>
                <h2 class="text-xl font-bold">{{ user.name }}</h2>
                <p class="text-sm text-slate-400">{{ user.email }}</p>
              </div>
            </div>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-400">Rôle</span>
                <span class="font-semibold">{{ authStore.isAdmin ? 'Administrateur' : 'Client' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Réservations</span>
                <span class="font-semibold">{{ bookings.length }}</span>
              </div>
            </div>

            <button
              @click="showEditModal = true"
              class="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition"
            >
              Modifier le profil
            </button>
          </div>

          <!-- Quick stats -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 class="font-semibold mb-4">Statistiques</h3>
            <div class="space-y-3 text-sm">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🎬</span>
                <div>
                  <div class="font-semibold">{{ pastBookings.length }}</div>
                  <div class="text-slate-400 text-xs">Séances passées</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">🎟️</span>
                <div>
                  <div class="font-semibold">{{ upcomingBookings.length }}</div>
                  <div class="text-slate-400 text-xs">Réservations à venir</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Tabs -->
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-1 flex text-sm font-medium">
            <button
              @click="activeTab = 'upcoming'"
              :class="[
                'flex-1 py-2 rounded-lg transition',
                activeTab === 'upcoming' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              ]"
            >
              À venir ({{ upcomingBookings.length }})
            </button>
            <button
              @click="activeTab = 'past'"
              :class="[
                'flex-1 py-2 rounded-lg transition',
                activeTab === 'past' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              ]"
            >
              Passées ({{ pastBookings.length }})
            </button>
          </div>

          <!-- Upcoming bookings -->
          <div v-if="activeTab === 'upcoming'" class="space-y-4">
            <div
              v-for="booking in upcomingBookings"
              :key="booking.id"
              class="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div class="flex gap-6">
                <div
                  class="w-24 h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center font-black text-white text-center text-sm p-2"
                >
                  {{ booking.movieTitle }}
                </div>

                <div class="flex-1">
                  <h3 class="text-xl font-bold mb-2">{{ booking.movieTitle }}</h3>
                  
                  <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span class="text-slate-400">Date</span>
                      <div class="font-semibold">{{ booking.date }}</div>
                    </div>
                    <div>
                      <span class="text-slate-400">Heure</span>
                      <div class="font-semibold">{{ booking.time }}</div>
                    </div>
                    <div>
                      <span class="text-slate-400">Salle</span>
                      <div class="font-semibold">Salle {{ booking.room }}</div>
                    </div>
                    <div>
                      <span class="text-slate-400">Places</span>
                      <div class="font-semibold">{{ booking.seats }} place(s)</div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="text-2xl font-bold text-blue-400">{{ booking.total }} €</div>
                    <div class="flex gap-2">
                      <button
                        @click="downloadTicket(booking)"
                        class="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition"
                      >
                        📥 Télécharger
                      </button>
                      <button
                        @click="cancelBooking(booking)"
                        class="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg text-sm font-semibold transition"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="upcomingBookings.length === 0" class="text-center py-12 text-slate-400">
              <div class="text-6xl mb-4">🎬</div>
              <p>Aucune réservation à venir</p>
              <router-link to="/seances" class="inline-block mt-4 text-blue-400 hover:underline">
                Parcourir les séances →
              </router-link>
            </div>
          </div>

          <!-- Past bookings -->
          <div v-if="activeTab === 'past'" class="space-y-4">
            <div
              v-for="booking in pastBookings"
              :key="booking.id"
              class="bg-slate-900 border border-slate-800 rounded-xl p-6 opacity-75"
            >
              <div class="flex gap-6">
                <div
                  class="w-24 h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center font-black text-white text-center text-sm p-2"
                >
                  {{ booking.movieTitle }}
                </div>

                <div class="flex-1">
                  <h3 class="text-xl font-bold mb-2">{{ booking.movieTitle }}</h3>
                  
                  <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span class="text-slate-400">Date</span>
                      <div class="font-semibold">{{ booking.date }}</div>
                    </div>
                    <div>
                      <span class="text-slate-400">Heure</span>
                      <div class="font-semibold">{{ booking.time }}</div>
                    </div>
                    <div>
                      <span class="text-slate-400">Salle</span>
                      <div class="font-semibold">Salle {{ booking.room }}</div>
                    </div>
                    <div>
                      <span class="text-slate-400">Places</span>
                      <div class="font-semibold">{{ booking.seats }} place(s)</div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="text-2xl font-bold text-slate-500">{{ booking.total }} €</div>
                    <button
                      class="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-semibold transition"
                    >
                      ⭐ Noter le film
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <Footer />

    <!-- Edit Profile Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showEditModal = false"
    >
      <div class="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full">
        <h3 class="text-2xl font-bold mb-6">Modifier le profil</h3>

        <div class="space-y-4 mb-6">
          <div>
            <label class="text-sm text-slate-400 block mb-2">Prénom</label>
            <input
              type="text"
              v-model="editForm.firstName"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label class="text-sm text-slate-400 block mb-2">Nom</label>
            <input
              type="text"
              v-model="editForm.lastName"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label class="text-sm text-slate-400 block mb-2">Email</label>
            <input
              type="email"
              v-model="editForm.email"
              disabled
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="showEditModal = false"
            class="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition"
          >
            Annuler
          </button>
          <button
            @click="saveProfile"
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>

    <Toast 
      :visible="toast.visible"
      :title="toast.title"
      :message="toast.message"
      :type="toast.type"
      @close="toast.visible = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useBookingsStore } from '@/stores/bookings.store'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import Toast from '@/components/common/Toast.vue'

const authStore = useAuthStore()
const bookingsStore = useBookingsStore()

// Toast state
const toast = ref({
  visible: false,
  title: '',
  message: '',
  type: 'success',
});

function showToast(title, message, type = 'success') {
  toast.value = { visible: true, title, message, type };
}

// Local user state, initialized from the store
const user = ref({
  firstName: authStore.currentUser?.firstName || '',
  lastName: authStore.currentUser?.lastName || '',
  email: authStore.currentUser?.email || '',
  name: `${authStore.currentUser?.firstName || ''} ${authStore.currentUser?.lastName || ''}`.trim(),
});

// Keep the local user ref in sync with the store
watch(() => authStore.currentUser, (newUser) => {
  if (newUser) {
    user.value.firstName = newUser.firstName;
    user.value.lastName = newUser.lastName;
    user.value.email = newUser.email;
    user.value.name = `${newUser.firstName || ''} ${newUser.lastName || ''}`.trim();
  }
}, { deep: true });


const userInitials = computed(() => {
  const firstInitial = user.value.firstName ? user.value.firstName[0] : '';
  const lastInitial = user.value.lastName ? user.value.lastName[0] : '';
  return (firstInitial + lastInitial).toUpperCase();
})

// Tabs
const activeTab = ref('upcoming')

// Fetch real bookings on mount
onMounted(() => {
  bookingsStore.fetchUserBookings()
})

// Map reservations from the booking service to display format
const bookings = computed(() => {
  return (bookingsStore.bookings || []).map(b => {
    // Parse the name field which contains "MovieTitle - Date Time"
    const nameParts = (b.name || '').split(' - ')
    const movieTitle = nameParts[0] || 'Réservation'
    const dateTime = nameParts[1] || ''
    const dateParts = dateTime.split(' ')
    
    // Determine if booking is upcoming or past
    const bookingDate = b.seance?.dateSeance ? new Date(b.seance.dateSeance) : new Date()
    const isUpcoming = bookingDate >= new Date(new Date().toDateString())
    
    return {
      id: b.id,
      movieTitle: b.seance?.nameMovie || movieTitle,
      date: b.seance?.dateSeance || dateParts[0] || '',
      time: b.seance?.hourStart || dateParts[1] || '',
      room: b.seance?.salleId || 'N/A',
      seats: b.seatNumber || '1',
      total: b.seance?.price || '12.50',
      status: isUpcoming ? 'upcoming' : 'past',
    }
  })
})

const upcomingBookings = computed(() => {
  return bookings.value.filter(b => b.status === 'upcoming')
})

const pastBookings = computed(() => {
  return bookings.value.filter(b => b.status === 'past')
})

// Edit profile
const showEditModal = ref(false)
const editForm = ref({
  firstName: '',
  lastName: '',
  email: ''
})

watch(showEditModal, (newValue) => {
  if (newValue) {
    editForm.value = {
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      email: user.value.email
    }
  }
})

const saveProfile = async () => {
  try {
    const userData = {
      first_name: editForm.value.firstName,
      last_name: editForm.value.lastName,
    };
    await authStore.updateUser(userData);
    showEditModal.value = false;
    showToast('Succès', 'Votre profil a été mis à jour avec succès.');
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Veuillez réessayer.';
    console.error('Failed to update profile:', error);
    showToast('Erreur', `La mise à jour du profil a échoué: ${errorMessage}`, 'error');
  }
}

// Actions
const downloadTicket = (booking) => {
  alert(`📥 Téléchargement du billet pour ${booking.movieTitle}`)
}

const cancelBooking = async (booking) => {
  if (confirm(`Voulez-vous vraiment annuler la réservation pour "${booking.movieTitle}" ?`)) {
    try {
      await bookingsStore.cancelBooking(booking.id)
      showToast('Succès', 'Réservation annulée avec succès.')
    } catch (error) {
      showToast('Erreur', 'Erreur lors de l\'annulation.', 'error')
    }
  }
}
</script>
