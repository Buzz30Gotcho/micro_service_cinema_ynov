<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <Header />

    <main class="flex-1">

      <!-- HERO -->
      <section class="relative px-6 md:px-12 pt-32 pb-32 text-center overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_50%)]"></div>

        <div class="relative max-w-4xl mx-auto">
          <div class="space-y-6">
            <span class="text-xl uppercase tracking-widest text-blue-400 font-semibold">
              Bienvenue sur Central Cinéma
            </span>

            <h1 class="text-4xl md:text-6xl font-extrabold leading-tight">
              Votre portail vers le grand écran.
            </h1>

            <p class="text-slate-400 max-w-2xl mx-auto text-lg">
              Explorez les derniers films, découvrez les horaires des séances, et réservez vos places en quelques clics. Préparez le popcorn !
            </p>

            <div class="flex justify-center gap-4 pt-4">
              <router-link to="/films" class="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors">
                Voir les films
              </router-link>
              <router-link to="/seances" class="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors">
                Toutes les séances
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- FILMS -->
      <section class="px-6 md:px-12 py-20 border-t border-slate-800 bg-slate-900/50">
        <div class="max-w-7xl mx-auto">

          <div class="flex items-center justify-between mb-12">
            <h2 class="text-3xl font-bold">À l’affiche en ce moment</h2>
            <router-link to="/films" class="text-sm text-blue-400 hover:underline">
              Voir tous les films →
            </router-link>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div
              v-for="movie in popularMovies"
              :key="movie.id"
              @click="goToMovie(movie.id)"
              class="group relative h-64 md:h-72 rounded-xl cursor-pointer overflow-hidden
                     transform-gpu transition-all duration-300
                     hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30"
            >
              <div
                class="absolute inset-0 w-full h-full"
                :style="{ backgroundImage: `url('${movie.posterUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' }"
              ></div>
              <!-- Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              <!-- Infos -->
              <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 class="text-base font-bold truncate group-hover:whitespace-normal group-hover:line-clamp-2">
                  {{ movie.title }}
                </h3>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                   <p class="text-xs text-slate-300">
                    {{ movie.duration }} min • {{ movie.rating }}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      
      <!-- HOW IT WORKS -->
      <section class="px-6 md:px-12 py-24 border-t border-slate-800">
        <div class="max-w-5xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">Votre soirée ciné en 3 étapes</h2>
          <p class="text-slate-400 mb-12">C'est simple, rapide et sécurisé.</p>

          <div class="grid md:grid-cols-3 gap-12">
            <div class="flex flex-col items-center space-y-4">
              <div class="flex items-center justify-center w-16 h-16 bg-slate-800 border-2 border-blue-500/50 rounded-full text-2xl font-bold text-blue-400">1</div>
              <h4 class="font-semibold text-lg">Choisissez votre film</h4>
              <p class="text-sm text-slate-400">Parcourez notre catalogue et trouvez le film qui vous fait envie.</p>
            </div>
            <div class="flex flex-col items-center space-y-4">
              <div class="flex items-center justify-center w-16 h-16 bg-slate-800 border-2 border-blue-500/50 rounded-full text-2xl font-bold text-blue-400">2</div>
              <h4 class="font-semibold text-lg">Réservez votre séance</h4>
              <p class="text-sm text-slate-400">Sélectionnez la date, l'heure et vos sièges préférés.</p>
            </div>
            <div class="flex flex-col items-center space-y-4">
              <div class="flex items-center justify-center w-16 h-16 bg-slate-800 border-2 border-blue-500/50 rounded-full text-2xl font-bold text-blue-400">3</div>
              <h4 class="font-semibold text-lg">Profitez du spectacle</h4>
              <p class="text-sm text-slate-400">Présentez votre e-billet et savourez l'expérience Central Cinéma.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- PROMO BANNER -->
      <section class="px-6 md:px-12 py-16">
        <div class="max-w-6xl mx-auto bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 md:p-12 text-center">
          <h2 class="text-3xl font-bold mb-3">Offre Spéciale Étudiants</h2>
          <p class="text-blue-200/80 max-w-xl mx-auto">
            Bénéficiez de -25% sur toutes les séances du lundi au jeudi sur présentation de votre carte étudiante.
          </p>
        </div>
      </section>

    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

const router = useRouter()
const goToMovie = (id) => router.push(`/film/${id}`)

const popularMovies = ref([
  { id: 1, title: 'Le Gardien des Étoiles', duration: 120, rating: 'PG-13', posterUrl: 'https://picsum.photos/seed/movie-1/400/600' },
  { id: 2, title: 'Océan Bleu', duration: 102, rating: 'G', posterUrl: 'https://picsum.photos/seed/movie-2/400/600' },
  { id: 3, title: 'Nocturne', duration: 116, rating: 'R', posterUrl: 'https://picsum.photos/seed/movie-3/400/600' },
  { id: 4, title: 'Dernière Séance', duration: 98, rating: 'PG', posterUrl: 'https://picsum.photos/seed/movie-4/400/600' },
  { id: 5, title: 'La Cité des Songes', duration: 145, rating: 'PG-13', posterUrl: 'https://picsum.photos/seed/movie-5/400/600' },
  { id: 6, title: 'Écho du Temps', duration: 110, rating: 'PG', posterUrl: 'https://picsum.photos/seed/movie-6/400/600' },
])
</script>