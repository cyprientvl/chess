import { Color } from "../enums/color.enum";
import { Case } from "./case";
import { Game } from "./game";
import { King } from "./Piece/king";

export function checkKingStatus(listCase: Case[][], king: King): { king: King, status: string } {
    if (isKingThreatened(listCase, king)) {
        if (canKingMove(listCase, king)) {
            return { king: king, status: "KINGMOVE" }; 
        } else {
            return { king: king, status: "KINGLOSE" };
        }
    }
    return { king: king, status: "KINGSAFE" };
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

function isInBounds(i: number, j: number): boolean {
    return i >= 0 && i < 8 && j >= 0 && j < 8;
}

function isOccupiedByOwnPiece(listCase: Case[][], king: King, i: number, j: number): boolean {
    const piece = listCase[i][j].piece;
    return piece != undefined && piece.color === king.color;
}

function nextTurn(game: Game){
    if(game.turn == 'WHITE') game.turn = Color['BLACK'];
    if(game.turn == 'BLACK') game.turn = Color['WHITE'];
}

export function movePiece(game: Game, i: number, j: number, toI: number, toJ: number): { success: boolean, result: string }{

    if(!isInBounds(i, j) || !isInBounds(toI, toJ)){
        return {success: false, result: ''}
    }

    if(i == toI && j == toJ){
        return {success: false, result: ''}
    }

    let piece = game.listCase[i][j].piece
    if(!piece || piece.color != game.turn) return {success: false, result: ''}
    
    if(piece.move(toI, toJ, game.listCase)){

        let p = game.listCase[toI][toJ].piece;

        if(p){
            if(p.color == piece.color){
                return {success: false, result: ''}
            }
            game.pieceKilled.push(p);
            game.listCase[i][j].piece = undefined;
            game.listCase[toI][toJ].piece = piece;
            nextTurn(game);
            return {success: true, result: 'KILLED'}

        }else{
            game.listCase[i][j].piece = undefined;
            game.listCase[toI][toJ].piece = piece;
            nextTurn(game);
            return {success: true, result: 'MOVE'}
        }
    }

    return {success: false, result: ''}
}