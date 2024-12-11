import type { Color, Piece } from "./Pieces.model";

export interface GameModel {
  listCase: Case[][];
  turn: Color;
  pieceKilled: Piece[];
  success?: boolean;
  result?: Result;
  ownerColor?: Color;
}

export interface Case {
  color: Color
  piece: Piece | undefined;
}

export enum ResultPossible {
  KINGSAFE = 'KINGSAFE',
  KINGLOSE = 'KINGLOSE',
  KINGMOVE = 'KINGMOVE',
  PROMOTION = 'PROMOTION',
  NOPROMOTION = 'NOPROMOTION'
}

export type Result = `${ResultPossible}:${Color}:`[]
