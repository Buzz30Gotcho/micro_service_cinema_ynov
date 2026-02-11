<template>
  <div class="min-h-screen bg-dark-bg">
    <Header />
    <section class="px-4 md:px-12 py-10">
      <header class="mb-10">
        <h1 class="text-4xl font-heading font-bold text-light-text">Tarifs</h1>
        <p class="text-muted-text">Des prix simples et transparents</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Standard -->
        <div class="bg-dark-card border border-dark-border rounded-lg p-6 shadow-md">
          <h3 class="text-xl font-heading font-bold text-light-text mb-2">Standard</h3>
          <p class="text-muted-text mb-4">Accès siège classique</p>
          <div class="text-4xl font-heading font-extrabold text-primary-accent mb-4">10€</div>
          <ul class="text-muted-text text-sm space-y-2">
            <li>• Séances 2D</li>
            <li>• Choix de la place</li>
            <li>• Annulation jusqu'à 2h avant</li>
          </ul>
        </div>

        <!-- Étudiant -->
        <div class="bg-dark-card border border-dark-border rounded-lg p-6 shadow-md">
          <h3 class="text-xl font-heading font-bold text-light-text mb-2">Étudiant</h3>
          <p class="text-muted-text mb-4">Sur présentation de carte</p>
          <div class="text-4xl font-heading font-extrabold text-primary-accent mb-4">7€</div>
          <ul class="text-muted-text text-sm space-y-2">
            <li>• Séances 2D</li>
            <li>• Choix de la place</li>
            <li>• Annulation jusqu'à 2h avant</li>
          </ul>
        </div>

        <!-- Premium -->
        <div class="bg-dark-card border border-dark-border rounded-lg p-6 shadow-md">
          <h3 class="text-xl font-heading font-bold text-light-text mb-2">Premium</h3>
          <p class="text-muted-text mb-4">Siège confort + prioritaire</p>
          <div class="text-4xl font-heading font-extrabold text-primary-accent mb-4">15€</div>
          <ul class="text-muted-text text-sm space-y-2">
            <li>• Accès 2D et 3D (+2€)</li>
            <li>• Siège premium</li>
            <li>• Annulation jusqu'à 1h avant</li>
          </ul>
        </div>
      </div>

      <div class="mt-10 p-4 bg-dark-card border border-dark-border rounded-lg shadow-md">
        <p class="text-muted-text text-sm">Supplément 3D: +2€. Tarif enfant (-12 ans): 6€.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import Header from '@/components/common/Header.vue'
</script>

<style scoped></style>