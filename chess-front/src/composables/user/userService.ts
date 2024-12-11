import { useUserApi } from './userApi';
import type { UserDTO } from '@/modelDTO/User.dto';
import { useAuthStore } from '@/stores/authStore';

const userApi = useUserApi();
export function useUserService() {
  return {
    async authenticate(user: UserDTO) {
      const authStore = useAuthStore();
      const token = await userApi.authenticate(user);
      authStore.save(token, user.username);
    },
    async register(user: UserDTO) {
      await userApi.register(user);
    },
    getUsername(): string {
      const authStore = useAuthStore();
      if (!authStore.username) {
        throw new Error('No user logged in');
      }
      return authStore.username;
    }
  };
}
