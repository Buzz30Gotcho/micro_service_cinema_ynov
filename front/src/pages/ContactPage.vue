<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <section class="max-w-4xl mx-auto px-6 md:px-12 py-12">
      <h1 class="text-3xl font-bold mb-6">Contact</h1>
      <p class="text-slate-300 mb-8">
        Une question sur une réservation ou un film ? Laissez-nous un message, nous vous répondrons rapidement.
      </p>

      <form class="space-y-6 max-w-xl">
        <div>
          <label class="block text-sm text-slate-300 mb-2" for="name">Nom</label>
          <input id="name" type="text" class="w-full rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500" placeholder="Votre nom" />
        </div>
        <div>
          <label class="block text-sm text-slate-300 mb-2" for="email">Email</label>
          <input id="email" type="email" class="w-full rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500" placeholder="vous@exemple.com" />
        </div>
        <div>
          <label class="block text-sm text-slate-300 mb-2" for="message">Message</label>
          <textarea id="message" rows="5" class="w-full rounded-lg bg-slate-900 border border-slate-800 px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500" placeholder="Votre message"></textarea>
        </div>
        <button type="button" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-100 rounded-lg">Envoyer</button>
      </form>
    </section>
  </div>
</template>

<script setup>
// Page statique pour l'instant
</script>

<style scoped></style>
