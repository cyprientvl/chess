import axiosInstance from '@/config/AxiosConfig';
import { ApiUrlConnection } from '@/constants/ApiUrl';
import type { UserDTO } from '@/modelDTO/User.dto';

export function useUserApi() {
  return {
    async authenticate(user: UserDTO): Promise<string> {
      const res = await axiosInstance.post<{ token: string }>(`${ApiUrlConnection}`, {
        grant_type: 'password',
        username: user.username,
        password: user.password
      });
      return res.data.token;
    }
  }
}
