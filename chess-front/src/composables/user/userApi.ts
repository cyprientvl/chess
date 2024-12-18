import axiosInstance from '@/config/AxiosConfig';
import { API_URL_CONNECTION, API_URL_REGISTER } from '@/constants/ApiUrl';
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
      await axiosInstance.post(`${API_URL_REGISTER}`, user);
    }
  }
}
