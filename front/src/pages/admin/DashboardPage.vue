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

      <!-- ============================================================ -->
      <!--  DEVOPS — Microservices Health & Control Panel                -->
      <!-- ============================================================ -->
      <div class="mb-10">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-2xl font-bold text-white flex items-center gap-3">
              <i class="fa-solid fa-server text-cyan-400"></i>
              DevOps — Microservices
            </h3>
            <p class="text-slate-400 text-sm mt-1">Surveillez et contrôlez l'état des microservices en temps réel.</p>
          </div>
          <button @click="refreshAllServices" class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <i class="fa-solid fa-arrows-rotate" :class="{ 'animate-spin': refreshing }"></i>
            Tout rafraîchir
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Service Card: Catalog -->
          <div class="bg-cinema-darkAlt rounded-xl border border-cinema-dark p-6 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <i class="fa-solid fa-clapperboard text-blue-400"></i>
                </div>
                <div>
                  <h4 class="font-bold text-white">Catalog</h4>
                  <p class="text-xs text-slate-400">PHP natif · Port 4001</p>
                </div>
              </div>
              <span :class="statusBadgeClass(dashboardStore.services.catalog)" class="px-2 py-1 rounded-full text-xs font-bold">
                {{ statusLabel(dashboardStore.services.catalog) }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-slate-400">Santé :</span>
              <span :class="healthBadgeClass(dashboardStore.services.catalog)">
                <i :class="healthIcon(dashboardStore.services.catalog)" class="mr-1"></i>
                {{ healthLabel(dashboardStore.services.catalog) }}
              </span>
            </div>
            <div class="flex gap-2 pt-2 border-t border-slate-700">
              <button @click="checkHealth('catalog')" :disabled="dashboardStore.services.catalog.loading" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                <i class="fa-solid fa-heart-pulse mr-1"></i> Health
              </button>
              <button @click="startSvc('catalog')" :disabled="dashboardStore.services.catalog.loading" class="flex-1 bg-green-600/80 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                <i class="fa-solid fa-play mr-1"></i> Start
              </button>
              <button @click="stopSvc('catalog')" :disabled="dashboardStore.services.catalog.loading" class="flex-1 bg-red-600/80 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                <i class="fa-solid fa-stop mr-1"></i> Stop
              </button>
            </div>
          </div>

          <!-- Service Card: Auth -->
          <div class="bg-cinema-darkAlt rounded-xl border border-cinema-dark p-6 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <i class="fa-solid fa-shield-halved text-purple-400"></i>
                </div>
                <div>
                  <h4 class="font-bold text-white">Auth</h4>
                  <p class="text-xs text-slate-400">Python Flask · Port 4002</p>
                </div>
              </div>
              <span :class="statusBadgeClass(dashboardStore.services.auth)" class="px-2 py-1 rounded-full text-xs font-bold">
                {{ statusLabel(dashboardStore.services.auth) }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-slate-400">Santé :</span>
              <span :class="healthBadgeClass(dashboardStore.services.auth)">
                <i :class="healthIcon(dashboardStore.services.auth)" class="mr-1"></i>
                {{ healthLabel(dashboardStore.services.auth) }}
              </span>
            </div>
            <div class="flex gap-2 pt-2 border-t border-slate-700">
              <button @click="checkHealth('auth')" :disabled="dashboardStore.services.auth.loading" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                <i class="fa-solid fa-heart-pulse mr-1"></i> Health
              </button>
              <button @click="startSvc('auth')" :disabled="dashboardStore.services.auth.loading" class="flex-1 bg-green-600/80 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                <i class="fa-solid fa-play mr-1"></i> Start
              </button>
              <button @click="stopSvc('auth')" :disabled="dashboardStore.services.auth.loading" class="flex-1 bg-red-600/80 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                <i class="fa-solid fa-stop mr-1"></i> Stop
              </button>
            </div>
          </div>

          <!-- Service Card: Booking -->
          <div class="bg-cinema-darkAlt rounded-xl border border-cinema-dark p-6 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <i class="fa-solid fa-ticket text-orange-400"></i>
                </div>
                <div>
                  <h4 class="font-bold text-white">Booking</h4>
                  <p class="text-xs text-slate-400">NestJS · Port 4003</p>
                </div>
              </div>
              <span :class="statusBadgeClass(dashboardStore.services.booking)" class="px-2 py-1 rounded-full text-xs font-bold">
                {{ statusLabel(dashboardStore.services.booking) }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-slate-400">Santé :</span>
              <span :class="healthBadgeClass(dashboardStore.services.booking)">
                <i :class="healthIcon(dashboardStore.services.booking)" class="mr-1"></i>
                {{ healthLabel(dashboardStore.services.booking) }}
              </span>
            </div>
            <div class="flex gap-2 pt-2 border-t border-slate-700">
              <button @click="checkHealth('booking')" :disabled="dashboardStore.services.booking.loading" class="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                <i class="fa-solid fa-heart-pulse mr-1"></i> Health
              </button>
              <button @click="startSvc('booking')" :disabled="dashboardStore.services.booking.loading" class="flex-1 bg-green-600/80 hover:bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                <i class="fa-solid fa-play mr-1"></i> Start
              </button>
              <button @click="stopSvc('booking')" :disabled="dashboardStore.services.booking.loading" class="flex-1 bg-red-600/80 hover:bg-red-500 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                <i class="fa-solid fa-stop mr-1"></i> Stop
              </button>
            </div>
          </div>
        </div>
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
                    <p class="font-medium text-slate-200">{{ session.nameMovie || session.movieId }}</p>
                    <p class="text-xs text-slate-400">Salle {{ session.room }}</p>
                  </td>
                  <td class="px-5 py-3 text-right">
                    <p class="font-medium text-slate-200">{{ session.date }}</p>
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
import { onMounted, computed, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useMoviesStore } from '@/stores/movies.store'
import { useUsersStore } from '@/stores/users.store'
import { useSessionsStore } from '@/stores/sessions.store'
import { useDashboardStore } from '@/stores/dashboard.store'

const moviesStore = useMoviesStore()
const usersStore = useUsersStore()
const sessionsStore = useSessionsStore()
const dashboardStore = useDashboardStore()

const refreshing = ref(false)

// Fetch all necessary data on component mount
onMounted(() => {
  if (moviesStore.movies.length === 0) moviesStore.fetchMovies()
  if (usersStore.users.length === 0) usersStore.fetchUsers()
  if (sessionsStore.sessions.length === 0) sessionsStore.fetchAllSessions()
  // Load microservices status
  dashboardStore.fetchAll()
})

const recentUsers = computed(() => {
  return [...(usersStore.users || [])].sort((a, b) => b.id - a.id).slice(0, 5)
})

const upcomingSessions = computed(() => {
    return [...(sessionsStore.sessions || [])].slice(0, 5)
})

// --- DevOps actions ---
const refreshAllServices = async () => {
  refreshing.value = true
  await dashboardStore.fetchAll()
  refreshing.value = false
}

const checkHealth = (key) => {
  dashboardStore.fetchServiceStatus(key)
  dashboardStore.fetchServiceHealth(key)
}

const startSvc = async (key) => {
  try {
    await dashboardStore.startService(key)
  } catch (e) {
    alert(`Erreur au démarrage de ${key}: ${e.message}`)
  }
}

const stopSvc = async (key) => {
  if (!confirm(`Arrêter le service ${key} ?`)) return
  try {
    await dashboardStore.stopService(key)
  } catch (e) {
    alert(`Erreur à l'arrêt de ${key}: ${e.message}`)
  }
}

// --- Status / Health display helpers ---
const statusLabel = (svc) => {
  if (svc.loading) return '...'
  const s = svc.status
  if (s === 'running') return 'Running'
  if (s === 'exited' || s === 'dead') return 'Arrêté'
  if (s === 'error') return 'Erreur'
  return 'Inconnu'
}

const statusBadgeClass = (svc) => {
  const s = svc.status
  if (s === 'running') return 'bg-green-500/20 text-green-400'
  if (s === 'exited' || s === 'dead') return 'bg-red-500/20 text-red-400'
  return 'bg-slate-500/20 text-slate-400'
}

const healthLabel = (svc) => {
  if (svc.loading) return 'Vérification...'
  if (svc.health === 'healthy') return 'OK'
  if (svc.health === 'unhealthy') return 'Down'
  return 'Non vérifié'
}

const healthBadgeClass = (svc) => {
  if (svc.health === 'healthy') return 'text-green-400'
  if (svc.health === 'unhealthy') return 'text-red-400'
  return 'text-slate-500'
}

const healthIcon = (svc) => {
  if (svc.health === 'healthy') return 'fa-solid fa-circle-check'
  if (svc.health === 'unhealthy') return 'fa-solid fa-circle-xmark'
  return 'fa-solid fa-circle-question'
}
</script>