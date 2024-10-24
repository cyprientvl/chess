import { Color } from "../enums/color.enum";
import { User } from "../models/user.model";

export interface GameDTO {
    id: number;
    owner: User;
    isPublic: boolean;
    winner: User;
    creationDate: string;
    dateEnd: string;
    ownerColor: Color
  }