import axiosInstance from '@/config/AxiosConfig';
import { API_URL_CONNECTION, API_URL_USERS } from '@/constants/ApiUrl';
import type { EditUserDTO } from '@/modelDTO/EditUser.dto';
import type { UserDTO } from '@/modelDTO/User.dto';

export function useUserApi() {
  return {
    async authenticate(user: UserDTO): Promise<string> {
      const res = await axiosInstance.post<{ token: string }>(`${API_URL_CONNECTION}`, {
        grant_type: 'password',
        username: user.username,
        password: user.password
      });
      return res.data.token;
    },
    async register(user: UserDTO): Promise<void> {
      await axiosInstance.post(`${API_URL_USERS}`, user);
    },
    async editUser(user: EditUserDTO): Promise<void> {
      await axiosInstance.patch(`${API_URL_USERS}`, user);
    }
  }
}
