import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

let isRefreshing = false;
let failedQueue = [];

const API_BASE_URL = "http://localhost:3030"; // URL de base de l'API gateway

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
})


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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || "";
    const authStore = useAuthStore();

    // ✅ CAS 1 : ERREUR LOGIN / REGISTER → on laisse passer
    if (
      status === 401 &&
      (url.includes("auth/login") || url.includes("auth/register"))
    ) {
      return Promise.reject(error);
    }

    // ✅ CAS 2 : 401 mais token déjà en cours de rafraîchissement
    if (status === 401 && originalRequest._retry) {
      return Promise.reject(error);
    }

    // ✅ CAS 3 : 401 et pas encore de rafraîchissement en cours
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject, originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Supposons une route de rafraîchissement de token existante sur le backend
        // Ou, si le backend n'a pas de route de rafraîchissement explicite,
        // cette partie devrait être adaptée pour re-log l'utilisateur ou le déconnecter.
        // Pour cet exemple, je vais simuler un appel à un endpoint de rafraîchissement.
        // En l'absence d'un vrai endpoint, cela déclenchera un logout.
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`); // Endpoint hypothétique

        const newToken = refreshResponse.data.access_token;
        localStorage.setItem("token", newToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        failedQueue.forEach((promise) => {
          promise.originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          promise.resolve(axios(promise.originalRequest));
        });

        failedQueue = [];
        return axios(originalRequest);
      } catch (refreshError) {
        // Le rafraîchissement du token a échoué, déconnecter l'utilisateur
        console.error("Échec du rafraîchissement du token:", refreshError);
        authStore.logout(); // Appeler la fonction de déconnexion du store
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
)


export default http;
