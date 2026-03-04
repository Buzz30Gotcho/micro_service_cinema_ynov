<template>
  <aside :class="asideClasses">
    <!-- Logo Area -->
    <div class="p-6 flex items-center justify-between md:justify-start gap-3 border-b border-slate-700">
      <router-link to="/admin/dashboard" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-cinema-accent to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cinema-accent/30">
          <i class="fa-solid fa-film"></i>
        </div>
        <h1 class="text-xl font-bold tracking-tight text-slate-100">CENTRAL CINEMA</h1>
      </router-link>
      
      <!-- Mobile Menu Button -->
      <button @click="$emit('close')" class="md:hidden text-slate-400 hover:text-white" aria-label="Fermer le menu">
        <i class="fa-solid fa-xmark text-xl"></i>
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
            @click="handleNavClick"
            active-class="bg-cinema-accent/10 text-cinema-accent border-r-2 border-cinema-accent"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-l-md transition-all text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <i class="fa-solid fa-chart-pie w-6 text-center mr-2 transition-colors"></i>
            Dashboard
          </router-link>

          <router-link 
            to="/admin/movies"
            @click="handleNavClick"
            active-class="bg-cinema-accent/10 text-cinema-accent border-r-2 border-cinema-accent"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-l-md transition-all text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <i class="fa-solid fa-clapperboard w-6 text-center mr-2 transition-colors"></i>
            Gestion Films
          </router-link>

          <router-link 
            to="/admin/sessions"
            @click="handleNavClick"
            active-class="bg-cinema-accent/10 text-cinema-accent border-r-2 border-cinema-accent"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-l-md transition-all text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <i class="fa-solid fa-calendar-days w-6 text-center mr-2 transition-colors"></i>
            Gestion Séances
          </router-link>

          <router-link 
            to="/admin/users"
            @click="handleNavClick"
            active-class="bg-cinema-accent/10 text-cinema-accent border-r-2 border-cinema-accent"
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
            @click="handleNavClick"
            active-class="bg-cinema-accent/10 text-cinema-accent border-r-2 border-cinema-accent"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-l-md transition-all text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <i class="fa-solid fa-ticket w-6 text-center mr-2 transition-colors"></i>
            Réserver un billet
          </router-link>

          <router-link 
            to="/client/my-bookings"
            @click="handleNavClick"
            active-class="bg-cinema-accent/10 text-cinema-accent border-r-2 border-cinema-accent"
            class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-l-md transition-all text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
          >
            <i class="fa-solid fa-receipt w-6 text-center mr-2 transition-colors"></i>
            Mes Réservations
          </router-link>
        </div>
      </template>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const props = defineProps({
  isMobileOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const router = useRouter()
const authStore = useAuthStore()

const asideClasses = computed(() => [
  'bg-cinema-darkAlt border-r border-slate-700 flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out',
  'fixed inset-y-0 left-0 z-50 w-72 md:static md:translate-x-0 md:z-auto md:w-64',
  props.isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
])

const currentView = computed(() => {
  return router.currentRoute.value.path.startsWith('/admin') ? 'admin' : 'client'
})

const handleNavClick = () => {
  emit('close')
}
</script>
