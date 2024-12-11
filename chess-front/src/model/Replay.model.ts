import type { Color, PieceType } from "./Pieces.model";

export interface ReplayStep {
  i: number;
  j: number;
  piece: PieceType | undefined;
  color: Color | undefined;
}
