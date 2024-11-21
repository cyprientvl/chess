import { checkKingStatus, movePiece } from "../algorithm/algorithm";
import { createGameStorage, deleteGameStorage, getGameStorage } from "../algorithm/chessStorage";
import { Color } from "../enums/color.enum";
import { PieceType } from "../enums/piece.enum";
import { CreateGameBody } from "../interfaces/createGameBody.interface";
import { MovePiece } from "../interfaces/movePiece.interface";
import { ReturnAction } from "../interfaces/returnAction.interface";
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
      

    async movePiece(userId: number, movePieceBody: MovePiece){
        let game = getGameStorage(userId);
        if(game){
            let returnAction: ReturnAction = { success: true, result: [], listCase: game.getListCase(), turn: game.getUserTurn(), pieceKilled: game.getPieceKilled() }

            const result = movePiece(game, movePieceBody.i, movePieceBody.j, movePieceBody.toI, movePieceBody.toJ);

            if(!result.success){
                returnAction.success = false;
                return returnAction;
            }

            returnAction.result.push(result.result)

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

    upgradePiece(userId: number, piece: PieceType){
        
        const game = getGameStorage(userId);

        if(!game) return {success: false}
        
        if(game.isPieceToPromote() && piece != PieceType.PAWN){

            let pieceToPromote = game.getPieceToPromote();
            const index = game.getPieceKilled().findIndex(p => p.color == pieceToPromote.color && piece == p.pieceType);
            
            if(index == -1) return {success: false}
            game.getPieceKilled().slice(index);

            let p = game.getListCase()[pieceToPromote.i][pieceToPromote.j].piece;
            if(!p) return {success: false}
            p.pieceType = piece;

            game.setPieceToPromote(-1, -1, Color.WHITE)
            return {success: true}
        }

        return {success: false}

    }
}

export const gameService = new GameService();


