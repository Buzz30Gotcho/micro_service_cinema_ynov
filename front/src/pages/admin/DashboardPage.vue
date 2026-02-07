<template>
  <app-layout>
    <div class="space-y-10 p-4 md:p-8 bg-cinema-dark text-slate-100 min-h-screen">
      <!-- Welcome Header -->
      <div class="mb-10">
        <h2 class="text-4xl font-extrabold text-slate-50 leading-tight">Tableau de Bord Administratif</h2>
        <p class="text-slate-400 text-lg mt-3">Gérez efficacement les opérations de CENTRAL CINEMA.</p>
      </div>

      <!-- Core Metrics Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <!-- Metric Card: Films -->
        <router-link to="/admin/movies" class="group bg-cinema-darkAlt rounded-xl p-6 border border-cinema-dark hover:border-cinema-accent transition-all duration-200 transform hover:-translate-y-1 shadow-lg flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <i class="fa-solid fa-film text-3xl text-cinema-accent group-hover:text-cinema-accentLight transition-colors"></i>
            <h3 class="text-slate-300 text-sm font-semibold uppercase tracking-wider">Films</h3>
          </div>
          <p class="text-5xl font-extrabold text-white">{{ moviesStore.movies.length }}</p>
          <p class="text-sm text-slate-500 mt-1">Films enregistrés</p>
        </router-link>

        <!-- Metric Card: Séances -->
        <router-link to="/admin/sessions" class="group bg-cinema-darkAlt rounded-xl p-6 border border-cinema-dark hover:border-purple-400 transition-all duration-200 transform hover:-translate-y-1 shadow-lg flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <i class="fa-solid fa-calendar-alt text-3xl text-purple-400 group-hover:text-purple-300 transition-colors"></i>
            <h3 class="text-slate-300 text-sm font-semibold uppercase tracking-wider">Séances</h3>
          </div>
          <p class="text-5xl font-extrabold text-white">{{ sessionsStore.sessions.length }}</p>
          <p class="text-sm text-slate-500 mt-1">Séances programmées</p>
        </router-link>

        <!-- Metric Card: Utilisateurs -->
        <router-link to="/admin/users" class="group bg-cinema-darkAlt rounded-xl p-6 border border-cinema-dark hover:border-orange-400 transition-all duration-200 transform hover:-translate-y-1 shadow-lg flex flex-col justify-between">
          <div class="flex items-center justify-between mb-4">
            <i class="fa-solid fa-users text-3xl text-orange-400 group-hover:text-orange-300 transition-colors"></i>
            <h3 class="text-slate-300 text-sm font-semibold uppercase tracking-wider">Utilisateurs</h3>
          </div>
          <p class="text-5xl font-extrabold text-white">{{ usersStore.users.length }}</p>
          <p class="text-sm text-slate-500 mt-1">Comptes enregistrés</p>
        </router-link>
      </div>

      <!-- Recent Activity Panels -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Users Panel -->
        <div class="bg-cinema-darkAlt rounded-xl border border-cinema-dark overflow-hidden shadow-lg">
          <div class="p-5 border-b border-cinema-dark flex justify-between items-center">
            <h3 class="font-semibold text-slate-100 text-lg">Derniers Utilisateurs Inscrits</h3>
            <router-link to="/admin/users" class="text-sm text-cinema-accent hover:text-cinema-accentLight transition-colors flex items-center gap-1">
              Voir tout <i class="fa-solid fa-arrow-right-long text-xs"></i>
            </router-link>
          </div>
          <div class="p-0">
             <table class="w-full text-left text-sm">
              <thead class="bg-cinema-dark text-xs text-slate-400 uppercase font-medium border-b border-cinema-dark">
                <tr>
                  <th class="px-5 py-3">Nom Complet</th>
                  <th class="px-5 py-3">Email</th>
                  <th class="px-5 py-3 text-right">Rôle</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
                <tr v-for="user in recentUsers" :key="user.id" class="hover:bg-slate-700/30 transition-colors">
                  <td class="px-5 py-3">
                    <p class="font-medium text-slate-200">{{ user.first_name }} {{ user.last_name }}</p>
                  </td>
                  <td class="px-5 py-3 text-xs text-slate-400">{{ user.email }}</td>
                  <td class="px-5 py-3 text-right">
                     <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-sky-500/20 text-sky-300'"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                </tr>
                 <tr v-if="usersStore.users.length === 0">
                    <td colspan="3" class="text-center py-6 text-slate-400">Aucun utilisateur récent.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Upcoming Sessions Panel -->
        <div class="bg-cinema-darkAlt rounded-xl border border-cinema-dark overflow-hidden shadow-lg">
          <div class="p-5 border-b border-cinema-dark flex justify-between items-center">
            <h3 class="font-semibold text-slate-100 text-lg">Prochaines Séances</h3>
            <router-link to="/admin/sessions" class="text-sm text-cinema-accent hover:text-cinema-accentLight transition-colors flex items-center gap-1">
              Voir tout <i class="fa-solid fa-arrow-right-long text-xs"></i>
            </router-link>
          </div>
          <div class="p-0">
            <table class="w-full text-left text-sm">
              <thead class="bg-cinema-dark text-xs text-slate-400 uppercase font-medium border-b border-cinema-dark">
                <tr>
                  <th class="px-5 py-3">Film / Salle</th>
                  <th class="px-5 py-3 text-right">Date / Heure</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
                <tr v-for="session in upcomingSessions" :key="session.id" class="hover:bg-slate-700/30 transition-colors">
                  <td class="px-5 py-3">
                    <p class="font-medium text-slate-200">{{ getMovieTitle(session.movieId) }}</p>
                    <p class="text-xs text-slate-400">{{ session.room }}</p>
                  </td>
                  <td class="px-5 py-3 text-right">
                    <p class="font-medium text-slate-200">{{ formatDate(session.date) }}</p>
                    <p class="text-xs text-slate-400">{{ session.time }}</p>
                  </td>
                </tr>
                <tr v-if="sessionsStore.sessions.length === 0">
                    <td colspan="2" class="text-center py-6 text-slate-400">Aucune séance programmée.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useMoviesStore } from '@/stores/movies.store'
import { useUsersStore } from '@/stores/users.store'
import { useSessionsStore } from '@/stores/sessions.store'

const router = useRouter()
const authStore = useAuthStore()
const moviesStore = useMoviesStore()
const usersStore = useUsersStore()
const sessionsStore = useSessionsStore()

// Fetch all necessary data on component mount
onMounted(() => {
  if (moviesStore.movies.length === 0) moviesStore.fetchMovies()
  if (usersStore.users.length === 0) usersStore.fetchUsers()
  if (sessionsStore.sessions.length === 0) sessionsStore.fetchAllSessions()
})

// Computed property for recent users (e.g., last 5)
const recentUsers = computed(() => {
  return [...(usersStore.users || [])].sort((a, b) => b.id - a.id).slice(0, 5)
})

// Computed property for upcoming sessions
const upcomingSessions = computed(() => {
    return [...(sessionsStore.sessions || [])]
        .filter(s => new Date(s.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5)
})

const getMovieTitle = (movieId) => {
  const movie = moviesStore.movies.find(m => m.id === movieId)
  return movie?.title || '...'
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

</script>