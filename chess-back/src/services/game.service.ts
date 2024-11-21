import { checkKingStatus, movePiece } from "../algorithm/algorithm";
import { Case } from "../algorithm/case";
import { createGameStorage, deleteGameStorage, getGameStorage } from "../algorithm/chessStorage";
import { Piece } from "../algorithm/Piece/piece";
import { GameDTO } from "../dto/game.dto";
import { Color } from "../enums/color.enum";
import { CreateGameBody } from "../interfaces/createGameBody";
import { MovePiece } from "../interfaces/movePiece.interface";
import { Game } from "../models/game.model";
import { GameAction } from "../models/gameAction.model";


export class GameService {
 
    async createGame(game: CreateGameBody, userId: number){

        const g = createGameStorage(userId);

        if(!g){
            return undefined;
        }

        const createdGame = await Game.create({owner_id: userId, creation_date: Date.now(), owner_color: game.ownerColor, public: game.isPublic})
        
        g.setOwnerColor(game.ownerColor);
        g.setIdInBd(createdGame.id);
        
        return createdGame;
    }

    async getGame(userId: number){
        const game = getGameStorage(userId);
        if(!game) return undefined;
        return game.get();
    } 

    async getMove(gameId: number, idMove: number) {
        const game = await Game.findByPk(gameId, {
          include: [{ model: GameAction, as: 'gameAction' }]
        });
      
        if (!game || !game.public) {
          return null;
        }
      
        const gameActions = game.gameAction;

        if(!gameActions) return null;
        
        const moveAction = gameActions.find(action => action.id === idMove);
      
        if(!moveAction) return null;

        return {i: moveAction.from.split(":")[0],
            j: moveAction.from.split(":")[1],
            toI: moveAction.to.split(":")[0],
            toJ: moveAction.to.split(":")[1]
        }
      }
      

    async move(userId: number, movePieceBody: MovePiece){
        let game = getGameStorage(userId);
        console.log("game")
        if(game){
            let returnAction: ReturnAction = { success: true, result: [], listCase: game.listCase, turn: game.turn, pieceKilled: game.pieceKilled }

            const result = movePiece(game, movePieceBody.i, movePieceBody.j, movePieceBody.toI, movePieceBody.toJ);

            if(!result.success){
                returnAction.success = false;
                console.log("impossible de deplacer la piece")
                return returnAction;
            }
            console.log("success")

            returnAction.result.push(result.result)

            game.listCase.forEach(element=>{
                element.forEach(c =>{
                    if(c.piece && c.piece.pieceType == 'KING'){
                        const r = checkKingStatus(game.listCase, c.piece);
                        returnAction.result.push(r.status+":"+r.king.color);
                        if(r.status == 'KINGLOSE'){
                            deleteGameStorage(userId);
                        }
                    }
                })
            })
            console.log("insert")

            await GameAction.create({game_id: userId, 
                from: movePieceBody.i+":"+movePieceBody.j, 
                piece: "", 
                to: movePieceBody.toI+":"+movePieceBody.toJ, 
                result: returnAction.result.join(",")}); 

            return returnAction;
        }

        return undefined;
    }

    getUserGameId(userId: number){
        const game = getGameStorage(userId);
        if(!game) return -1;

        return userId; 
    }
}

export const gameService = new GameService();

interface ReturnAction{
    success: boolean,
    result: string[],
    listCase: Case[][]
    turn: Color,
    pieceKilled: Piece[]
}
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


    */