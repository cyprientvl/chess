import axiosInstance from '@/config/AxiosConfig';
import { API_URL_LEADERBOARD_HISTORY, API_URL_LEADERBOARD } from '@/constants/ApiUrl';
import type { HistoryModel } from '@/model/History.model';
import type { LeaderboardModel } from '@/model/Leaderboard.model';

export function useLeaderboardApi() {
  return {
    async leaderboard(): Promise<LeaderboardModel[]> {
      const res = await axiosInstance.get<LeaderboardModel[]>(`${API_URL_LEADERBOARD}`);
      return res.data;
    },
    async connectedUserHistory(): Promise<HistoryModel[]> {
      const res = await axiosInstance.get<HistoryModel[]>(`${API_URL_LEADERBOARD}${API_URL_LEADERBOARD_HISTORY}/me`);
      return res.data;
    },
    async historyUser(userId: number): Promise<HistoryModel[]> {
      const res = await axiosInstance.get<HistoryModel[]>(`${API_URL_LEADERBOARD}${API_URL_LEADERBOARD_HISTORY}/${userId}`);
      return res.data;
    }
  };
}
