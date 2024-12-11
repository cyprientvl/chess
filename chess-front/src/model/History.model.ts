import type { Color } from "./Pieces.model";
import type { User } from "./User.model";

export interface HistoryModel {
  id: number;
  owner: User;
  public: boolean;
  owner_win: number;
  creation_date: number;
  date_end?: number;
  owner_color: Color;
}
