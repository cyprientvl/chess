export enum Color {
  BLACK = 'BLACK',
  WHITE = 'WHITE'
}
export enum PieceType {
  PAWN = 'PAWN',
  ROOK = 'ROOK',
  KNIGHT = 'KNIGHT',
  BISHOP = 'BISHOP',
  QUEEN = 'QUEEN',
  KING = 'KING',
}

export type FullPieceProperty = `${Color}_${PieceType}`;

export const PIECES_IMG = {
  [`${Color.WHITE}_${PieceType.QUEEN}`]: `<img src="/assets/img/wq.png">`,
  [`${Color.WHITE}_${PieceType.KING}`]: `<img src="/assets/img/wk.png">`,
  [`${Color.WHITE}_${PieceType.ROOK}`]: `<img src="/assets/img/wr.png">`,
  [`${Color.WHITE}_${PieceType.BISHOP}`]: `<img src="/assets/img/wb.png">`,
  [`${Color.WHITE}_${PieceType.KNIGHT}`]: `<img src="/assets/img/wn.png">`,
  [`${Color.WHITE}_${PieceType.PAWN}`]: `<img src="/assets/img/wp.png">`,
  [`${Color.BLACK}_${PieceType.QUEEN}`]: `<img src="/assets/img/bq.png">`,
  [`${Color.BLACK}_${PieceType.KING}`]: `<img src="/assets/img/bk.png">`,
  [`${Color.BLACK}_${PieceType.ROOK}`]: `<img src="/assets/img/br.png">`,
  [`${Color.BLACK}_${PieceType.BISHOP}`]: `<img src="/assets/img/bb.png">`,
  [`${Color.BLACK}_${PieceType.KNIGHT}`]: `<img src="/assets/img/bn.png">`,
  [`${Color.BLACK}_${PieceType.PAWN}`]: `<img src="/assets/img/bp.png">`
};

export interface Piece {
  pieceType: PieceType;
  color: Color;
  i: number;
  j: number;
}

