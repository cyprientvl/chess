import axiosInstance from '@/config/AxiosConfig';
import { ApiUrlCreateGame, ApiUrlGameIDUser, ApiUrlPieceMove, ApiUrlGame } from '@/constants/ApiUrl';
import type { GameMoveDTO } from '@/modelDTO/GameMove.dto';
import type { GameModel } from '@/model/Game.model';
import type { CreateGameDTO } from '@/modelDTO/CreateGame.dto';

export function useGameApi() {
  return {
    async move(move: GameMoveDTO): Promise<GameModel> {
      const res = await axiosInstance.post<GameModel>(`${ApiUrlGame}${ApiUrlPieceMove}`, move);
      return res.data;
    },
    async getCurrentGameID(): Promise<{ gameId: number }> {
      const res = await axiosInstance.get<{ gameId: number }>(`${ApiUrlGame}${ApiUrlGameIDUser}`);
      return res.data;
    },
    async createGame(game: CreateGameDTO): Promise<{ gameId: number }> {
      const res = await axiosInstance.post<{ gameId: number }>(`${ApiUrlGame}${ApiUrlCreateGame}`, game);
      return res.data;
    },
    async getCurrentGame(): Promise<GameModel> {
      const res = await axiosInstance.get<GameModel>(`${ApiUrlGame}`);
      return res.data;
    }
  };
}
