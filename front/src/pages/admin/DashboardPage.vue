<template>
  <app-layout>
    <div class="space-y-8">
      <!-- 1. Welcome Header -->
      <div>
        <h2 class="text-2xl font-bold text-white">Bienvenue, {{ authStore.currentUser?.first_name || 'Admin' }} !</h2>
        <p class="text-slate-400 text-sm mt-1">Voici un aperçu de l'activité de votre cinéma.</p>
      </div>

      <!-- 2. Clickable Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <router-link to="/admin/movies" class="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:bg-slate-700/50 hover:border-slate-600 transition-all transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <h3 class="text-slate-300 text-sm font-medium">Films</h3>
            <div class="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <i class="fa-solid fa-film"></i>
            </div>
          </div>
          <p class="text-3xl font-bold text-slate-100 mt-2">{{ moviesStore.movies.length }}</p>
        </router-link>
        <router-link to="/admin/sessions" class="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:bg-slate-700/50 hover:border-slate-600 transition-all transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <h3 class="text-slate-300 text-sm font-medium">Séances</h3>
            <div class="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <i class="fa-solid fa-calendar"></i>
            </div>
          </div>
          <p class="text-3xl font-bold text-slate-100 mt-2">{{ sessionsStore.sessions.length }}</p>
        </router-link>
        <router-link to="/admin/users" class="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:bg-slate-700/50 hover:border-slate-600 transition-all transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <h3 class="text-slate-300 text-sm font-medium">Utilisateurs</h3>
            <div class="p-2 bg-orange-500/10 rounded-lg text-orange-400">
              <i class="fa-solid fa-users"></i>
            </div>
          </div>
          <p class="text-3xl font-bold text-slate-100 mt-2">{{ usersStore.users.length }}</p>
        </router-link>
      </div>

      <!-- 3. Quick Actions Panel -->
      <div>
        <h3 class="text-lg font-semibold text-white mb-4">Actions Rapides</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <router-link to="/admin/movies" class="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:bg-slate-700/50 hover:border-slate-600 transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center text-slate-300 font-medium text-center">
            <i class="fa-solid fa-clapperboard text-xl mb-2"></i>
            <span>Gérer les Films</span>
          </router-link>
          <router-link to="/admin/sessions" class="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:bg-slate-700/50 hover:border-slate-600 transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center text-slate-300 font-medium text-center">
            <i class="fa-solid fa-calendar-days text-xl mb-2"></i>
            <span>Gérer les Séances</span>
          </router-link>
          <router-link to="/admin/users" class="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:bg-slate-700/50 hover:border-slate-600 transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center text-slate-300 font-medium text-center">
            <i class="fa-solid fa-users-cog text-xl mb-2"></i>
            <span>Gérer les Utilisateurs</span>
          </router-link>
           <button @click="goToUsersAndCreate" class="bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 rounded-xl p-6 shadow-lg transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center font-medium text-center">
            <i class="fa-solid fa-user-plus text-xl mb-2"></i>
            <span>Créer un Utilisateur</span>
          </button>
        </div>
      </div>

      <!-- 4. Data-Dense Panels -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Users -->
        <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div class="p-5 border-b border-slate-700 flex justify-between items-center">
            <h3 class="font-semibold text-slate-100">Derniers Utilisateurs Inscrits</h3>
            <router-link to="/admin/users" class="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Voir tout
            </router-link>
          </div>
          <div class="p-0">
             <table class="w-full text-left text-sm">
              <tbody class="divide-y divide-slate-700">
                <tr v-for="user in recentUsers" :key="user.id" class="hover:bg-slate-700/30 transition-colors">
                  <td class="px-5 py-3">
                    <p class="font-medium text-slate-200">{{ user.first_name }} {{ user.last_name }}</p>
                    <p class="text-xs text-slate-400">{{ user.email }}</p>
                  </td>
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
                    <td colspan="2" class="text-center py-6 text-slate-400">Aucun utilisateur.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Upcoming Sessions -->
        <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div class="p-5 border-b border-slate-700 flex justify-between items-center">
            <h3 class="font-semibold text-slate-100">Séances à venir</h3>
            <router-link to="/admin/sessions" class="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Voir tout
            </router-link>
          </div>
          <div class="p-0">
            <table class="w-full text-left text-sm">
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
  if (sessionsStore.sessions.length === 0) sessionsStore.fetchSessions()
})

// Computed property for recent users (e.g., last 5)
const recentUsers = computed(() => {
  return [...usersStore.users].sort((a, b) => b.id - a.id).slice(0, 5)
})

// Computed property for upcoming sessions
const upcomingSessions = computed(() => {
    return [...sessionsStore.sessions]
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

// Special navigation function for create button
const goToUsersAndCreate = () => {
    // This is a placeholder for now. A better implementation would
    // use a global event bus or a query param to trigger the modal
    // automatically on the users page.
    router.push('/admin/users');
}
</script>
