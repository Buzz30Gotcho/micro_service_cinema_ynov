<template>
  <app-layout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Gestion Utilisateurs</h2>
        <button @click="openCreateModal" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
          <i class="fa-solid fa-plus mr-2"></i>
          Créer un utilisateur
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="usersStore.loading && usersStore.users.length === 0" class="flex justify-center py-12">
        <div class="text-center text-slate-400">
          <i class="fa-solid fa-spinner fa-spin text-3xl"></i>
          <p class="mt-3 text-lg">Chargement des utilisateurs...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="usersStore.error" class="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
        <p class="text-red-400">
          <i class="fa-solid fa-circle-exclamation mr-2"></i>
          {{ usersStore.error }}
        </p>
      </div>
      
      <!-- Users Table -->
      <div v-else class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table class="w-full text-left text-sm text-slate-300">
          <thead class="bg-slate-900/50 text-xs text-slate-400 uppercase font-medium border-b border-slate-700">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Nom</th>
              <th class="px-6 py-4">Email</th>
              <th class="px-6 py-4">Rôle</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700">
            <tr v-for="user in usersStore.users" :key="user.id" class="hover:bg-slate-700/30 transition-colors">
              <td class="px-6 py-4 font-mono text-xs text-slate-500">#{{ user.id }}</td>
              <td class="px-6 py-4 font-medium text-white">{{ user.first_name }} {{ user.last_name }}</td>
              <td class="px-6 py-4">{{ user.email }}</td>
              <td class="px-6 py-4">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-sky-500/20 text-sky-300'"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button @click="openEditModal(user)" class="text-slate-400 hover:text-blue-400 px-2 py-1" title="Modifier">
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button @click="confirmDelete(user.id)" class="text-slate-400 hover:text-red-400 px-2 py-1" title="Supprimer">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
             <tr v-if="usersStore.users.length === 0">
                <td colspan="5" class="text-center py-8 text-slate-400">
                    Aucun utilisateur trouvé.
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Modal -->
    <user-edit-modal v-model="isModalOpen" :user="currentUser" @update:modelValue="isModalOpen = $event" />
  </app-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import UserEditModal from '@/components/admin/UserEditModal.vue'
import { useUsersStore } from '@/stores/users.store'

const usersStore = useUsersStore()

const isModalOpen = ref(false)
const currentUser = ref(null)

const openCreateModal = () => {
  currentUser.value = null
  isModalOpen.value = true
}

const openEditModal = (user) => {
  currentUser.value = user
  isModalOpen.value = true
}

const confirmDelete = async (userId) => {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    try {
      await usersStore.deleteUser(userId)
      // On pourrait ajouter un toast/notification de succès ici
    } catch (error) {
      alert(`Erreur lors de la suppression : ${error.message}`)
    }
  }
}

onMounted(() => {
  usersStore.fetchUsers()
})
</script>
