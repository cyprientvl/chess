import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const username = ref<string | null>(localStorage.getItem('username'));
  const isAuthenticated = ref<boolean>(!!localStorage.getItem('token'));
  const loading = ref<boolean>(false);

  const save = (newToken: string, newUsername: string) => {
    token.value = newToken;
    username.value = newUsername;
    isAuthenticated.value = true;
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
  };

  const logout = () => {
    token.value = null;
    username.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return {
    token,
    username,
    isAuthenticated,
    loading,
    save,
    logout
  };
});
