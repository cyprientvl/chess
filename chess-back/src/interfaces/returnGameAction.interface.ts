import { Piece } from "../algorithm/Piece/piece";
import { Color } from "../enums/color.enum";
import { PieceType } from "../enums/piece.enum";

export interface ReturnGameAction{
    i: number,
    j: number,
    toI: number,
    toJ: number,
    piece: string | undefined
    color: string | undefined
    pieceKilled: Piece[];
    step: number
}