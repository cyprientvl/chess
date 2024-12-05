import { Piece } from "./piece";
import { Case } from "../case";
import { PieceType } from "../../enums/piece.enum";
import { ChessLocation } from "../../interfaces/location.interface";

export class Bishop extends Piece{

    possibleMove(listCase: Case[][]): ChessLocation[] {
        const moves: ChessLocation[] = [];
        const directions = [
            [-1, -1], [-1, 1], [1, -1], [1, 1] 
        ];

        for (const [di, dj] of directions) {
            let currentI = this.i + di;
            let currentJ = this.j + dj;

            while (currentI >= 0 && currentI < listCase.length && currentJ >= 0 && currentJ < listCase[0].length) {
                const targetCase = listCase[currentI][currentJ];

                if (targetCase.piece) {
                    if (targetCase.piece.color === this.color) {
                        break;
                    }

                    moves.push({ i: currentI, j: currentJ });
                    break;
                }

                moves.push({ i: currentI, j: currentJ });
                
                currentI += di;
                currentJ += dj;
            }
        }

        return moves;
    }
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
