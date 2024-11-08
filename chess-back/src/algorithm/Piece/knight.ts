import { PieceType } from "../../enums/piece.enum";
import { Piece } from "./piece";
import { Case } from "../case";

export class Knight extends Piece{
    move(toI: number, toJ: number, listCase: Case[][]): boolean {

        const diffI = Math.abs(toI - this.i);
        const diffJ = Math.abs(toJ - this.j);
         return (diffI === 2 && diffJ === 1) || (diffI === 1 && diffJ === 2);
    }

    constructor(pieceType: PieceType, color: number, i: number, j: number){
        super(pieceType, color, i, j);
    }
}