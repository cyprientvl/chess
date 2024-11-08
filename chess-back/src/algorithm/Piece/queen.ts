import { PieceType } from "../../enums/piece.enum";
import { Piece } from "./piece";
import { Case } from "../case";

export class Queen extends Piece{
    move(toI: number, toJ: number, listCase: Case[][]): boolean {
        const diffI = toI - this.i;
        const diffJ = toJ - this.j;

        if (!(diffI === 0 || diffJ === 0 || Math.abs(diffI) === Math.abs(diffJ))) {
            return false;
        }

        const stepI = diffI === 0 ? 0 : diffI / Math.abs(diffI); 
        const stepJ = diffJ === 0 ? 0 : diffJ / Math.abs(diffJ); 

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