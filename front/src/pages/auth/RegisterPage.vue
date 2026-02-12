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
              <UserPlus :size="20" />
              Créer un compte
            </span>
          </h2>
          <p class="text-slate-400 text-sm">
            Rejoignez-nous et commencez à réserver vos places
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">

          <!-- Prénom -->
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-200">Prénom</label>
            <input
              v-model="formData.first_name"
              type="text"
              placeholder="John"
              required
              class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <!-- Nom -->
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-200">Nom</label>
            <input
              v-model="formData.last_name"
              type="text"
              placeholder="Doe"
              required
              class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-200">Adresse email</label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="vous@exemple.com"
              required
              class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              :class="{ 'border-red-500': emailError }"
            />
            <p v-if="emailError" class="text-red-400 text-xs mt-1">{{ emailError }}</p>
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

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-200">Confirmation mot de passe</label>
            <div class="relative">
              <input
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-1 transition pr-12"
                :class="formData.confirmPassword === formData.password && formData.confirmPassword.length > 0
                        ? 'border-green-400 focus:border-green-400 focus:ring-green-400'
                        : 'border-slate-700 focus:border-blue-500 focus:ring-blue-500'"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition"
              >
                <EyeOff v-if="showConfirmPassword" :size="18" />
                <Eye v-else :size="18" />
              </button>
            </div>
            <p v-if="formData.confirmPassword.length > 0" class="text-xs mt-1"
               :class="formData.confirmPassword === formData.password ? 'text-green-400' : 'text-red-400'">
              <span v-if="formData.confirmPassword === formData.password" class="inline-flex items-center gap-2">
                <CheckCircle :size="14" />
                Les mots de passe correspondent
              </span>
              <span v-else class="inline-flex items-center gap-2">
                <XCircle :size="14" />
                Les mots de passe ne correspondent pas
              </span>
            </p>
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

          <!-- Success -->
          <div v-if="success" class="p-3 bg-green-900/20 border border-green-500/30 rounded text-green-400 text-sm flex items-center gap-2">
            <CheckCircle :size="16" />
            <span>Compte créé avec succès ! Redirection...</span>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || formData.password !== formData.confirmPassword"
            class="w-full py-3 bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg transition transform hover:scale-105"
          >
            <span v-if="!loading" class="inline-flex items-center gap-2">
              <UserPlus :size="16" />
              S'inscrire
            </span>
            <span v-else class="inline-flex items-center gap-2">
              <Loader2 :size="16" class="animate-spin" />
              Inscription en cours...
            </span>
          </button>

        </form>

        <!-- Déjà un compte -->
        <div class="mt-6 text-center text-sm text-slate-400">
          <p>
            Vous avez déjà un compte ?
            <router-link to="/login" class="text-blue-400 font-semibold ml-1 hover:underline">
              Se connecter
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
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { AlertTriangle, CheckCircle, Eye, EyeOff, Loader2, UserPlus, XCircle } from 'lucide-vue-next'
import logoUrl from '@/assets/logo.png'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')
const emailError = ref('')
const success = ref(false)
const loading = ref(false)

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

watch(() => formData.value.email, (newEmail) => {
  if (newEmail && !validateEmail(newEmail)) {
    emailError.value = 'Veuillez entrer une adresse email valide.';
  } else {
    emailError.value = '';
  }
});

const handleSubmit = async () => {
  error.value = ''
  success.value = false

  // Validation
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

      if (formData.value.password.length < 6) {
        error.value = 'Le mot de passe doit contenir au moins 6 caractères'
        return
      }
  
      if (!validateEmail(formData.value.email)) {
        error.value = 'Veuillez entrer une adresse email valide.';
        return;
      }
  loading.value = true

  try {
    await authStore.register({
      first_name: formData.value.first_name,
      last_name: formData.value.last_name,
      email: formData.value.email,
      password: formData.value.password,
      password_confirm: formData.value.confirmPassword

    })

    success.value = true
    
    // Redirection vers login après 2 secondes
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Une erreur est survenue lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
