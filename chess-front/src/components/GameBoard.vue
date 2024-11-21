<template>
  <div id="damier" class="p-4">
    <div class="chess-board">
      <div v-for="row in 8" :key="'row-' + row" class="flex">
        <div v-for="col in 8" :key="'cell-' + row + '-' + col" :class="[
          'chess-cell cursor-pointer',
          ((row + col) % 2 === 0) ? 'bg-white' : 'noir'
        ]" @click="handleCellClick(row, col)">
          <div v-if="board[row - 1][col - 1]" class="piece"
            :class="{ 'piece-black': board[row - 1][col - 1].includes('BLACK') }"
            v-html="getPieceSVG(board[row - 1][col - 1])">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import type { GameModel } from '@/model/Game.model';
import { PieceType, PIECES_SVG } from '@/assets/Pieces';

import { useToast } from 'primevue/usetoast';
const toast = useToast();


const initialBoard = [
  [PieceType.BLACK_ROOK, PieceType.BLACK_KNIGHT, PieceType.BLACK_BISHOP, PieceType.BLACK_QUEEN, PieceType.BLACK_KING, PieceType.BLACK_BISHOP, PieceType.BLACK_KNIGHT, PieceType.BLACK_ROOK],
  Array(8).fill(PieceType.BLACK_PAWN),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(PieceType.WHITE_PAWN),
  [PieceType.WHITE_ROOK, PieceType.WHITE_KNIGHT, PieceType.WHITE_BISHOP, PieceType.WHITE_QUEEN, PieceType.WHITE_KING, PieceType.WHITE_BISHOP, PieceType.WHITE_KNIGHT, PieceType.WHITE_ROOK],
];

const board = ref(initialBoard);
const selectedPiece = ref<{ row: number, col: number } | null>(null);

const handleCellClick = async (row: number, col: number) => {
  const piece = board.value[row - 1][col - 1];

  if (selectedPiece.value === null) {
    if (piece) {
      selectedPiece.value = { row: row - 1, col: col - 1 };
    }
  } else {
    // Envoyer le mouvement à l'API pour validation
    try {
      const response = await axios.post<GameModel>('http://localhost:3000/game/move', {
        i: selectedPiece.value.row,
        j: selectedPiece.value.col,
        toI: row - 1,
        toJ: col - 1
      });

      if (response.data.success) {
        // Mettre à jour le plateau avec la nouvelle position
        const { row: fromRow, col: fromCol } = selectedPiece.value;
        board.value[row - 1][col - 1] = board.value[fromRow][fromCol];
        board.value[fromRow][fromCol] = null;
      } else {
        console.log('Mouvement invalide');
        toast.add({ severity: 'error', summary: 'Mouvement invalide', detail: 'Veuillez réessayer' });
      }
    } catch (error) {
      console.error(error);
      toast.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue' });
    }

    selectedPiece.value = null;
  }
};

const getPieceSVG = (pieceType: PieceType | null) => {
  return pieceType ? PIECES_SVG[pieceType] : '';
};
</script>

<style scoped>
.chess-board {
  width: 600px;
  height: 600px;
  border: 2px solid #333;
}

.chess-cell {
  width: 75px;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
}

.chess-cell:hover {
  opacity: 0.8;
}

.piece {
  width: 45px;
  height: 45px;
  cursor: pointer;
}

.piece svg {
  width: 100%;
  height: 100%;
}

.piece-black svg {
  fill: #000;
}

.noir {
  background-color: var(--p-green-900);
}
</style>
