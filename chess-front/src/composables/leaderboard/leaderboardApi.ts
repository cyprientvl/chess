import axiosInstance from '@/config/AxiosConfig';
import { ApiUrlLeaderboardHistory, ApiUrlLeaderboard } from '@/constants/ApiUrl';
import type { HistoryModel } from '@/model/History.model';
import type { LeaderboardModel } from '@/model/Leaderboard.model';

export function useLeaderboardApi() {
  return {
    async leaderboard(): Promise<LeaderboardModel[]> {
      const res = await axiosInstance.get<LeaderboardModel[]>(`${ApiUrlLeaderboard}`);
      return res.data;
    },
    async history(): Promise<HistoryModel[]> {
      const res = await axiosInstance.get<HistoryModel[]>(`${ApiUrlLeaderboard}${ApiUrlLeaderboardHistory}`);
      return res.data;
    },
    async historyUser(userId: number): Promise<HistoryModel[]> {
      const res = await axiosInstance.get<HistoryModel[]>(`${ApiUrlLeaderboard}${ApiUrlLeaderboardHistory}/${userId}`);
      return res.data;
    }
  };
}
