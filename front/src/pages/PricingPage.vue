<template>
  <div class="min-h-screen bg-slate-950">
    <section class="px-4 md:px-12 py-10">
      <header class="mb-10">
        <h1 class="text-3xl font-bold text-slate-100">Tarifs</h1>
        <p class="text-slate-400">Des prix simples et transparents</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Standard -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-slate-100 mb-2">Standard</h3>
          <p class="text-slate-400 mb-4">Accès siège classique</p>
          <div class="text-4xl font-extrabold text-slate-100 mb-4">10€</div>
          <ul class="text-slate-400 text-sm space-y-2">
            <li>• Séances 2D</li>
            <li>• Choix de la place</li>
            <li>• Annulation jusqu'à 2h avant</li>
          </ul>
        </div>

        <!-- Étudiant -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-slate-100 mb-2">Étudiant</h3>
          <p class="text-slate-400 mb-4">Sur présentation de carte</p>
          <div class="text-4xl font-extrabold text-slate-100 mb-4">7€</div>
          <ul class="text-slate-400 text-sm space-y-2">
            <li>• Séances 2D</li>
            <li>• Choix de la place</li>
            <li>• Annulation jusqu'à 2h avant</li>
          </ul>
        </div>

        <!-- Premium -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 class="text-xl font-bold text-slate-100 mb-2">Premium</h3>
          <p class="text-slate-400 mb-4">Siège confort + prioritaire</p>
          <div class="text-4xl font-extrabold text-slate-100 mb-4">15€</div>
          <ul class="text-slate-400 text-sm space-y-2">
            <li>• Accès 2D et 3D (+2€)</li>
            <li>• Siège premium</li>
            <li>• Annulation jusqu'à 1h avant</li>
          </ul>
        </div>
      </div>

      <div class="mt-10 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <p class="text-slate-400 text-sm">Supplément 3D: +2€. Tarif enfant (-12 ans): 6€.</p>
      </div>
    </section>
  </div>
</template>

<script setup></script>

<style scoped></style>
