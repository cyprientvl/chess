import { Color } from "../enums/color.enum";
import { Piece } from "./Piece/piece";

export class Case{

    color: Color
    piece: Piece | undefined = undefined;

    constructor(color: number, piece?: Piece){
        if(color == 1){
            this.color = Color['WHITE']
        }else{
            this.color = Color['BLACK']
        }

        this.piece = piece;

    }

}