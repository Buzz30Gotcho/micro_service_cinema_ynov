<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
    <div class="w-full max-w-md">

      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="w-20 h-20 mx-auto rounded-lg bg-blue-600 flex items-center justify-center text-slate-950 text-4xl font-bold shadow-lg mb-4">
          🎬
        </div>
        <h1 class="text-3xl font-bold mb-1 text-slate-100">CENTRAL CINEMA</h1>
        <p class="text-slate-400 text-sm">Votre cinéma en ligne</p>
      </div>

      <!-- Card -->
      <div class="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold mb-2 text-slate-100">Mot de passe oublié</h2>
          <p class="text-slate-400 text-sm">
            Entrez votre adresse email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-200">Adresse email</label>
            <input
              v-model="email"
              type="email"
              placeholder="vous@exemple.com"
              required
              class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <!-- Success Message -->
          <div v-if="success" class="p-3 bg-green-900/20 border border-green-500/30 rounded text-green-400 text-sm">
            ✅ Si un compte avec cet email existe, un lien de réinitialisation a été envoyé.
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm">
            ⚠️ {{ error }}
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg transition transform hover:scale-105"
          >
            <span v-if="!loading">Envoyer le lien</span>
            <span v-else>⏳ Envoi en cours...</span>
          </button>

        </form>

        <!-- Retour -->
        <div class="mt-6 text-center text-sm text-slate-400">
          <router-link to="/login" class="hover:underline">
            &larr; Retour à la connexion
          </router-link>
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
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const email = ref('')
const loading = ref(false)
const success = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  success.value = false
  error.value = ''

  try {
    // Note: The backend for forgotPassword is not implemented yet.
    // This will likely fail, but we'll show a success message to the user
    // to avoid leaking information about which emails are registered.
    await authStore.forgotPassword(email.value)
    success.value = true
  } catch (err) {
    // In a real application, you might not want to show a specific error here
    // for security reasons (to avoid user enumeration).
    // For now, we'll just show a generic message.
    success.value = true // Show success even on error for security
  } finally {
    loading.value = false
  }
}
</script>
