import { Case } from "../algorithm/case";
import { Piece } from "../algorithm/Piece/piece";
import { Color } from "../enums/color.enum";

export interface FormatedGame{
    success?: boolean;
    listCase?: Case[][];
    turn?: Color;
    pieceKilled?: Piece[];
    result?: string[];
    ownerColor?: Color;
}