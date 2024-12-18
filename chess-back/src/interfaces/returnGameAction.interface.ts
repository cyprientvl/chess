import { Piece } from "../algorithm/Piece/piece";
import { Color } from "../enums/color.enum";
import { PieceType } from "../enums/piece.enum";
import { ReplayKilledPiece } from "./replayKilledPiece.interface";

export interface ReturnGameAction{
    i: number,
    j: number,
    toI: number,
    toJ: number,
    piece: string | undefined
    color: string | undefined
    pieceKilled: ReplayKilledPiece | undefined;
    step: number
}