import { Color } from "../../enums/color.enum";
import { PieceType } from "../../enums/piece.enum";
import { ChessLocation } from "../../interfaces/location.interface";
import { Case } from "../case";

export abstract class Piece{

    pieceType: PieceType
    color: Color
    i: number
    j: number

    constructor(pieceType: PieceType, color: number, i: number, j: number){
        this.pieceType = pieceType;
        if(color == 1){
            this.color = Color['WHITE']
        }else{
            this.color = Color['BLACK']
        }
        this.i = i;
        this.j = j;
    }

    abstract move(toI: number, toJ: number, listCase: Case[][]): boolean;
    abstract possibleMove(listCase: Case[][]): ChessLocation[]
    
}