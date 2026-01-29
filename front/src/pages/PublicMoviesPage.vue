<template>
  <div class="min-h-screen bg-slate-950">
    <section class="px-4 md:px-12 py-10">
      <header class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-slate-100">Films à l'affiche</h1>
        <router-link to="/login" class="px-4 py-2 bg-blue-600 text-slate-100 font-semibold rounded-lg hover:bg-blue-500 transition-colors">Se connecter</router-link>
      </header>

      <!-- Loading and Error states -->
      <div v-if="loading" class="text-center text-slate-400">Chargement des films...</div>
      <div v-if="error" class="text-center text-red-500">Erreur: {{ error }}</div>

      <!-- Movies Grid -->
      <div v-if="!loading && !error" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <router-link
          v-for="movie in movies"
          :key="movie.id"
          :to="`/film/${movie.id}`"
          class="group relative block h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-blue-500/30 transition-all border border-slate-700 hover:border-blue-500"
        >
          <div 
            class="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            :style="{ backgroundImage: movie.image ? `url('${movie.image}')` : '' }"
          ></div>
          <!-- Fond dégradé avec transparence -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:from-black/90 group-hover:via-black/70 transition-all"></div>

          <!-- Titre Netflix style -->
          <div class="absolute inset-0 flex flex-col items-center justify-end text-center p-4 pb-6">
            <h3 class="text-2xl md:text-3xl font-black text-white drop-shadow-lg transition-transform group-hover:scale-105">
              {{ movie.title }}
            </h3>
            <p class="text-sm text-slate-300">{{ movie.genre }}</p>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useMoviesStore } from '@/stores/movies.store'
import { storeToRefs } from 'pinia'

const moviesStore = useMoviesStore()
const { movies, loading, error } = storeToRefs(moviesStore)

onMounted(() => {
  moviesStore.fetchMovies()
})
</script>

<style scoped></style>
