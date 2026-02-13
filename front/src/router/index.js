import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

// Pages
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage.vue'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage.vue'
import PublicMoviesPage from '@/pages/PublicMoviesPage.vue'
import PricingPage from '@/pages/PricingPage.vue'
import MovieDetailPage from '@/pages/MovieDetailPage.vue'
import SeancePage from '@/pages/SeancesPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'

// Admin Pages
import AdminDashboardPage from '@/pages/admin/DashboardPage.vue'
import AdminMoviesPage from '@/pages/admin/MoviesPage.vue'
import AdminSessionsPage from '@/pages/admin/SessionsPage.vue'
import AdminUsersPage from '@/pages/admin/UsersPage.vue'

// Client Pages
import ClientBookingPage from '@/pages/client/BookingPage.vue'
import ClientMyBookingsPage from '@/pages/client/MyBookingsPage.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
        meta: { requiresAuth: false }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { requiresAuth: false }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage,
        meta: { requiresAuth: false }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPasswordPage,
        meta: { requiresAuth: false }
    },
    {
        path: '/reset/:token',
        name: 'ResetPassword',
        component: ResetPasswordPage,
        meta: { requiresAuth: false }
    },
    {
        path: '/films',
        name: 'PublicMovies',
        component: PublicMoviesPage,
        meta: { requiresAuth: false }
    },
    {
        path: '/film/:id',
        name: 'MovieDetail',
        component: MovieDetailPage,
        meta: { requiresAuth: false }
    },
    {
        path: '/tarifs',
        name: 'Pricing',
        component: PricingPage,
        meta: { requiresAuth: false }
    },
    {
        path: '/seances',
        name: 'Seances',
        component: SeancePage,
        meta: { requiresAuth: false }
    },
    {
        path: '/reserver/:sessionId',
        name: 'Reservation',
        component: ClientBookingPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/profil',
        name: 'Profile',
        component: ProfilePage,
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        redirect: '/admin/dashboard',
        meta: { requiresAuth: true, requiredRole: 'admin' }
    },
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboardPage,
        meta: { requiresAuth: true, requiredRole: 'admin' }
    },
    {
        path: '/admin/movies',
        name: 'AdminMovies',
        component: AdminMoviesPage,
        meta: { requiresAuth: true, requiredRole: 'admin' }
    },
    {
        path: '/admin/sessions',
        name: 'AdminSessions',
        component: AdminSessionsPage,
        meta: { requiresAuth: true, requiredRole: 'admin' }
    },
    {
        path: '/admin/users',
        name: 'AdminUsers',
        component: AdminUsersPage,
        meta: { requiresAuth: true, requiredRole: 'admin' }
    },
    {
        path: '/client',
        redirect: '/client/booking',
        meta: { requiresAuth: true }
    },
    {
        path: '/client/booking',
        name: 'ClientBooking',
        component: ClientBookingPage,
        meta: { requiresAuth: true }
    },
    {
        path: '/client/my-bookings',
        name: 'ClientMyBookings',
        component: ClientMyBookingsPage,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation guards for authentication and authorization
router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Si un token existe mais que l'utilisateur n'est pas authentifié, réessayer d'initialiser
    const token = localStorage.getItem('token')
    if (token && !authStore.isAuthenticated && !authStore.loading) {
        try {
            await authStore.initializeAuth()
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error)
        }
    }

    const requiresAuth = to.meta.requiresAuth !== false
    const requiredRole = to.meta.requiredRole

    // Redirect to login if route requires auth and user is not authenticated
    if (requiresAuth && !authStore.isAuthenticated) {
        next('/login')
        return
    }

    // Check role-based access
    if (requiredRole === 'admin' && authStore.isAuthenticated && !authStore.isAdmin) {
        next('/')
        return
    }

    if (requiredRole === 'client' && authStore.isAuthenticated && !authStore.isClient) {
        next('/')
        return
    }

    next()
})

export default router
