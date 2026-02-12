<template>
  <app-layout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white">Programmation des Séances</h2>
          <p class="text-slate-400 text-sm mt-1">Gérer les horaires et les salles de projection.</p>
        </div>
        <button @click="openCreateModal" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 self-start">
          <i class="fa-solid fa-plus"></i> Nouvelle Séance
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="sessionsStore.loading && sessionsStore.sessions.length === 0" class="flex justify-center py-12">
        <div class="text-center text-slate-400">
          <i class="fa-solid fa-spinner fa-spin text-3xl"></i>
          <p class="mt-3 text-lg">Chargement des séances...</p>
        </div>
      </div>

      <!-- Error State -->
       <div v-else-if="sessionsStore.error" class="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
        <p class="text-red-400">
          <i class="fa-solid fa-circle-exclamation mr-2"></i>
          {{ sessionsStore.error }}
        </p>
      </div>

      <!-- Sessions Table -->
      <div v-else class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-300">
            <thead class="bg-slate-900/50 text-xs text-slate-400 uppercase font-medium border-b border-slate-700">
              <tr>
                <th class="px-6 py-4">Film</th>
                <th class="px-6 py-4">Salle</th>
                <th class="px-6 py-4">Date & Horaire</th>
                <th class="px-6 py-4">Prix</th>
                <th class="px-6 py-4">Taux de Remplissage</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
              <tr v-for="session in sessionsStore.sessions" :key="session.id" class="hover:bg-slate-700/30 transition-colors group">
                <td class="px-6 py-4 font-medium text-white">
                  {{ session.nameMovie }}
                </td>
                <td class="px-6 py-4">{{ session.room }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-medium text-slate-200">{{ formatDate(session.date) }}</span>
                    <span class="text-slate-400 text-xs">{{ session.time }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  {{ session.price ? `${session.price} €` : 'N/A' }}
                </td>
                <td class="px-6 py-4">
                  <div class="w-full max-w-[100px] bg-slate-700 rounded-full h-1.5 mb-1">
                    <div 
                      class="bg-blue-500 h-1.5 rounded-full" 
                      :style="`width: ${getBookingPercentage(session)}%`"
                    ></div>
                  </div>
                  <span class="text-xs text-slate-400">{{ session.booked || 0 }} / {{ session.capacity }}</span>
                </td>
                <td class="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  <button @click="openEditModal(session)" class="px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors" title="Modifier">
                    Modifier
                  </button>
                  <button @click="confirmDelete(session.id)" class="px-3 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors" title="Supprimer">
                    Supprimer
                  </button>
                </td>
              </tr>
               <tr v-if="sessionsStore.sessions.length === 0">
                <td colspan="6" class="text-center py-8 text-slate-400">
                    Aucune séance programmée.
                </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <session-edit-modal v-model="isModalOpen" :session="currentSession" @update:modelValue="isModalOpen = $event" />
  </app-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import SessionEditModal from '@/components/admin/SessionEditModal.vue'
import { useSessionsStore } from '@/stores/sessions.store'

const sessionsStore = useSessionsStore()

const isModalOpen = ref(false)
const currentSession = ref(null)

const openCreateModal = () => {
  currentSession.value = null
  isModalOpen.value = true
}

const openEditModal = (session) => {
  currentSession.value = session
  isModalOpen.value = true
}

const confirmDelete = async (sessionId) => {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
    try {
      await sessionsStore.deleteSession(sessionId)
    } catch (error) {
      alert(`Erreur lors de la suppression : ${error.message}`)
    }
  }
}

onMounted(() => {
  sessionsStore.fetchAllSessions()
})

const getBookingPercentage = (session) => {
  if (!session.capacity || session.capacity === 0) return 0
  return ((session.booked || 0) / session.capacity) * 100
}

const formatDate = (dateString) => {
  if (!dateString) return 'Date invalide';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}
</script>
