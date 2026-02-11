import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

const API_BASE_URL = "http://localhost:3030"; // URL de base de l'API gateway

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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
// --- Intercepteur de RÉPONSE ---
// Gère le renouvellement du token et les erreurs 401

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || "";
    const authStore = useAuthStore(); // Get the store instance here

    // ✅ CAS 1 : ERREUR LOGIN / REGISTER → on laisse passer
    if (
      status === 401 &&
      (url.includes("auth/login") || url.includes("auth/register"))
    ) {
      return Promise.reject(error);
    }

    // ✅ CAS 2 : TOKEN EXPIRÉ SUR UNE ROUTE PROTÉGÉE
    if (status === 401 && !originalRequest._retry) {
      // Éviter la boucle infinie : si on est déjà en train de se déconnecter, on arrête
      if (url.includes("auth/logout")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      await authStore.logout();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default http;
