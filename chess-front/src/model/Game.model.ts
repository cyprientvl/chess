export interface GameModel {
  listCase: Case[][];
  turn: Color;
  pieceKilled: Piece[];
  success?: boolean;
  result?: Result;
}

interface Case {
  color: Color
  piece: Piece | undefined;
}

export enum Color {
  BLACK = 'BLACK',
  WHITE = 'WHITE'
}

interface Piece {
  pieceType: GlobalPieceType;
  color: Color;
  j: number;
  i: number;
}

export enum GlobalPieceType {
  PAWN = 'PAWN',
  ROOK = 'ROOK',
  KNIGHT = 'KNIGHT',
  BISHOP = 'BISHOP',
  QUEEN = 'QUEEN',
  KING = 'KING'
}

export enum ResultPossible {
  KINGSAFE = 'KINGSAFE',
  KINGLOSE = 'KINGLOSE',
  KINGMOVE = 'KINGMOVE',
  WHITEPROMOTION = 'WHITEPROMOTION',
  BLACKPROMOTION = 'BLACKPROMOTION',
  NOPROMOTION = 'NOPROMOTION'
}

export type Result = `${Color}:${ResultPossible}`[]
