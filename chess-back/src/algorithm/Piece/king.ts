import { PieceType } from "../../enums/piece.enum";
import { Piece } from "./piece";
import { Case } from "../case";

export class King extends Piece{
    move(toI: number, toJ: number, listCase: Case[][]): boolean {
        const diffI = Math.abs(toI - this.i);
        const diffJ = Math.abs(toJ - this.j);

        return (diffI <= 1 && diffJ <= 1) && !(diffI === 0 && diffJ === 0);
    }

    constructor(pieceType: PieceType, color: number, i: number, j: number){
        super(pieceType, color, i, j);
    }
}