import type { LeaderboardModel } from '@/model/Leaderboard.model';
import { useLeaderboardApi } from './leaderboardApi';
import type { HistoryModel } from '@/model/History.model';

const leaderboardApi = useLeaderboardApi();
export function useLeaderboardService() {
  return {
    async getLeaderboard(): Promise<LeaderboardModel[]> {
      return leaderboardApi.leaderboard();
    },
    async getHistory(): Promise<HistoryModel[]> {
      return leaderboardApi.history();
    },
    async getUserHistory(userId: number): Promise<HistoryModel[]> {
      return leaderboardApi.historyUser(userId);
    }
  };
}
