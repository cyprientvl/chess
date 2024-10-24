import { GameDTO } from "../dto/game.dto";
import { CreateGameBody } from "../interfaces/createGameBody";
import { Game } from "../models/game.model";


export class GameService {
 
    async createGame(game: CreateGameBody): Promise<GameDTO>{
        return await Game.create({creation_date: Date.now(), owner_color: game.ownerColor, public: game.isPublic, owner_id: game.owner_id})
    }

}

export const gameService = new GameService();
