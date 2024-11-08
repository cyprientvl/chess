import { Piece } from "./piece";
import { Case } from "../case";
import { PieceType } from "../../enums/piece.enum";

export class Bishop extends Piece{
    move(toI: number, toJ: number, listCase: Case[][]): boolean {
        const diffI = toI - this.i;
        const diffJ = toJ - this.j;

        if (Math.abs(diffI) !== Math.abs(diffJ)) {
            return false;
        }

        const stepI = diffI / Math.abs(diffI); 
        const stepJ = diffJ / Math.abs(diffJ); 

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
