import { checkKingStatus, isInBounds, movePiece, upgradePiece } from "../algorithm/algorithm";
import { createGameStorage, deleteGameStorage, getGameStorage } from "../algorithm/chessStorage";
import { GameActionDTO } from "../dto/gameAction.dto";
import { PieceType } from "../enums/piece.enum";
import { CreateGameBody } from "../interfaces/createGameBody.interface";
import { MovePiece } from "../interfaces/movePiece.interface";
import { ReturnAction } from "../interfaces/returnAction.interface";
import { ReturnGameAction } from "../interfaces/returnGameAction.interface";
import { Game } from "../models/game.model";
import { GameAction } from "../models/gameAction.model";


export class GameService {
 
    async createGame(game: CreateGameBody, userId: number){

        const gameStorage = createGameStorage(userId);

        if(!gameStorage) return undefined;
        
        const createdGame = await Game.create({owner_id: userId, creation_date: Date.now(), owner_color: game.ownerColor, public: game.isPublic})
        
        gameStorage.setOwnerColor(game.ownerColor);
        gameStorage.setIdInBd(createdGame.id);
        
        return createdGame;
    }

    async getGame(userId: number){
        const game = getGameStorage(userId);
        if(!game) return undefined;
        return game.getFormatedGame();
    } 

    async getReplay(gameId: number) {
        const game = await Game.findByPk(gameId, {
          include: [{ model: GameAction, as: 'gameAction' }]
        });
      
        if (!game || !game.public) {
          return undefined;
        }
      
        const gameActions = game.gameAction;

        if(!gameActions) return undefined;
        
        let actionList: ReturnGameAction[] = [];

        gameActions.forEach(element =>{
            let i = parseInt(element.from.split(":")[0])
            let j = parseInt(element.from.split(":")[1])
            let toI = parseInt(element.to.split(":")[0])
            let toJ = parseInt(element.to.split(":")[1])

            actionList.push({i: i, j: j, toI: toI, toJ: toJ})
        })
        return actionList;
      }
      

    async movePiece(userId: number, movePieceBody: MovePiece){
        let game = getGameStorage(userId);
        if(game){

            const result = movePiece(game, movePieceBody.i, movePieceBody.j, movePieceBody.toI, movePieceBody.toJ);

            let returnAction: ReturnAction = { success: true, result: [], 
                listCase: game.getListCase(), 
                turn: game.getUserTurn(), 
                pieceKilled: game.getPieceKilled() }

            if(!result.success){
                returnAction.success = false;
                return returnAction;
            }

            result.result.forEach(e => returnAction.result.push(e))

            game.getListCase().forEach(element=>{
                element.forEach(c =>{
                    if(c.piece && c.piece.pieceType == 'KING'){
                        const r = checkKingStatus(game.getListCase(), c.piece);
                        returnAction.result.push(r.status+":"+r.king.color);
                        if(r.status == 'KINGLOSE'){
                            deleteGameStorage(userId);
                        }
                    }
                })
            })

            await GameAction.create({game_id: game.getIdInDB(), 
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

    async upgradePiece(userId: number, piece: PieceType){
        return await upgradePiece(userId, piece);
    }

    async delete(userId: number){
        deleteGameStorage(userId);
        return {success: true};
    }


    getPossibleMove(userId: number, i: number, j: number){
        let game = getGameStorage(userId);
        if(!game) return;

        if(!isInBounds(i, j)) return;
        
        let listCase = game.getListCase();
        let piece = listCase[i][j].piece

        if(!piece) return;

        return piece.possibleMove(game.getListCase());
        
    }
}

export const gameService = new GameService();


