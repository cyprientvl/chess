import { Color } from "../enums/color.enum";

export interface CreateGameBody{

    owner_id: number,
    isPublic: boolean,
    ownerColor: Color

}