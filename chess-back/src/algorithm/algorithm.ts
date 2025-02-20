import { Action } from "../enums/action.enum";
import { Color } from "../enums/color.enum";
import { PieceType } from "../enums/piece.enum";
import { FormatedGame } from "../interfaces/formatedGame.interface";
import { MovePieceResult } from "../interfaces/movePieceResult.interface";
import { GameAction } from "../models/gameAction.model";
import { deleteGameStorage, getGameStorage } from "./chessStorage";
import { Game } from "./game";
import { King } from "./Piece/king";
import { Pawn } from "./Piece/pawn";
import { Game as GameModel } from "../models/game.model";
import { Piece } from "./Piece/piece";
import { Bishop } from "./Piece/bishop";
import { Rook } from "./Piece/rook";
import { Knight } from "./Piece/knight";
import { Queen } from "./Piece/queen";


export function isInBounds(i: number, j: number): boolean {
    return i >= 0 && i < 8 && j >= 0 && j < 8;
}

export function movePiece(game: Game, i: number, j: number, toI: number, toJ: number): MovePieceResult{

    if(!isInBounds(i, j) || !isInBounds(toI, toJ)) return {success: false, result: []};

    if(i == toI && j == toJ) return {success: false, result: []};
    
    let listCase = game.getListCase();
    let piece = listCase[i][j].piece

    if(!piece || piece.color != game.getUserTurn()) return {success: false, result: []}
    
    if(!piece.move(toI, toJ, listCase)) return {success: false, result: []}

    if(piece instanceof King){
        let c = piece.color == Color.BLACK ? 0: 1;
        let copyPiece = new King(piece.pieceType, c, piece.i, piece.j)        

        copyPiece.i = toI
        copyPiece.j = toJ

        let p1 = listCase[toI][toJ].piece;
        let p2 = listCase[i][j].piece

        listCase[toI][toJ].piece = copyPiece;
        listCase[i][j].piece = undefined;

        if(copyPiece instanceof King){
            const checkKIngStatus = King.checkKingStatus(listCase, copyPiece);

            listCase[toI][toJ].piece = p1;
            listCase[i][j].piece = p2;

            if(checkKIngStatus.status != Action.KINGSAFE) return {success: false, result: []};
        }
    }else{
        let pCopy = listCase[toI][toJ].piece;
        if(pCopy){
            if(pCopy.color == piece.color){
                return {success: false, result: []}
            }
        }
    
        listCase[i][j].piece = undefined;
        listCase[toI][toJ].piece = piece;
        
        piece.i = toI;
        piece.j = toJ;

        const r = verifyKingBeforeMove(game);

        listCase[i][j].piece = piece;
        listCase[toI][toJ].piece = pCopy;
        piece.i = i;
        piece.j = j;

        if(!r) return {success: false, result: []};
    }


    let p = listCase[toI][toJ].piece;

    let resultAction = [];
    
    if(p){
        if(p.color == piece.color){
            return {success: false, result: []}
        }
        game.getPieceKilled().push(p);
        resultAction.push(Action['KILLED']+":"+p.pieceType+":"+p.color)
    }else{
        resultAction.push(Action['MOVE'])
    }

    listCase[i][j].piece = undefined;
    listCase[toI][toJ].piece = piece;
    
    piece.i = toI;
    piece.j = toJ;


    return {success: true, result: resultAction}
}

export function checkTowerUpgrade(game: Game, i: number, j: number): string {
    const piece = game.getListCase()[i][j].piece;
    
    if (!piece || !(piece instanceof Pawn)) return Action['NOPROMOTION'];
    
    let pieceKilled = game.getPieceKilledByColor(game.getUserTurn()).filter(e => e.pieceType != PieceType.PAWN);
    
    if(pieceKilled.length == 0) return Action['NOPROMOTION']; 

    if (game.getUserTurn() == Color.WHITE && i == 0) {
        game.setPieceToPromote(i, j, Color.WHITE);
        return Action['WHITEPROMOTION']
    }
    if (game.getUserTurn() == Color.BLACK && i == 7) {
        game.setPieceToPromote(i, j, Color.BLACK);
        return Action['BLACKPROMOTION']
    }
    
    return Action['NOPROMOTION'];
}

export async function upgradePiece(userId: number, piece: PieceType): Promise<FormatedGame>{
    const game = getGameStorage(userId);

    if(!game) return {success: false}

    if(game.isPieceToPromote() && piece != PieceType.PAWN){

        let pieceToPromote = game.getPieceToPromote();
        const index = game.getPieceKilled().findIndex(p => p.color == pieceToPromote.color && piece == p.pieceType);

        if(index == -1){
            let returnAction = game.getFormatedGame();
            return {...returnAction, success: false};
        }

        let pieceKilled = game.getPieceKilled();
        pieceKilled.splice(index, 1);
        game.setPieceKilled(pieceKilled);

        let p = game.getListCase()[pieceToPromote.i][pieceToPromote.j].piece;
        if(!p) return {success: false}
        p.pieceType = piece;
        let newPiece = generatePieceClassByType(p, p.pieceType);
        game.getListCase()[pieceToPromote.i][pieceToPromote.j].piece = newPiece;

        const gameAction = await GameAction.findOne({where: {game_id: game.getIdInDB()}, order: [['id', 'DESC']], limit: 1})
        if(gameAction){
            gameAction.piece = piece + ":" + pieceToPromote.color;
            await gameAction.save();
        }

        game.setPieceToPromote(-1, -1, Color.WHITE)

        let returnAction = game.getFormatedGame();
        return {...returnAction, success: true};
    }
    let returnAction = game.getFormatedGame();
    return {...returnAction, success: false};

}


export function verifyKingBeforeMove(game: Game): boolean{
    let result = false;
    game.getListCase().forEach(element=>{
        element.forEach(c =>{
            if(c.piece && c.piece.pieceType == 'KING' && c.piece.color == game.getUserTurn()){
                const r = King.checkKingStatus(game.getListCase(), c.piece);
                result = r.status == Action.KINGSAFE
            }
        })
    })
    return result;
}

export function verifyPieceToPromote(game: Game): string{
    if(game.isPieceToPromote()){
        let action = "PROMOTION:" + game.getPieceToPromote().color;
        return action
    }
    return "NOPROMOTION"
}

export function verifyKingStatus(game: Game, userId: number): string[]{
    let returnAction: string[] = [];

    game.getListCase().forEach(element=>{
        element.forEach(async c =>{
            if(c.piece && c.piece.pieceType == 'KING'){
                const r = King.checkKingStatus(game.getListCase(), c.piece);
                returnAction.push(r.status+":"+r.king.color);
                if(r.status == 'KINGLOSE'){
                
                    deleteGameStorage(userId);
                }
            }
        })
    })
    return returnAction;
}

function generatePieceClassByType(piece: Piece, type: string){
    let p: Piece = new Bishop(PieceType.BISHOP, piece.color == "BLACK" ? 0:1, piece.i, piece.j);

    switch (type) {
        case "ROOK":
            p = new Rook(PieceType.ROOK, piece.color == "BLACK" ? 0:1, piece.i, piece.j);
            break;
        case "PAWN":
            p = new Pawn(PieceType.PAWN, piece.color == "BLACK" ? 0:1, piece.i, piece.j);
            break;
        case "KNIGHT":
            p = new Knight(PieceType.KNIGHT, piece.color == "BLACK" ? 0:1, piece.i, piece.j);
            break;
        case "QUEEN":
            p = new Queen(PieceType.QUEEN, piece.color == "BLACK" ? 0:1, piece.i, piece.j);
            break;
        case "KING":
            p = new King(PieceType.KING, piece.color == "BLACK" ? 0:1, piece.i, piece.j);
            break;
        default:
            break;
    }

    return p;
}