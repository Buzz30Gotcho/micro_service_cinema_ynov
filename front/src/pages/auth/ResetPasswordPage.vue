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
          <h2 class="text-2xl font-bold mb-2 text-slate-100">Réinitialiser le mot de passe</h2>
          <p class="text-slate-400 text-sm">
            Entrez votre nouveau mot de passe.
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">

          <!-- Password -->
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-200">Nouveau mot de passe</label>
            <input
              v-model="formData.password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-200">Confirmer le mot de passe</label>
            <input
              v-model="formData.confirm_password"
              type="password"
              placeholder="••••••••"
              required
              class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <!-- Success Message -->
          <div v-if="success" class="p-3 bg-green-900/20 border border-green-500/30 rounded text-green-400 text-sm">
            ✅ Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
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
            <span v-if="!loading">Réinitialiser le mot de passe</span>
            <span v-else>⏳ Enregistrement...</span>
          </button>

        </form>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  token: '',
  password: '',
  confirm_password: ''
})

const loading = ref(false)
const success = ref(false)
const error = ref('')

onMounted(() => {
  formData.value.token = route.params.token
})

const handleSubmit = async () => {
  loading.value = true
  success.value = false
  error.value = ''

  if (formData.value.password !== formData.value.confirm_password) {
    error.value = 'Les mots de passe ne correspondent pas.'
    loading.value = false
    return
  }

  try {
    await authStore.resetPassword(formData.value)
    success.value = true
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Une erreur est survenue.'
  } finally {
    loading.value = false
  }
}
</script>
