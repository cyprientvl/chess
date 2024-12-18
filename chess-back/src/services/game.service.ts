import { KoaTemplateService } from "tsoa";
import { checkTowerUpgrade, isInBounds, movePiece, upgradePiece, verifyKingStatus, verifyPieceToPromote } from "../algorithm/algorithm";
import { createGameStorage, deleteGameStorage, getGameStorage } from "../algorithm/chessStorage";
import { Piece } from "../algorithm/Piece/piece";
import { GameActionDTO } from "../dto/gameAction.dto";
import { Action } from "../enums/action.enum";
import { PieceType } from "../enums/piece.enum";
import { ChessReplay } from "../interfaces/chessReplay.interface";
import { CreateGameBody } from "../interfaces/createGameBody.interface";
import { MovePiece } from "../interfaces/movePiece.interface";
import { ReturnAction } from "../interfaces/returnAction.interface";
import { ReturnGameAction } from "../interfaces/returnGameAction.interface";
import { Game } from "../models/game.model";
import { GameAction } from "../models/gameAction.model";
import { User } from "../models/user.model";
import { FormatedGame } from "../interfaces/formatedGame.interface";
import { ChessLocation } from "../interfaces/location.interface";


export class GameService {
 
    async createGame(game: CreateGameBody, userId: number): Promise<Game | undefined>{

        const gameStorage = createGameStorage(userId);

        if(!gameStorage) return undefined;
        
        const createdGame = await Game.create({owner_id: userId, creation_date: Date.now(), owner_color: game.ownerColor, public: game.isPublic})
        
        gameStorage.setOwnerColor(game.ownerColor);
        gameStorage.setIdInBd(createdGame.id);
        
        return createdGame;
    }

    async getGame(userId: number): Promise<FormatedGame | undefined>{
        const game = getGameStorage(userId);
        if(!game) return undefined;
        return game.getFormatedGame();
    } 

    async getReplay(gameId: number): Promise<ChessReplay | undefined> {
        const game = await Game.findByPk(gameId, {
          include: [{ model: GameAction, as: 'gameAction', order: [['id', 'ASC']] }, {model: User, as: 'owner'}]
        });
      
        if (!game || !game.public) {
          return undefined;
        }
      
        const gameActions = game.gameAction;

        if(!gameActions) return undefined;
        
        let actionList: ReturnGameAction[] = [];
        
        let listKilledPiece: any[] = []

        gameActions.forEach((element, index) =>{

            let result = element.result;
            let killedAction = result.split(",").find(e => e.startsWith("KILLED"))

            let i = parseInt(element.from.split(":")[0])
            let j = parseInt(element.from.split(":")[1])
            let toI = parseInt(element.to.split(":")[0])
            let toJ = parseInt(element.to.split(":")[1])

            if(killedAction){
                let pieceType = killedAction.split(":")[1]
                let color = killedAction.split(":")[2]
                listKilledPiece.push({color, pieceType, i: toI, j: toJ})
            }

            

            if(element.piece){
                let piece = element.piece.split(":")[0];
                let color = element.piece.split(":")[1];
                const index = listKilledPiece.findIndex(e => e.color == color && e.pieceType == piece);
                if(index != -1){
                    listKilledPiece.splice(index, 1);
                }
                actionList.push({i: i, j: j, toI: toI, toJ: toJ, 
                    piece: piece, color: color, pieceKilled: [...listKilledPiece],
                    step: index+1
                })
            }else{
                actionList.push({i: i, j: j, toI: toI, toJ: toJ, 
                    piece: undefined, color: undefined, pieceKilled: [...listKilledPiece],
                    step: index+1
                })
            }

        })
        let replay: ChessReplay = { actions: actionList, ownerColor: game.owner_color, ownerUsername: game.owner.username }
        return replay;
      }
      

    async movePiece(userId: number, movePieceBody: MovePiece): Promise<ReturnAction | undefined>{
        let game = getGameStorage(userId);
        if(!game) return undefined

        let actionResult: string[] = []

        const verifyPromote = verifyPieceToPromote(game); 
        actionResult.push(verifyPromote);

        if(verifyPromote != Action.NOPROMOTION){
            return { success: true, result: actionResult, 
                listCase: game.getListCase(), 
                turn: game.getUserTurn(), 
                pieceKilled: game.getPieceKilled() }
        }else{
            actionResult = [];
        }

        const resultMovePiece = movePiece(game, movePieceBody.i, movePieceBody.j, movePieceBody.toI, movePieceBody.toJ);
        resultMovePiece.result.forEach(e => actionResult.push(e))

        const resultCheckTowerUpgrade = checkTowerUpgrade(game, movePieceBody.toI, movePieceBody.toJ);
        actionResult.push(resultCheckTowerUpgrade)

        const kingStatus = verifyKingStatus(game, userId);
        kingStatus.forEach(e => actionResult.push(e))

        let returnAction: ReturnAction = { success: true, result: actionResult, 
            listCase: game.getListCase(), 
            turn: game.getUserTurn(), 
            pieceKilled: game.getPieceKilled() }

        if(!resultMovePiece.success){
            returnAction.success = false;
            return returnAction;
        }

        game.nextTurn();
        returnAction.turn = game.getUserTurn();

        await GameAction.create({game_id: game.getIdInDB(), 
            from: movePieceBody.i+":"+movePieceBody.j, 
            piece: "", 
            to: movePieceBody.toI+":"+movePieceBody.toJ, 
            result: returnAction.result.join(",")}); 

        return returnAction;

    }

    getUserGameId(userId: number): number{
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


    getPossibleMove(userId: number, i: number, j: number): ChessLocation[] | undefined{
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


