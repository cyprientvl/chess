import { Color } from "../enums/color.enum";
import { PieceType } from "../enums/piece.enum";

export interface Piece {
    color: Color;
    type: PieceType;
    position: string;
}