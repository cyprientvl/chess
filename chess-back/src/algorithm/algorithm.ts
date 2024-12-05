import { Action } from "../enums/action.enum";
import { Color } from "../enums/color.enum";
import { PieceType } from "../enums/piece.enum";
import { MovePiece } from "../interfaces/movePiece.interface";
import { ReturnAction } from "../interfaces/returnAction.interface";
import { GameAction } from "../models/gameAction.model";
import { Case } from "./case";
import { deleteGameStorage, getGameStorage } from "./chessStorage";
import { Game } from "./game";
import { King } from "./Piece/king";
import { Pawn } from "./Piece/pawn";

export function checkKingStatus(listCase: Case[][], king: King): { king: King, status: string } {
    if (isKingThreatened(listCase, king)) {

        if (canKingMove(listCase, king)) {
            return { king: king, status: Action['KINGMOVE'] }; 
        } else {
            return { king: king, status: Action['KINGLOSE'] };
        }
    }
    return { king: king, status: Action['KINGSAFE'] };
}

function isKingThreatened(listCase: Case[][], king: King): boolean {
    for (let row of listCase) {
        for (let c of row) {
            if (c.piece && c.piece.color !== king.color) { 
                if (c.piece.move(king.i, king.j, listCase)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canKingMove(listCase: Case[][], king: King): boolean {
    const directions = [
        { di: -1, dj: -1 }, { di: -1, dj: 0 }, { di: -1, dj: 1 },
        { di: 0, dj: -1 },                  { di: 0, dj: 1 },
        { di: 1, dj: -1 }, { di: 1, dj: 0 }, { di: 1, dj: 1 }
    ];

    for (let { di, dj } of directions) {
        const newI = king.i + di;
        const newJ = king.j + dj;

        if (isInBounds(newI, newJ) && !isOccupiedByOwnPiece(listCase, king, newI, newJ)) {
            let isSafe = true;

            for (let row of listCase) {
                for (let c of row) {
                    if (c.piece && c.piece.color !== king.color && c.piece.move(newI, newJ, listCase)) {
                        isSafe = false;
                        break;
                    }
                }
                if (!isSafe) break;
            }
            if (isSafe) return true; 
        }
    }
    return false; 
}

export function isInBounds(i: number, j: number): boolean {
    return i >= 0 && i < 8 && j >= 0 && j < 8;
}

function isOccupiedByOwnPiece(listCase: Case[][], king: King, i: number, j: number): boolean {
    const piece = listCase[i][j].piece;
    return piece != undefined && piece.color === king.color;
}

function nextTurn(game: Game){
    if(game.getUserTurn() == 'WHITE') return game.setUserTurn(Color['BLACK']);
    if(game.getUserTurn() == 'BLACK') return game.setUserTurn(Color['WHITE']);
}

export function movePiece(game: Game, i: number, j: number, toI: number, toJ: number): { success: boolean, result: string[] }{

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

        if(copyPiece instanceof King){
            const checkKIngStatus = checkKingStatus(listCase, copyPiece);
            if(checkKIngStatus.status != Action.KINGSAFE) return {success: false, result: []};
        }
    }else{
        if(!verifyKingBeforeMove(game)) return {success: false, result: []};
    }

    let p = listCase[toI][toJ].piece;

    let resultAction = [];

    if(p){
        if(p.color == piece.color){
            return {success: false, result: []}
        }
        game.getPieceKilled().push(p);
        resultAction.push(Action['KILLED'])
    }else{
        resultAction.push(Action['MOVE'])
    }

    listCase[i][j].piece = undefined;
    listCase[toI][toJ].piece = piece;
    
    piece.i = toI;
    piece.j = toJ;

    const resultCheckTowerUpgrade = checkTowerUpgrade(game, toI, toJ);
    resultAction.push(resultCheckTowerUpgrade)
    
    nextTurn(game);

    return {success: true, result: resultAction}
}

function checkTowerUpgrade(game: Game, i: number, j: number): string {
    const piece = game.getListCase()[i][j].piece;
    
    if (!piece || !(piece instanceof Pawn)) return Action['NOPROMOTION'];
    
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

export async function upgradePiece(userId: number, piece: PieceType){
        
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

        const gameAction = await GameAction.findOne({where: {game_id: game.getIdInDB()}, order: [['id', 'DESC']], limit: 1})
        if(gameAction){
            gameAction.piece = piece + ":" + pieceToPromote.color;
            await gameAction.save();
        }
        
        game.setPieceToPromote(-1, -1, Color.WHITE)
        return {success: true}
    }

    return {success: false}

}


export function verifyKingBeforeMove(game: Game): boolean{
    let result = false;
    game.getListCase().forEach(element=>{
        element.forEach(c =>{
            if(c.piece && c.piece.pieceType == 'KING' && c.piece.color == game.getUserTurn()){
                const r = checkKingStatus(game.getListCase(), c.piece);
                result = r.status == Action.KINGSAFE
            }
        })
    })
    return result;
}