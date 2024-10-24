import { Piece } from "./piece.interface";

export interface InsertActionBody{
    piece: Piece
    from: string
    to: string,
    result: string
}