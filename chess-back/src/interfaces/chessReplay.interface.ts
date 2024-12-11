import { Color } from "../enums/color.enum";
import { ReturnAction } from "./returnAction.interface";
import { ReturnGameAction } from "./returnGameAction.interface";

export interface ChessReplay{
    ownerUsername: string;
    ownerColor: Color;
    actions: ReturnGameAction[]
}