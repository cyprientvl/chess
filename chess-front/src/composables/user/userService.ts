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
    }
  };
}
