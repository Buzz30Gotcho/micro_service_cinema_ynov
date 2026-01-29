<template>
  <aside class="w-full md:w-64 bg-slate-800 border-r border-slate-700 flex flex-col flex-shrink-0">
    <!-- Logo Area -->
    <div class="p-6 flex items-center justify-between md:justify-start gap-3 border-b border-slate-700">
      <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
        <i class="fa-solid fa-film"></i>
      </div>
      <h1 class="text-xl font-bold tracking-tight text-slate-100">CENTRAL CINEMA</h1>
      
      <!-- Mobile Menu Button -->
      <button class="md:hidden text-slate-400 hover:text-white">
        <i class="fa-solid fa-bars text-xl"></i>
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
      
      <!-- Admin Menu -->
      <template v-if="authStore.isAdmin && currentView === 'admin'">
        <div class="space-y-1">
          <p class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">Microservices Admin</p>
          
          <router-link 
            to="/admin/dashboard"
            active-class="bg-blue-500/10 text-blue-400 border-r-2 border-blue-400"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-l-md transition-all text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <i class="fa-solid fa-chart-pie w-6 text-center mr-2 transition-colors"></i>
            Dashboard
          </router-link>

          <router-link 
            to="/admin/movies"
            active-class="bg-blue-500/10 text-blue-400 border-r-2 border-blue-400"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-l-md transition-all text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <i class="fa-solid fa-clapperboard w-6 text-center mr-2 transition-colors"></i>
            Gestion Films
          </router-link>

          <router-link 
            to="/admin/sessions"
            active-class="bg-blue-500/10 text-blue-400 border-r-2 border-blue-400"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-l-md transition-all text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <i class="fa-solid fa-calendar-days w-6 text-center mr-2 transition-colors"></i>
            Gestion Séances
          </router-link>

          <router-link 
            to="/admin/users"
            active-class="bg-blue-500/10 text-blue-400 border-r-2 border-blue-400"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-l-md transition-all text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <i class="fa-solid fa-users w-6 text-center mr-2 transition-colors"></i>
            Utilisateurs
          </router-link>
        </div>
      </template>

      <!-- Client Menu -->
      <template v-if="authStore.isClient || (authStore.isAdmin && currentView === 'client')">
        <div class="space-y-1">
          <p class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">Espace Client</p>
          
          <router-link 
            to="/client/booking"
            active-class="bg-blue-500/10 text-blue-400 border-r-2 border-blue-400"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-l-md transition-all text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <i class="fa-solid fa-ticket w-6 text-center mr-2 transition-colors"></i>
            Réserver un billet
          </router-link>

          <router-link 
            to="/client/my-bookings"
            active-class="bg-blue-500/10 text-blue-400 border-r-2 border-blue-400"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-l-md transition-all text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <i class="fa-solid fa-receipt w-6 text-center mr-2 transition-colors"></i>
            Mes Réservations
          </router-link>
        </div>
      </template>
    </nav>

    <!-- User Profile Snippet -->
    <div v-if="authStore.currentUser" class="p-4 border-t border-slate-700">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-slate-100">
          {{ getInitials(fullName) }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-100 truncate">{{ fullName }}</p>
          <p class="text-xs text-slate-400 truncate">{{ authStore.currentUser.email }}</p>
        </div>
        <button @click="logout" class="text-slate-400 hover:text-slate-100" title="Déconnexion">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const fullName = computed(() => {
    if (!authStore.currentUser) return '';
    return `${authStore.currentUser.first_name || ''} ${authStore.currentUser.last_name || ''}`.trim();
});

const logout = async () => {
  await authStore.logout()
  router.push('/')
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}
</script>
