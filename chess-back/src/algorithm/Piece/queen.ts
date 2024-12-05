import { PieceType } from "../../enums/piece.enum";
import { Piece } from "./piece";
import { Case } from "../case";
import { ChessLocation } from "../../interfaces/location.interface";

export class Queen extends Piece{
    possibleMove(listCase: Case[][]): ChessLocation[] {
        const moves: ChessLocation[] = [];

        for (let i = this.i - 1; i >= 0; i--) {
            const currentCase = listCase[i][this.j];
            if (currentCase.piece) {
                if (currentCase.piece.color !== this.color) {
                    moves.push({ i, j: this.j }); 
                }
                break; 
            }
            moves.push({ i, j: this.j });
        }

        for (let i = this.i + 1; i < listCase.length; i++) {
            const currentCase = listCase[i][this.j];
            if (currentCase.piece) {
                if (currentCase.piece.color !== this.color) {
                    moves.push({ i, j: this.j }); 
                }
                break; 
            }
            moves.push({ i, j: this.j });
        }

        for (let j = this.j - 1; j >= 0; j--) {
            const currentCase = listCase[this.i][j];
            if (currentCase.piece) {
                if (currentCase.piece.color !== this.color) {
                    moves.push({ i: this.i, j }); 
                }
                break; 
            }
            moves.push({ i: this.i, j });
        }

        for (let j = this.j + 1; j < listCase[this.i].length; j++) {
            const currentCase = listCase[this.i][j];
            if (currentCase.piece) {
                if (currentCase.piece.color !== this.color) {
                    moves.push({ i: this.i, j }); 
                }
                break;
            }
            moves.push({ i: this.i, j });
        }

        for (let i = this.i - 1, j = this.j - 1; i >= 0 && j >= 0; i--, j--) {
            const currentCase = listCase[i][j];
            if (currentCase.piece) {
                if (currentCase.piece.color !== this.color) {
                    moves.push({ i, j }); 
                }
                break;
            }
            moves.push({ i, j });
        }

        for (let i = this.i - 1, j = this.j + 1; i >= 0 && j < listCase[this.i].length; i--, j++) {
            const currentCase = listCase[i][j];
            if (currentCase.piece) {
                if (currentCase.piece.color !== this.color) {
                    moves.push({ i, j }); 
                }
                break; 
            }
            moves.push({ i, j });
        }

        for (let i = this.i + 1, j = this.j - 1; i < listCase.length && j >= 0; i++, j--) {
            const currentCase = listCase[i][j];
            if (currentCase.piece) {
                if (currentCase.piece.color !== this.color) {
                    moves.push({ i, j });
                }
                break; 
            }
            moves.push({ i, j });
        }

        for (let i = this.i + 1, j = this.j + 1; i < listCase.length && j < listCase[this.i].length; i++, j++) {
            const currentCase = listCase[i][j];
            if (currentCase.piece) {
                if (currentCase.piece.color !== this.color) {
                    moves.push({ i, j }); 
                }
                break; 
            }
            moves.push({ i, j });
        }

        return moves;
    }

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