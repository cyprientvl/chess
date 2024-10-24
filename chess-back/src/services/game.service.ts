import { GameDTO } from "../dto/game.dto";
import { Color } from "../enums/color.enum";
import { CreateGameBody } from "../interfaces/createGameBody";
import { InsertActionBody } from "../interfaces/insertActionBody.interface";
import { Game } from "../models/game.model";


export class GameService {
 
    async createGame(game: CreateGameBody): Promise<GameDTO>{
        return await Game.create({creation_date: Date.now(), owner_color: game.ownerColor, public: game.isPublic, owner_id: game.owner_id})
    }

    async addAction(requestBody: InsertActionBody, id: number){


        
    }

}

export const gameService = new GameService();
