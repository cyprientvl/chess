import axiosInstance from '@/config/AxiosConfig';
import { API_URL_CREATE_GAME, API_URL_GAME_ID_USER, API_URL_PIECE_MOVE, API_URL_GAME, API_URL_POSSIBLE_MOVE, API_URL_PROMOTE, API_URL_REPLAY } from '@/constants/ApiUrl';
import type { GameMoveDTO } from '@/modelDTO/GameMove.dto';
import type { GameModel } from '@/model/Game.model';
import type { CreateGameDTO } from '@/modelDTO/CreateGame.dto';
import type { PossibleMoveDTO } from '@/modelDTO/PossibleMove.dto';
import type { PossibleMove } from '@/model/PossibleMove.model';
import type { PieceType } from '@/model/Pieces.model';
import type { ChessReplay } from '@/model/Replay.model';
import type { UpdateGameDTO } from '@/modelDTO/UpdateGame.dto';

export function useGameApi() {
  return {
    async move(move: GameMoveDTO): Promise<GameModel> {
      const res = await axiosInstance.post<GameModel>(`${API_URL_GAME}${API_URL_PIECE_MOVE}`, move);
      return res.data;
    },
    async getCurrentGameID(): Promise<{ gameId: number }> {
      const res = await axiosInstance.get<{ gameId: number }>(`${API_URL_GAME}${API_URL_GAME_ID_USER}`);
      return res.data;
    },
    async createGame(game: CreateGameDTO): Promise<{ gameId: number }> {
      const res = await axiosInstance.post<{ gameId: number }>(`${API_URL_GAME}${API_URL_CREATE_GAME}`, game);
      return res.data;
    },
    async getCurrentGame(): Promise<GameModel> {
      const res = await axiosInstance.get<GameModel>(`${API_URL_GAME}`);
      return res.data;
    },
    async getPossibleMoves(move: PossibleMoveDTO): Promise<PossibleMove[]> {
      const res = await axiosInstance.post<PossibleMove[]>(`${API_URL_GAME}${API_URL_POSSIBLE_MOVE}`, move);
      return res.data;
    },
    async promote(piece: PieceType): Promise<GameModel> {
      const res = await axiosInstance.post<GameModel>(`${API_URL_GAME}${API_URL_PROMOTE}`, { piece });
      return res.data;
    },
    async deleteGame(): Promise<{ success: boolean }> {
      const res = await axiosInstance.delete<{ success: boolean }>(`${API_URL_GAME}`);
      return res.data;
    },
    async getReplay(gameId: number): Promise<ChessReplay> {
      const res = await axiosInstance.get<ChessReplay>(`${API_URL_GAME}${API_URL_REPLAY}/${gameId}`);
      return res.data;
    },
    async updateGamePrivacy(update: UpdateGameDTO): Promise<{ success: boolean }> {
      const res = await axiosInstance.patch<{ success: boolean }>(`${API_URL_GAME}`, update);
      return res.data;
    }
  };
}
