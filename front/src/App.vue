<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useThemeStore } from '@/stores/theme.store'

const authStore = useAuthStore()
const themeStore = useThemeStore()

onMounted(() => {
  authStore.initializeAuth()
  themeStore.initializeTheme()
})
</script>

<template>
  <router-view />
</template>

<style scoped></style>
