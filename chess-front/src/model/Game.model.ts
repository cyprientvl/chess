import type { Color, Piece } from "./Pieces.model";

export interface GameModel {
  listCase: Case[][];
  turn: Color;
  pieceKilled: Piece[];
  success?: boolean;
  result?: Result;
}

export interface Case {
  color: Color
  piece: Piece | undefined;
}

export enum ResultPossible {
  KINGSAFE = 'KINGSAFE',
  KINGLOSE = 'KINGLOSE',
  KINGMOVE = 'KINGMOVE',
  WHITEPROMOTION = 'WHITEPROMOTION',
  BLACKPROMOTION = 'BLACKPROMOTION',
  NOPROMOTION = 'NOPROMOTION'
}

export type Result = `${ResultPossible}:${Color}:`[]
