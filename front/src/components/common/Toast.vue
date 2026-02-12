<template>
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:translate-x-4"
    enter-to-class="opacity-100 translate-y-0 sm:translate-x-0"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="visible" class="fixed bottom-6 right-6 z-50 w-full max-w-sm">
      <div
        :class="[
          'rounded-lg shadow-lg p-4 flex items-start gap-3',
          type === 'success' ? 'bg-green-600/90 text-white' : '',
          type === 'error' ? 'bg-red-600/90 text-white' : ''
        ]"
      >
        <div class="flex-shrink-0 text-xl">
          <CheckCircle v-if="type === 'success'" :size="20" />
          <XCircle v-if="type === 'error'" :size="20" />
        </div>
        <div class="flex-1">
          <p class="font-bold">{{ title }}</p>
          <p class="text-sm opacity-90">{{ message }}</p>
        </div>
        <button @click="$emit('close')" class="flex-shrink-0 opacity-70 hover:opacity-100 transition">
          &times;
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { CheckCircle, XCircle } from 'lucide-vue-next';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'success', // 'success' or 'error'
  },
  duration: {
    type: Number,
    default: 4000,
  }
});

const emit = defineEmits(['close']);

let timer = null;

onMounted(() => {
  if (props.visible) {
    timer = setTimeout(() => {
      emit('close');
    }, props.duration);
  }
});

onUnmounted(() => {
  clearTimeout(timer);
});
</script>
