<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
    <div class="bg-slate-800 rounded-xl shadow-lg w-full max-w-lg">
      <div class="border-b border-slate-700 px-6 py-4">
        <h3 class="text-lg font-medium text-white">{{ isEditing ? 'Modifier la séance' : 'Créer une séance' }}</h3>
      </div>
      <form @submit.prevent="submitForm">
        <div class="p-6 space-y-4">
          
          <div>
            <label class="block text-sm font-semibold mb-1 text-slate-300">Film</label>
            <select v-model="form.movieId" required class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
              <option v-if="moviesStore.loading">Chargement...</option>
              <option v-for="movie in moviesStore.movies" :key="movie.id" :value="movie.id">
                {{ movie.title }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1 text-slate-300">Date</label>
              <input v-model="form.dateSeance" type="date" required class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1 text-slate-300">Horaire (HH:MM)</label>
              <input v-model="form.hourStart" type="time" required class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold mb-1 text-slate-300">ID de la Salle</label>
              <input v-model="form.salleId" type="text" placeholder="Ex: SALLE_01" required class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1 text-slate-300">Capacité</label>
              <input v-model="form.numberPlace" type="number" min="0" required class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1 text-slate-300">Prix (€)</label>
              <input v-model="form.price" type="number" min="0" step="0.01" required class="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition" />
            </div>
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
            <span v-else><i class="fa-solid fa-spinner animate-spin"></i></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useSessionsStore } from '@/stores/sessions.store';
import { useMoviesStore } from '@/stores/movies.store';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  session: { type: Object, default: null }
});

const emit = defineEmits(['update:modelValue']);

const sessionsStore = useSessionsStore();
const moviesStore = useMoviesStore();
const form = ref({});
const error = ref('');
const loading = ref(false);

const isEditing = computed(() => !!props.session);

// Fetch movies when the component is mounted to populate the dropdown
onMounted(() => {
  if (moviesStore.movies.length === 0) {
    moviesStore.fetchMovies();
  }
});

// Watch for the modal opening and set the form data
watch(() => props.modelValue, (newValue) => {
  error.value = '';
  if (newValue) {
    if (isEditing.value) {
      // For editing, we map the entity to the form model
      form.value = { 
        ...props.session,
        movieId: props.session.movieId // Assuming the entity has movieId
      };
    } else {
      // For creating, we initialize with backend-aligned keys
      form.value = {
        movieId: null,
        dateSeance: new Date().toISOString().split('T')[0],
        hourStart: '14:00',
        salleId: '',
        numberPlace: 100,
        price: 9.99
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
  
  // Find the selected movie to get its title
  const selectedMovie = moviesStore.movies.find(m => m.id === form.value.movieId);
  if (!selectedMovie) {
    error.value = 'Veuillez sélectionner un film valide.';
    loading.value = false;
    return;
  }

  // Construct the payload that matches the backend DTO
  const payload = {
    nameMovie: selectedMovie.title,
    numberPlace: form.value.numberPlace,
    hourStart: form.value.hourStart,
    dateSeance: form.value.dateSeance,
    salleId: form.value.salleId,
    price: form.value.price,
  };

  try {
    if (isEditing.value) {
      // Note: The update payload might need adjustments similar to create
      await sessionsStore.updateSession(form.value.id, payload);
    } else {
      await sessionsStore.createSession(payload);
    }
    closeModal();
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Une erreur est survenue.';
  } finally {
    loading.value = false;
  }
}
</script>
