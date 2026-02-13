<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="w-20 h-20 mx-auto rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shadow-lg mb-4">
          <img :src="logoUrl" alt="Central Cinema" class="w-12 h-12 object-contain" />
        </div>
        <h1 class="text-3xl font-bold mb-1 text-slate-100">CENTRAL CINEMA</h1>
        <p class="text-slate-400 text-sm">Votre cinéma en ligne</p>
      </div>

      <!-- Card -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold mb-2 text-slate-100">
            <span class="inline-flex items-center gap-2">
              <Sparkles :size="20" />
              Bienvenue
            </span>
          </h2>
          <p class="text-slate-400 text-sm">
            Connectez-vous pour réserver vos places
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-200">Adresse email</label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="vous@exemple.com"
              required
              autocomplete="email"
              class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-200">Mot de passe</label>
            <div class="relative">
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                autocomplete="current-password"
                class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition pr-12"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition"
              >
                <EyeOff v-if="showPassword" :size="18" />
                <Eye v-else :size="18" />
              </button>
            </div>
          </div>

          <div class="text-right">
            <router-link to="/forgot-password" class="text-sm text-blue-400 hover:underline">
              Mot de passe oublié ?
            </router-link>
          </div>

          <!-- Error -->
          <div v-if="error" class="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle :size="16" />
            <span>{{ error }}</span>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg transition transform hover:scale-105"
          >
            <span v-if="!loading" class="inline-flex items-center gap-2">
              <LogIn :size="16" />
              Se connecter
            </span>
            <span v-else class="inline-flex items-center gap-2">
              <Loader2 :size="16" class="animate-spin" />
              Connexion en cours...
            </span>
          </button>

        </form>

        <!-- Pas de compte -->
        <div class="mt-6 text-center text-sm text-cinema-300">
          <p>
            Pas encore de compte ?
            <router-link to="/register" class="text-blue-400 font-semibold ml-1 hover:underline">
              Créer un compte
            </router-link>
          </p>
        </div>



      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-slate-500 text-xs">
        © 2025 CENTRAL CINEMA — Projet Microservices
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { AlertTriangle, Eye, EyeOff, Loader2, LogIn, Sparkles } from 'lucide-vue-next'
import logoUrl from '@/assets/logo.png'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    await authStore.login(formData.value.email, formData.value.password)
    
    // Redirection après connexion réussie
    if (authStore.isAdmin) {
      router.push('/admin/dashboard')
    } else {
      router.push('/')
    }
  } catch (err) {
    // L'erreur est déjà traitée et formatée dans le store, on la récupère simplement.
    error.value = authStore.error
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
