import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

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

    if (status === 401) {
      // Token expired or invalid
      console.warn("Session expirée ou invalide (401). Déconnexion...");
      authStore.logout();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default http;
