<template>
  <div class="flex flex-col md:flex-row min-h-screen w-full bg-slate-900">
    <sidebar />
    
    <!-- Main Content Area -->
    <main class="flex-1 bg-slate-900 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Header (Mobile only) -->
      <header class="md:hidden bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-100">CENTRAL CINEMA</h2>
      </header>

      <!-- Content Scroll Area -->
      <div class="flex-1 overflow-y-auto p-4 md:p-8">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
</script>
