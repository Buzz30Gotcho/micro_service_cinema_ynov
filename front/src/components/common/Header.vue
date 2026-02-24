<template>
  <header class="sticky top-0 z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
    <div class="flex items-center justify-between px-6 md:px-12 py-4">

      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 cursor-pointer">
        <div class="w-11 h-11 rounded-md bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center">
          <img :src="logoUrl" alt="Central Cinema" class="w-8 h-8 object-contain" />
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
        <!-- Theme Toggle -->
        <button
          @click="themeStore.toggleTheme()"
          class="p-2 rounded-md hover:bg-slate-800 transition"
          :title="themeStore.isDark ? 'Mode clair' : 'Mode sombre'"
        >
          <svg v-if="themeStore.isDark" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
          <svg v-else class="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.293 1.293a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zm2.828 2.828a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 5a5 5 0 110 10 5 5 0 010-10zm-4.293 1.293a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM3.464 5.464a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM2 10a1 1 0 110 2h1a1 1 0 110-2H2zm2.343 5.464a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM17 11a1 1 0 110 2h1a1 1 0 110-2h-1zm1.464-1.464a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm4.293 1.207a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>

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
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useThemeStore } from '@/stores/theme.store'
import logoUrl from '@/assets/logo.png'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initializeTheme()
})

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