import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './tailwind.css'
import { useAuthStore } from '@/stores/auth.store'

const app = createApp(App)

app.use(createPinia())

// Initialize auth store before mounting the app
const authStore = useAuthStore()
authStore.initializeAuth()

app.use(router)

app.mount('#app')
