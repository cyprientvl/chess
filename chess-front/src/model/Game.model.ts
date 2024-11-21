export interface GameModel {
  listCase: Case[][];
  turn: Color;
  pieceKilled: Piece[];
  success?: boolean;
  result?: string[];
}

interface Case {
  color: Color
  piece: Piece | undefined;
}

enum Color {
  BLACK = 'BLACK',
  WHITE = 'WHITE'
}

interface Piece {
  pieceType: PieceType;
  color: Color;
  j: number;
  i: number;
}

enum PieceType {
  PAWN = 'PAWN',
  ROOK = 'ROOK',
  KNIGHT = 'KNIGHT',
  BISHOP = 'BISHOP',
  QUEEN = 'QUEEN',
  KING = 'KING'
}
