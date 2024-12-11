import type { LeaderboardModel } from '@/model/Leaderboard.model';
import { useLeaderboardApi } from './leaderboardApi';
import type { HistoryModel } from '@/model/History.model';

const leaderboardApi = useLeaderboardApi();
export function useLeaderboardService() {
  return {
    async getLeaderboard(): Promise<LeaderboardModel[]> {
      return leaderboardApi.leaderboard();
    },
    async getConnectedUserHistory(): Promise<HistoryModel[]> {
      return leaderboardApi.connectedUserHistory();
    },
    async getUserHistory(userId: number): Promise<HistoryModel[]> {
      return leaderboardApi.historyUser(userId);
    }
  };
}
