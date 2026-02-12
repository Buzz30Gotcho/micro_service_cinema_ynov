<template>
  <header class="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
    <div class="flex items-center justify-between px-6 md:px-12 py-4">

      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 cursor-pointer">
        <div class="w-11 h-11 rounded-md bg-blue-600 flex items-center justify-center text-slate-950 font-bold">
          🎬
        </div>
        <span class="text-lg font-semibold tracking-wide">
          CENTRAL CINEMA
        </span>
      </router-link>

      <!-- Navigation -->
      <nav class="hidden md:flex items-center gap-8 text-sm text-slate-300">
        <router-link to="/films" class="hover:text-white transition">Films</router-link>
        <router-link to="/seances" class="hover:text-white transition">Séances</router-link>
        <router-link to="/tarifs" class="hover:text-white transition">Tarifs</router-link>
        <router-link v-if="authStore.isAuthenticated" to="/client/my-bookings" class="hover:text-white transition">Mes réservations</router-link>
        <router-link v-if="authStore.isAdmin" to="/admin/dashboard" class="hover:text-white transition">Administration</router-link>
      </nav>

      <!-- Auth actions -->
      <div class="flex items-center gap-4 text-sm">
        <template v-if="authStore.isAuthenticated">
          <router-link
            to="/profil"
            class="flex items-center gap-2 hover:opacity-80 transition"
          >
            <div class="w-9 h-9 rounded-full bg-blue-600 text-slate-950 font-semibold flex items-center justify-center">
              {{ initials }}
            </div>
            <div class="leading-tight">
              <p class="text-slate-100 font-semibold truncate max-w-[160px]">{{ authStore.currentUser?.name }}</p>

            </div>
          </router-link>
          <button
            @click="handleLogout"
            class="px-4 py-2 rounded-md border border-slate-700 hover:border-blue-500 hover:text-blue-400 transition"
          >
            Déconnexion
          </button>
        </template>
        <template v-else>
          <button
            @click="goToLogin"
            class="px-4 py-2 rounded-md border border-slate-700 hover:border-blue-500 hover:text-blue-400 transition"
          >
            Connexion
          </button>
          <button
            @click="goToRegister"
            class="px-4 py-2 rounded-md bg-blue-600 text-slate-950 font-medium hover:bg-blue-500 transition"
          >
            Inscription
          </button>
        </template>
      </div>

    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const initials = computed(() => {
  const firstName = authStore.currentUser?.firstName;
  const lastName = authStore.currentUser?.lastName;

  if (!firstName && !lastName) return ''; // Return empty string if no name parts are available

  let initialStr = '';
  if (firstName) {
    initialStr += firstName[0];
  }
  if (lastName) {
    initialStr += lastName[0];
  }
  return initialStr.toUpperCase();
})

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const handleLogout = async () => {
  await authStore.logout(router)
}
const goTopagehome = async () => {
  router.push('/')
}

</script>