import { useGameApi } from './gameApi';
import type { GameMoveDTO } from '@/modelDTO/GameMove.dto';
import type { GameModel } from '@/model/Game.model';
import type { CreateGameDTO } from '@/modelDTO/CreateGame.dto';

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
    }
  };
}
