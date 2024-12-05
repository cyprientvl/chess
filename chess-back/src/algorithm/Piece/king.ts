import { PieceType } from "../../enums/piece.enum";
import { Piece } from "./piece";
import { Case } from "../case";
import { ChessLocation } from "../../interfaces/location.interface";
import { Action } from "../../enums/action.enum";
import { isInBounds } from "../algorithm";

export class King extends Piece{
    possibleMove(listCase: Case[][]): ChessLocation[] {
        const moves: ChessLocation[] = [];
        const directions = [
            [-1, -1], [-1, 0], [-1, 1], 
            [0, -1], [0, 1],            
            [1, -1], [1, 0], [1, 1]    
        ];

        for (const [di, dj] of directions) {
            const newI = this.i + di;
            const newJ = this.j + dj;

            if (newI >= 0 && newI < listCase.length && newJ >= 0 && newJ < listCase[0].length) {
                const targetCase = listCase[newI][newJ];
                if (!targetCase.piece || targetCase.piece.color !== this.color) {
                    moves.push({ i: newI, j: newJ });
                }
            }
        }

        return moves;    
    }

    move(toI: number, toJ: number, listCase: Case[][]): boolean {
        const diffI = Math.abs(toI - this.i);
        const diffJ = Math.abs(toJ - this.j);

        return (diffI <= 1 && diffJ <= 1) && !(diffI === 0 && diffJ === 0);
    }

    public static checkKingStatus(listCase: Case[][], king: King): { king: King, status: string } {
        if (this.isKingThreatened(listCase, king)) {
    
            if (this.canKingMove(listCase, king)) {
                return { king: king, status: Action['KINGMOVE'] }; 
            } else {
                return { king: king, status: Action['KINGLOSE'] };
            }
        }
        return { king: king, status: Action['KINGSAFE'] };
    }
    
    public static isKingThreatened(listCase: Case[][], king: King): boolean {
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
    
    public static canKingMove(listCase: Case[][], king: King): boolean {
        const directions = [
            { di: -1, dj: -1 }, { di: -1, dj: 0 }, { di: -1, dj: 1 },
            { di: 0, dj: -1 },                  { di: 0, dj: 1 },
            { di: 1, dj: -1 }, { di: 1, dj: 0 }, { di: 1, dj: 1 }
        ];
    
        for (let { di, dj } of directions) {
            const newI = king.i + di;
            const newJ = king.j + dj;
    
            if (isInBounds(newI, newJ) && !this.isOccupiedByOwnPiece(listCase, king, newI, newJ)) {
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


    public static isOccupiedByOwnPiece(listCase: Case[][], king: King, i: number, j: number): boolean {
        const piece = listCase[i][j].piece;
        return piece != undefined && piece.color === king.color;
    }

    constructor(pieceType: PieceType, color: number, i: number, j: number){
        super(pieceType, color, i, j);
    }
}