import { Color } from "../enums/color.enum";
import { User } from "../models/user.model";
import { UserDTO } from "./user.dto";

export interface GameDTO {
  id: number;
  owner: UserDTO;
  public: boolean;
  owner_win: boolean;
  creation_date: number;
  date_end?: number;
  owner_color: Color
}