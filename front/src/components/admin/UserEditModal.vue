<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
    <div class="bg-slate-800 rounded-xl shadow-lg w-full max-w-lg">
      <div class="border-b border-slate-700 px-6 py-4">
        <h3 class="text-lg font-medium text-white">{{ isEditing ? 'Modifier l\'utilisateur' : 'Créer un utilisateur' }}</h3>
      </div>
      <form @submit.prevent="submitForm">
        <div class="p-6 space-y-4">
          <!-- Form Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1 text-slate-300">Prénom</label>
              <input v-model="form.first_name" type="text" required class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1 text-slate-300">Nom</label>
              <input v-model="form.last_name" type="text" required class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-300">Email</label>
            <input v-model="form.email" type="email" required class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-300">
              Mot de passe 
              <span v-if="isEditing" class="text-xs text-slate-400 font-normal">(laisser vide pour ne pas changer)</span>
            </label>
            <input v-model="form.password" type="password" :required="!isEditing" class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-300">Rôle</label>
            <select v-model="form.role" required class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
              <option value="client">Client</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <!-- Error -->
          <div v-if="error" class="p-3 bg-red-900/20 border border-red-500/30 rounded text-red-400 text-sm">
            {{ error }}
          </div>
        </div>
        <div class="bg-slate-900/50 px-6 py-3 flex justify-end items-center gap-3 rounded-b-xl">
          <button @click="closeModal" type="button" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition">Annuler</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white font-bold rounded-lg transition" :disabled="loading">
            <span v-if="!loading">{{ isEditing ? 'Sauvegarder' : 'Créer' }}</span>
            <span v-else>
              <i class="fa-solid fa-spinner animate-spin"></i>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useUsersStore } from '@/stores/users.store';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  user: { type: Object, default: null }
});

const emit = defineEmits(['update:modelValue']);

const usersStore = useUsersStore();
const form = ref({});
const error = ref('');
const loading = ref(false);

const isEditing = computed(() => !!props.user);

// Watch for the modal opening and set the form data
watch(() => props.modelValue, (newValue) => {
  error.value = '';
  if (newValue) {
    if (isEditing.value) {
      // Editing existing user
      form.value = {
        id: props.user.id,
        first_name: props.user.first_name,
        last_name: props.user.last_name,
        email: props.user.email,
        role: props.user.role,
        password: '', // Password is blank by default for edits
      };
    } else {
      // Creating new user
      form.value = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'client',
      };
    }
  }
});

function closeModal() {
  emit('update:modelValue', false);
}

async function submitForm() {
  loading.value = true;
  error.value = '';
  try {
    const userData = { ...form.value };
    // Don't send empty password on edit
    if (isEditing.value && !userData.password) {
      delete userData.password;
    }

    if (isEditing.value) {
      await usersStore.updateUser(userData.id, userData);
    } else {
      await usersStore.createUser(userData);
    }
    closeModal();
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue.';
  } finally {
    loading.value = false;
  }
}
</script>
