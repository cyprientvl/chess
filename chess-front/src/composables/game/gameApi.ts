import axiosInstance from '@/config/AxiosConfig';
import { ApiUrlCreateGame, ApiUrlGameIDUser, ApiUrlPieceMove, ApiUrlGame, ApiUrlPossibleMove, ApiUrlPromote } from '@/constants/ApiUrl';
import type { GameMoveDTO } from '@/modelDTO/GameMove.dto';
import type { GameModel } from '@/model/Game.model';
import type { CreateGameDTO } from '@/modelDTO/CreateGame.dto';
import type { PossibleMoveDTO } from '@/modelDTO/PossibleMove.dto';
import type { PossibleMove } from '@/model/PossibleMove.model';
import type { GlobalPieceType } from '@/model/Game.model';

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
    },
    async getPossibleMoves(move: PossibleMoveDTO): Promise<PossibleMove[]> {
      const res = await axiosInstance.post<PossibleMove[]>(`${ApiUrlGame}${ApiUrlPossibleMove}`, move);
      return res.data;
    },
    async promote(piece: GlobalPieceType): Promise<{ success: boolean }> {
      const res = await axiosInstance.post<{ success: boolean }>(`${ApiUrlGame}${ApiUrlPromote}`, { piece });
      return res.data;
    }
  };
}
