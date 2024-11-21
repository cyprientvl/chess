import { PieceType } from "../../enums/piece.enum";
import { Piece } from "./piece";
import { Case } from "../case";
import { Color } from "../../enums/color.enum";

export class Pawn extends Piece{
    movePawn(toI: number, toJ: number): boolean {
        const direction = this.color === Color.WHITE ? -1 : 1; 
        const startRow = this.color === Color.WHITE ? 6 : 1; 

        if (toJ === this.j && toI === this.i + direction) {
            return true;
        }

        if (toJ === this.j && toI === this.i + 2 * direction && this.i === startRow) {
            return true;
        }


        if (Math.abs(toJ - this.j) === 1 && toI === this.i + direction) {
            return true;
        }

        return false;
    }

    canCapture(toI: number, toJ: number, target: Piece | undefined): boolean {
        const direction = this.color === Color.WHITE ? -1 : 1;

        return (
            target != undefined &&
            target.color !== this.color &&
            Math.abs(toJ - this.j) === 1 &&
            toI === this.i + direction
        );
    }

    move(toI: number, toJ: number, listCase: Case[][]): boolean {
        if (this.movePawn(toI, toJ) && listCase[toI][toJ].piece == undefined ) {
            return true;
        }

        if (this.canCapture(toI, toJ, listCase[toI][toJ].piece)) {
            return true;
        }

        return false;
    }
}