import { GameDTO } from "../dto/game.dto";
import { CreateGameBody } from "../interfaces/createGameBody";
import { Game } from "../models/game.model";


export class GameService {
 
    async createGame(game: CreateGameBody): Promise<GameDTO>{
        return await Game.create({creation_date: Date.now(), owner_color: game.ownerColor, public: game.isPublic, owner_id: game.owner_id})
    }

}

export const gameService = new GameService();

/*

createGame(1);

let game = getGame(1);

if(game){
    let returnAction: ReturnAction = { success: true, result: [], listCase: game.listCase, turn: game.turn, pieceKilled: game.pieceKilled }

    const result = movePiece(game, 6, 0, 5, 0);

    if(!result.success){
        returnAction.success = false;
        console.log("impossible de deplacer la piece")
        // return returnAction;
    }
    returnAction.result.push(result.result)

    game.listCase.forEach(element=>{
        element.forEach(c =>{
            if(c.piece && c.piece.pieceType == 'KING'){
                const r = checkKingStatus(game.listCase, c.piece);
                returnAction.result.push(r.status+":"+r.king.color);
                if(r.status == 'KINGLOSE'){
                    deleteGame(1);
                }
            }
        })
    })

    //return returnAction;

   
}

// 404 game not found

interface ReturnAction{
    success: boolean,
    result: string[],
    listCase: Case[][]
    turn: Color,
    pieceKilled: Piece[]
}
    */