import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './tailwind.css'
import { useAuthStore } from '@/stores/auth.store'

const app = createApp(App)

app.use(createPinia())
app.use(router)

async function initializeApp() {
  const authStore = useAuthStore()
  try {
    // Wait for the initial authentication check to complete
    await authStore.initializeAuth()
  } catch (error) {
    console.error("Failed to initialize authentication state:", error)
    // Even if auth fails, we still need to mount the app,
    // as unauthenticated routes might be accessible.
  } finally {
    // Wait for the router to be ready before performing initial navigation or mounting
    await router.isReady()

    // Perform initial redirection based on auth status and role
    if (authStore.isAuthenticated) {
      if (authStore.isAdmin) {
        // Only redirect if not already on an admin path
        if (!router.currentRoute.value.path.startsWith('/admin')) {
          router.push('/admin/dashboard')
        }
      } else if (authStore.isClient) { // Assuming non-admin authenticated users are clients
        // Only redirect if not already on a client path
        if (!router.currentRoute.value.path.startsWith('/client')) {
          router.push('/client/my-bookings')
        }
      }
    }
    app.mount('#app')
  }
}

initializeApp()

