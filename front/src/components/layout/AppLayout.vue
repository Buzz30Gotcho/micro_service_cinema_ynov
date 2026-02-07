<template>
  <div class="flex flex-col md:flex-row min-h-screen w-full bg-cinema-dark">
    <sidebar />
    
    <!-- Main Content Area -->
    <main class="flex-1 bg-cinema-dark flex flex-col min-w-0 overflow-hidden">
      <!-- Top Header (Mobile only) -->
      <header class="md:hidden bg-cinema-darkAlt border-b border-slate-700 p-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-100">CENTRAL CINEMA</h2>
      </header>

      <!-- NEW Global Header for all views -->
      <header class="hidden md:flex justify-between items-center p-4 md:px-8 bg-cinema-darkAlt border-b border-slate-700">
        <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold text-slate-100">Bonjour, <span class="text-cinema-accentLight">{{ authStore.currentUser?.first_name || 'utilisateur' }}</span>!</h1>
        </div>
        <button @click="logout" class="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors px-3 py-2 rounded-md border border-transparent hover:border-red-400" title="Déconnexion">
            <i class="fa-solid fa-right-from-bracket text-lg"></i>
            <span class="text-sm font-medium hidden lg:block">Déconnexion</span>
        </button>
      </header>

      <!-- Content Scroll Area -->
      <div class="flex-1 overflow-y-auto p-4 md:p-8">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router' // Import useRouter
import Sidebar from './Sidebar.vue'
import { useAuthStore } from '@/stores/auth.store' // Import useAuthStore

const router = useRouter()
const authStore = useAuthStore() // Initialize authStore

const logout = async () => {
  await authStore.logout(router)
}
</script>