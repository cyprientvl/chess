import { Case } from "../algorithm/case"
import { Piece } from "../algorithm/Piece/piece"
import { Color } from "../enums/color.enum"

export interface ReturnAction{
    success: boolean,
    result: string[],
    listCase: Case[][]
    turn: Color,
    pieceKilled: Piece[]
}