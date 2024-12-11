import type { Color, Piece, PieceType } from "./Pieces.model";

export interface ChessReplay {
  ownerUsername: string;
  ownerColor: Color;
  actions: ReplayStep[];
}

export interface ReplayStep {
  i: number;
  j: number;
  toI: number;
  toJ: number;
  piece: PieceType | undefined;
  color: Color | undefined;
  pieceKilled: Piece | undefined;
}
