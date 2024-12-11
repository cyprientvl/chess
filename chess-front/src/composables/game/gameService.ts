import { useGameApi } from './gameApi';
import type { GameMoveDTO } from '@/modelDTO/GameMove.dto';
import type { GameModel } from '@/model/Game.model';
import type { PossibleMoveDTO } from '@/modelDTO/PossibleMove.dto';
import type { CreateGameDTO } from '@/modelDTO/CreateGame.dto';
import type { PossibleMove } from '@/model/PossibleMove.model';
import type { PieceType } from '@/model/Pieces.model';
import type { ChessReplay } from '@/model/Replay.model';

const gameApi = useGameApi();
export function useGameService() {
  return {
    async move(move: GameMoveDTO): Promise<GameModel> {
      return gameApi.move(move);
    },
    async getCurrentGameID(): Promise<{ gameId: number }> {
      return gameApi.getCurrentGameID();
    },
    async createGame(game: CreateGameDTO): Promise<{ gameId: number }> {
      return gameApi.createGame(game);
    },
    async getCurrentGame(): Promise<GameModel> {
      return gameApi.getCurrentGame();
    },
    async getPossibleMoves(position: PossibleMoveDTO): Promise<PossibleMove[]> {
      return gameApi.getPossibleMoves(position);
    },
    async promote(piece: PieceType): Promise<GameModel> {
      return gameApi.promote(piece);
    },
    async deleteGame(): Promise<{ success: boolean }> {
      return gameApi.deleteGame();
    },
    async getReplay(gameId: number): Promise<ChessReplay> {
      return gameApi.getReplay(gameId);
    }
  };
}
