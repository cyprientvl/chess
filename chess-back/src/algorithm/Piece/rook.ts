import { PieceType } from "../../enums/piece.enum";
import { Piece } from "./piece";
import { Case } from "../case";

export class Rook extends Piece{
    move(toI: number, toJ: number, listCase: Case[][]): boolean {
        console.log("move rook")
        console.log(toI, toJ, this.i, this.j);
        if (this.i !== toI && this.j !== toJ) {
            return false;
        }

        const stepI = toI === this.i ? 0 : (toI > this.i ? 1 : -1); 
        const stepJ = toJ === this.j ? 0 : (toJ > this.j ? 1 : -1); 

        let currentI = this.i + stepI;
        let currentJ = this.j + stepJ;

        while (currentI !== toI || currentJ !== toJ) {
            if (listCase[currentI][currentJ].piece) {
                return false;
            }
            currentI += stepI;
            currentJ += stepJ;
        }

        return true;


    }

    constructor(pieceType: PieceType, color: number, i: number, j: number){
        super(pieceType, color, i, j);
    }
}