<template>
  <div class="flex min-h-screen w-full bg-cinema-dark">
    <sidebar :is-mobile-open="isMobileSidebarOpen" @close="isMobileSidebarOpen = false" />

    <div
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 z-40 bg-black/60 md:hidden"
      @click="isMobileSidebarOpen = false"
    ></div>
    
    <!-- Main Content Area -->
    <main class="flex-1 bg-cinema-dark flex flex-col min-w-0 overflow-hidden">
      <!-- Top Header (Mobile only) -->
      <header class="md:hidden bg-cinema-darkAlt border-b border-slate-700 p-4 flex items-center justify-between gap-3">
        <button
          @click="isMobileSidebarOpen = true"
          class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-slate-600 text-slate-200 hover:bg-slate-700/60"
          aria-label="Ouvrir le menu"
        >
          <i class="fa-solid fa-bars"></i>
        </button>
        <h2 class="text-base font-semibold text-slate-100 truncate">CENTRAL CINEMA</h2>
        <button @click="logout" class="inline-flex items-center justify-center w-10 h-10 rounded-md border border-slate-600 text-slate-200 hover:text-red-400 hover:border-red-400" title="Déconnexion">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </header>

      <!-- NEW Global Header for all views -->
      <header class="hidden md:flex justify-between items-center p-4 md:px-8 bg-cinema-darkAlt border-b border-slate-700">
        <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold text-slate-100">Bonjour, <span class="text-cinema-accentLight">{{ authStore.currentUser?.firstName || authStore.currentUser?.username || 'utilisateur' }}</span>!</h1>
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
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router' // Import useRouter
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import { useAuthStore } from '@/stores/auth.store' // Import useAuthStore

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore() // Initialize authStore
const isMobileSidebarOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    isMobileSidebarOpen.value = false
  }
)

const logout = async () => {
  await authStore.logout(router)
}
</script>