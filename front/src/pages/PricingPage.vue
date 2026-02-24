<template>
  <div class="min-h-screen bg-dark-bg">
    <Header />
    
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-dark-card via-dark-bg to-dark-bg py-20 px-4 md:px-12">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-72 h-72 bg-primary-accent rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-10 right-10 w-72 h-72 bg-primary-accent/50 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      </div>
      
      <div class="relative z-10 max-w-4xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-heading font-bold text-light-text mb-4 animate-fade-in">
          Nos Tarifs
        </h1>
        <p class="text-xl text-muted-text mb-2 animate-fade-in" style="animation-delay: 0.2s;">
          Vivez le cinéma à votre rythme et à vos conditions
        </p>
        <div class="h-1 w-20 bg-gradient-to-r from-primary-accent to-transparent mx-auto animate-fade-in" style="animation-delay: 0.4s;"></div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="px-4 md:px-12 py-16 max-w-7xl mx-auto">
      
      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <!-- Standard -->
        <div class="pricing-card group relative h-full">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div class="relative bg-dark-card border border-dark-border rounded-xl p-8 shadow-lg hover:shadow-2xl transition duration-300 h-full flex flex-col">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-2xl font-heading font-bold text-light-text">Standard</h3>
              <span class="text-3xl">🎬</span>
            </div>
            <p class="text-muted-text text-sm mb-6">Le classique indémodable</p>
            
            <div class="mb-8">
              <div class="text-5xl font-heading font-extrabold text-blue-400 mb-2">10€</div>
              <p class="text-muted-text text-xs">par place</p>
            </div>

            <div class="space-y-3 mb-8 flex-grow">
              <div class="flex items-start gap-3">
                <span class="text-blue-400 text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Séances 2D</p>
                  <p class="text-muted-text text-xs">Toutes nos salles</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-blue-400 text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Choix de la place</p>
                  <p class="text-muted-text text-xs">Disponibilité en temps réel</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-blue-400 text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Annulation flexible</p>
                  <p class="text-muted-text text-xs">Jusqu'à 2h avant</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-blue-400 text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Siège confortable</p>
                  <p class="text-muted-text text-xs">Accoudoirs intégrés</p>
                </div>
              </div>
            </div>

            <router-link to="/seances" class="block w-full py-3 rounded-lg bg-blue-500/20 border border-blue-400/50 text-blue-400 font-semibold hover:bg-blue-500/30 transition duration-300 text-center">
              Réserver maintenant
            </router-link>
          </div>
        </div>

        <!-- Étudiant -->
        <div class="pricing-card group relative h-full">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div class="relative bg-dark-card border border-dark-border rounded-xl p-8 shadow-lg hover:shadow-2xl transition duration-300 h-full flex flex-col">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-2xl font-heading font-bold text-light-text">Étudiant</h3>
              <span class="text-3xl">📚</span>
            </div>
            <p class="text-muted-text text-sm mb-6">Tarif réduit avec justificatif</p>
            
            <div class="mb-8">
              <div class="text-5xl font-heading font-extrabold text-green-400 mb-2">7€</div>
              <div class="flex items-center gap-2">
                <p class="text-muted-text text-xs">par place</p>
                <span class="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">-30%</span>
              </div>
            </div>

            <div class="space-y-3 mb-8 flex-grow">
              <div class="flex items-start gap-3">
                <span class="text-green-400 text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Séances 2D</p>
                  <p class="text-muted-text text-xs">Toutes les séances</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-green-400 text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Choix de la place</p>
                  <p class="text-muted-text text-xs">Toutes les salles</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-green-400 text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Annulation flexible</p>
                  <p class="text-muted-text text-xs">Jusqu'à 2h avant</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-green-400 text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Justificatif requis</p>
                  <p class="text-muted-text text-xs">Carte étudiant valide</p>
                </div>
              </div>
            </div>

            <router-link to="/seances" class="block w-full py-3 rounded-lg bg-green-500/20 border border-green-400/50 text-green-400 font-semibold hover:bg-green-500/30 transition duration-300 text-center">
              Réserver avec tarif réduit
            </router-link>
          </div>
        </div>

        <!-- Premium -->
        <div class="pricing-card group relative h-full border-2 border-primary-accent/50">
          <div class="absolute -inset-0.5 bg-gradient-to-r from-primary-accent to-primary-accent/50 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
          <div class="absolute top-0 right-0 bg-gradient-to-r from-primary-accent to-primary-accent/50 text-light-text px-4 py-1 rounded-bl-lg text-xs font-bold">
            ⭐ POPULAIRE
          </div>
          <div class="relative bg-dark-card border border-primary-accent/50 rounded-xl p-8 shadow-lg hover:shadow-2xl transition duration-300 h-full flex flex-col pt-12">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-2xl font-heading font-bold text-light-text">Premium</h3>
              <span class="text-3xl">👑</span>
            </div>
            <p class="text-muted-text text-sm mb-6">L'expérience cinéma ultime</p>
            
            <div class="mb-8">
              <div class="text-5xl font-heading font-extrabold text-primary-accent mb-2">15€</div>
              <div class="flex items-center gap-2">
                <p class="text-muted-text text-xs">par place</p>
                <span class="bg-primary-accent/20 text-primary-accent text-xs px-2 py-1 rounded">+50%</span>
              </div>
            </div>

            <div class="space-y-3 mb-8 flex-grow">
              <div class="flex items-start gap-3">
                <span class="text-primary-accent text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Séances 2D et 3D</p>
                  <p class="text-muted-text text-xs">Accès illimité (+2€ pour 3D)</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-primary-accent text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Siège premium</p>
                  <p class="text-muted-text text-xs">Fauteuil 4D reclassable</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-primary-accent text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Priorité de réservation</p>
                  <p class="text-muted-text text-xs">Les meilleures places</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-primary-accent text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Annulation premium</p>
                  <p class="text-muted-text text-xs">Jusqu'à 1h avant</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="text-primary-accent text-lg mt-0.5">✓</span>
                <div>
                  <p class="text-light-text text-sm font-semibold">Points fidélité x2</p>
                  <p class="text-muted-text text-xs">Programme de récompenses</p>
                </div>
              </div>
            </div>

            <router-link to="/seances" class="block w-full py-3 rounded-lg bg-gradient-to-r from-primary-accent/30 to-primary-accent/10 border border-primary-accent/50 text-primary-accent font-semibold hover:bg-primary-accent/40 transition duration-300 text-center">
              Accès Premium
            </router-link>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="bg-gradient-to-r from-primary-accent/10 to-primary-accent/5 border border-primary-accent/30 rounded-xl p-8">
        <h3 class="text-xl font-bold text-light-text mb-4">ℹ️ Informations importantes</h3>
        <ul class="text-muted-text text-sm space-y-3">
          <li><span class="text-primary-accent font-semibold">•</span> Les tarifs étudiants nécessitent une carte d'étudiant valide présentée à l'accueil</li>
          <li><span class="text-primary-accent font-semibold">•</span> Les suppléments 3D s'ajoutent au tarif de base choisi</li>
          <li><span class="text-primary-accent font-semibold">•</span> Groupes de 10 personnes et plus : contactez-nous pour des tarifs spéciaux</li>
        </ul>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}

.pricing-card {
  animation: fadeIn 0.8s ease-out forwards;
}

.pricing-card:nth-child(1) {
  animation-delay: 0s;
}

.pricing-card:nth-child(2) {
  animation-delay: 0.15s;
}

.pricing-card:nth-child(3) {
  animation-delay: 0.3s;
}
</style>