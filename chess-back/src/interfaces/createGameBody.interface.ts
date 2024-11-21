import { Color } from "../enums/color.enum";

export interface CreateGameBody{
    isPublic: boolean,
    ownerColor: Color
}