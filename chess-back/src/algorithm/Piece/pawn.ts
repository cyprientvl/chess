import { PieceType } from "../../enums/piece.enum";
import { Piece } from "./piece";
import { Case } from "../case";

export class Pawn extends Piece{
    move(toI: number, toJ: number, listCase: Case[][]): boolean {
        if(this.color == 'WHITE' && toI-1 == this.i && toJ == this.j) return true;
        if(this.color == 'BLACK' && toI+1 == this.i && toJ == this.j) return true;
        return false;
    }

    constructor(pieceType: PieceType, color: number, i: number, j: number){
        super(pieceType, color, i, j);
    }
}