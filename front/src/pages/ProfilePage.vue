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

              </div>
            </div>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-400">Membre depuis</span>
                <span class="font-semibold">{{ user.memberSince }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Réservations</span>
                <span class="font-semibold">{{ bookings.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Points fidélité</span>
                <span class="font-semibold text-yellow-400">{{ user.points }} pts</span>
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
                  <div class="font-semibold">{{ user.moviesWatched }}</div>
                  <div class="text-slate-400 text-xs">Films vus</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-2xl">⭐</span>
                <div>
                  <div class="font-semibold">{{ user.favoriteGenre }}</div>
                  <div class="text-slate-400 text-xs">Genre préféré</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Loading State -->
          <div v-if="bookingsLoading" class="text-center py-12 text-slate-400">
            <i class="fa-solid fa-spinner animate-spin text-2xl"></i>
            <p>Chargement des réservations...</p>
          </div>

          <!-- Tabs -->
          <div v-else class="bg-slate-900 border border-slate-800 rounded-xl p-1 flex text-sm font-medium">
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
          <div v-if="!bookingsLoading && activeTab === 'upcoming'" class="space-y-4">
            <div
              v-for="booking in upcomingBookings"
              :key="booking.id"
              class="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition"
            >
              <div class="flex gap-6">
                <div class="flex-1">
                  <h3 class="text-xl font-bold mb-2">{{ getMovieTitle(booking.seance.movieId, booking.seance) }}</h3>
                  
                  <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span class="text-slate-400">Date</span>
                      <div class="font-semibold">{{ formatDateTime(booking.seance.dateTime).date }}</div>
                    </div>
                    <div>
                      <span class="text-slate-400">Heure</span>
                      <div class="font-semibold">{{ formatDateTime(booking.seance.dateTime).time }}</div>
                    </div>
                    <div>
                      <span class="text-slate-400">Salle</span>
                      <div class="font-semibold">Salle {{ booking.seance.room }}</div>
                    </div>
                    <div>
                      <span class="text-slate-400">Place</span>
                      <div class="font-semibold">{{ booking.seatNumber }}</div>
                    </div>
                  </div>

                  <div class="flex items-center justify-end">
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
          <div v-if="!bookingsLoading && activeTab === 'past'" class="space-y-4">
            <div
              v-for="booking in pastBookings"
              :key="booking.id"
              class="bg-slate-900 border border-slate-800 rounded-xl p-6 opacity-75"
            >
              <div class="flex gap-6">
                <div class="flex-1">
                  <h3 class="text-xl font-bold mb-2">{{ getMovieTitle(booking.seance.movieId, booking.seance) }}</h3>
                  
                  <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span class="text-slate-400">Date</span>
                      <div class="font-semibold">{{ formatDateTime(booking.seance.dateTime).date }}</div>
                    </div>
                    <div>
                      <span class="text-slate-400">Heure</span>
                      <div class="font-semibold">{{ formatDateTime(booking.seance.dateTime).time }}</div>
                    </div>
                    <div>
                      <span class="text-slate-400">Salle</span>
                      <div class="font-semibold">Salle {{ booking.seance.room }}</div>
                    </div>
                    <div>
                      <span class="text-slate-400">Place</span>
                      <div class="font-semibold">{{ booking.seatNumber }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
             <div v-if="pastBookings.length === 0" class="text-center py-12 text-slate-400">
              <div class="text-6xl mb-4">📜</div>
              <p>Aucune réservation passée</p>
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
import { useMoviesStore } from '@/stores/movies.store'
import { storeToRefs } from 'pinia'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import Toast from '@/components/common/Toast.vue'

const authStore = useAuthStore()
const bookingsStore = useBookingsStore()
const moviesStore = useMoviesStore()

// Reactive state from stores
const { userBookings: bookings, loading: bookingsLoading, error: bookingsError } = storeToRefs(bookingsStore)
const { movies, loading: moviesLoading } = storeToRefs(moviesStore)

// Fetch data on component mount
onMounted(() => {
  bookingsStore.fetchUserBookings();
  if (movies.value.length === 0) {
    moviesStore.fetchMovies();
  }
});


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
  memberSince: authStore.currentUser?.memberSince || 'Janvier 2024',
  points: authStore.currentUser?.points || 450,
  moviesWatched: authStore.currentUser?.moviesWatched || 24,
  favoriteGenre: authStore.currentUser?.favoriteGenre || 'Science-Fiction',
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

// Computed properties for filtering real bookings
const upcomingBookings = computed(() => {
  const now = new Date();
  return bookings.value.filter(b => b.seance && new Date(b.seance.dateTime) >= now);
});

const pastBookings = computed(() => {
  const now = new Date();
  return bookings.value.filter(b => b.seance && new Date(b.seance.dateTime) < now);
});

const getMovieTitle = (movieId, seance) => {
  if ((!movies.value || movies.value.length === 0) && seance?.nameMovie) return seance.nameMovie;
  if (!movies.value || movies.value.length === 0) return 'Chargement...';
  const movie = movies.value.find(m => String(m.id) === movieId);
  if (movie) return movie.title;
  return seance?.nameMovie || 'Film inconnu';
};

// Helper to format date and time
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return { date: 'N/A', time: 'N/A' };
  const dateObj = new Date(dateTimeString);
  return {
    date: dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
    time: dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  };
};

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
  alert(`📥 Le téléchargement du billet pour ${getMovieTitle(booking.seance.movieId, booking.seance)} n'est pas encore implémenté.`)
}

const cancelBooking = async (booking) => {
  if (confirm(`Voulez-vous vraiment annuler la réservation pour "${getMovieTitle(booking.seance.movieId, booking.seance)}" ?`)) {
    try {
      await bookingsStore.cancelBooking(booking.id);
      showToast('Succès', 'Réservation annulée avec succès.');
    } catch (error) {
      showToast('Erreur', 'L\'annulation de la réservation a échoué.', 'error');
    }
  }
}
</script>
