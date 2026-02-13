import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import router from "@/router"; // Importez l'instance du routeur

let isRefreshing = false;
let failedQueue = [];

const API_BASE_URL = "http://localhost:3030"; // URL de base de l'API gateway

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

// --- Intercepteur de REQUÊTE ---
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- Intercepteur de RÉPONSE ---
// Gère le renouvellement du token et les erreurs 401

http.interceptors.response.use(
  (response) => {
    // Check for new token in headers
    const token = response.headers["x-access-token"];
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; // Update default header
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const authStore = useAuthStore();

    if (status === 401 && !originalRequest._retry) {
      // Token expired or invalid - essayer de rafraîchir
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken && !isRefreshing) {
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Appeler la route /refresh avec le refresh_token
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {},
            {
              headers: {
                'Authorization': `Bearer ${refreshToken}`
              }
            }
          );

          const newAccessToken = response.data.access_token;
          localStorage.setItem("token", newAccessToken);

          // Mettre à jour le header de la requête originale
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          isRefreshing = false;

          // Réessayer la requête originale avec le nouveau token
          return http(originalRequest);

        } catch (refreshError) {
          // Le refresh a échoué, déconnecter l'utilisateur
          isRefreshing = false;
          console.warn("Impossible de rafraîchir le token. Déconnexion...");

          authStore.user = null;
          authStore.isAuthenticated = false;
          authStore.isAdmin = false;
          authStore.loading = false;
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");

          router.push("/login").catch(() => { });
          return Promise.reject(refreshError);
        }
      } else {
        // Pas de refresh token ou déjà en train de rafraîchir
        console.warn("Session expirée ou invalide (401). Déconnexion client...");

        authStore.user = null;
        authStore.isAuthenticated = false;
        authStore.isAdmin = false;
        authStore.loading = false;
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");

        router.push("/login").catch(() => { });
      }
    }

    return Promise.reject(error);
  },
);

export default http;
