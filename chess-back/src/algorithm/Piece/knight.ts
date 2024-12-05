import { PieceType } from "../../enums/piece.enum";
import { Piece } from "./piece";
import { Case } from "../case";
import { ChessLocation } from "../../interfaces/location.interface";

export class Knight extends Piece{
    possibleMove(listCase: Case[][]): ChessLocation[] {
        const moves: ChessLocation[] = [];
        const directions = [
            [-2, -1], [-1, -2], [1, -2], [2, -1], 
            [2, 1], [1, 2], [-1, 2], [-2, 1]       
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
         return (diffI === 2 && diffJ === 1) || (diffI === 1 && diffJ === 2);
    }

    constructor(pieceType: PieceType, color: number, i: number, j: number){
        super(pieceType, color, i, j);
    }
}