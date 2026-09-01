<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useThemeStore } from '@/stores/theme.store'

const authStore = useAuthStore()
const themeStore = useThemeStore()

// Mode démo : actif quand aucune API backend n'est configurée (ex. déploiement
// vitrine sur Vercel). Le bandeau disparaît automatiquement si VITE_API_BASE est défini.
const demoMode = ref(!import.meta.env.VITE_API_BASE)
const bannerVisible = ref(true)

onMounted(() => {
  authStore.initializeAuth()
  themeStore.initializeTheme()
})
</script>

<template>
  <div
    v-if="demoMode && bannerVisible"
    class="sticky top-0 z-[100] flex items-center justify-center gap-3 bg-primary-accent px-4 py-2 text-center text-sm font-medium text-white shadow-md"
  >
    <span>
      🎬 Démo visuelle — le backend (microservices) n'est pas déployé, les données
      et actions ne sont donc pas fonctionnelles.
      <a
        href="https://github.com/Buzz30Gotcho/micro_service_cinema_ynov"
        target="_blank"
        rel="noopener"
        class="underline underline-offset-2 hover:opacity-80"
      >Voir le code source →</a>
    </span>
    <button
      @click="bannerVisible = false"
      class="ml-2 shrink-0 rounded px-2 leading-none opacity-80 hover:opacity-100"
      aria-label="Fermer"
    >✕</button>
  </div>
  <router-view />
</template>

<style scoped></style>
