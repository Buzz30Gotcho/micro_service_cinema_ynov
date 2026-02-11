import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import authService from "@/api/auth.service";

export const useAuthStore = defineStore("auth", {
  // STATE: User state is now transient (no localStorage)
  state: () => ({
    user: null,
    users: [],
    isAuthenticated: false,
    isAdmin: false,
    loading: false,
    error: null,
  }),

  getters: {
    currentUser: (state) => state.user,
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.login(email, password);
        if (response.data.access_token) {
          localStorage.setItem("token", response.data.access_token);
        }
        await this.fetchProfile();
      } catch (error) {
        this.error =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Email ou mot de passe incorrect";

        this.user = null;
        this.isAuthenticated = false;
        this.isAdmin = false;
        localStorage.removeItem("token");

        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.register(userData);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout(router) {
      this.loading = true;
      try {
        await authService.logout();
      } catch (error) {
        console.error("Erreur lors de la déconnexion API:", error);
      } finally {
        this.user = null;
        this.isAuthenticated = false;
        this.isAdmin = false;
        this.loading = false;
        localStorage.removeItem("token");
        if (router) {
          router.push("/login");
        }
      }
    },

    async forgotPassword(email) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.forgotPassword(email);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async resetPassword(payload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.resetPassword(payload);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchProfile() {
      this.loading = true;
      try {
        const response = await authService.getProfile();
        let userData = response.data.user || response.data;

        if (userData.first_name) {
          userData.firstName = userData.first_name;
          delete userData.first_name;
        }
        if (userData.last_name) {
          userData.lastName = userData.last_name;
          delete userData.last_name;
        }

        this.user = userData;
        this.isAuthenticated = true;
        const role = this.user.role;
        this.isAdmin = role === "admin" || role === "Administrateur";
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        this.user = null;
        this.isAuthenticated = false;
        this.isAdmin = false;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateUser(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.updateUser(userData);
        let updatedUser = response.data.user || response.data;

        if (updatedUser.first_name) {
          updatedUser.firstName = updatedUser.first_name;
          delete updatedUser.first_name;
        }
        if (updatedUser.last_name) {
          updatedUser.lastName = updatedUser.last_name;
          delete updatedUser.last_name;
        }

        this.user = updatedUser;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // --- ACTIONS ADMIN ---
    async adminGetUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.adminGetUsers();
        this.users = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async adminRegister(userData) {
      this.loading = true;
      this.error = null;
      try {
        await authService.adminRegister(userData);
        await this.adminGetUsers(); // Rafraîchir la liste
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async adminUpdateUser(id, userData) {
      this.loading = true;
      this.error = null;
      try {
        await authService.adminUpdate(id, userData);
        await this.adminGetUsers(); // Rafraîchir la liste
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async adminDeleteUser(id) {
      this.loading = true;
      this.error = null;
      try {
        await authService.adminDelete(id);
        await this.adminGetUsers(); // Rafraîchir la liste
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // INITIALIZEAUTH: Always tries to fetch the user profile now
    async initializeAuth() {
      try {
        await this.fetchProfile();
      } catch (error) {
        console.log(
          "Initialisation échouée, aucune session active ou expirée.",
        );
        this.user = null;
        this.isAuthenticated = false;
        this.isAdmin = false;
      }
    },
  },
});
