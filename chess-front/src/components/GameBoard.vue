<template>
  <Suspense>
    <template #fallback>
      <div class="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    </template>

    <div id="main">
      <div id="pieceKilled">
        <h2>Pièces tuées</h2>
        <div class="flex">
          <div v-for="piece in pieceKilled" :key="piece.i + '-' + piece.j" class="piece"
            :class="{ 'piece-black': piece.color === 'BLACK' }" v-html="getPieceSVG(getPieceType(piece))">
          </div>
        </div>
      </div>
      <div id="damier" class="p-4">
        <h1>C'est aux {{ colorPlayer }} de jouer !</h1>

        <div class="chess-board">
          <div v-for="row in 8" :key="'row-' + row" class="flex">
            <div v-for="col in 8" :key="'cell-' + row + '-' + col" :class="[
              'chess-cell cursor-pointer',
              ((row + col) % 2 === 0) ? 'bg-white' : 'noir',
              { 'possible-move': isPossibleMove(row - 1, col - 1) }
            ]" @click="handleCellClick(row, col)">
              <span v-if="col === 1" :class="['topleft', ((row + col) % 2 === 0) ? 'text-noir' : 'text-white']">{{ 9 -
                row
                }}</span>

              <span v-if="row === 8" :class="['bottomleft', ((row + col) % 2 === 0) ? 'text-noir' : 'text-white']">{{
                String.fromCharCode(96 + col)
              }}</span>
              <div v-if="board[row - 1][col - 1]?.piece" class="piece"
                :class="{ 'piece-black': board[row - 1][col - 1]?.piece?.color === 'BLACK' }"
                v-html="getPieceSVG(getPieceType(board[row - 1][col - 1]?.piece!))">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PieceType, PIECES_SVG, type Case, type Piece } from '@/assets/Pieces';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';
import { useGameService } from '@/composables/game/gameService';
import router from '@/router';
import { AxiosError } from 'axios';
import { Color } from '@/model/Game.model';
import type { PossibleMove } from '@/model/PossibleMove.model';

const toast = useToast();
const { move, getCurrentGame, getPossibleMoves } = useGameService();

const initialBoard: Case[][] = Array(8).fill(null).map(() =>
  Array(8).fill(null).map(() => ({ color: Color.WHITE, piece: undefined }))
);

const board = ref<Case[][]>(initialBoard);
const colorPlayer = ref<'Noirs' | 'Blancs'>();
const pieceKilled = ref<Piece[]>([]);

const selectedPiece = ref<{ row: number, col: number } | null>(null);
const possibleMoves = ref<PossibleMove[]>([]);

const getPieceType = (piece: Piece): PieceType => {
  return `${piece.color}_${piece.pieceType}` as PieceType;
};

onMounted(async () => {
  try {
    const response = await getCurrentGame();
    board.value = response.listCase;
    colorPlayer.value = response.turn === Color.BLACK ? 'Noirs' : 'Blancs';
    pieceKilled.value = response.pieceKilled;
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue', life: 5000 });
    if (error instanceof AxiosError) {
      router.push('/');
    }
  }
});

const handleCellClick = async (row: number, col: number) => {
  const currentCase = board.value[row - 1][col - 1];

  if (selectedPiece.value === null) {
    if (currentCase.piece && currentCase.piece.color === (colorPlayer.value === 'Noirs' ? Color.BLACK : Color.WHITE)) {
      selectedPiece.value = { row: row - 1, col: col - 1 };

      // Fetch possible moves for the selected piece
      try {
        const movesResponse = await getPossibleMoves({
          i: row - 1,
          j: col - 1
        });
        possibleMoves.value = movesResponse;
      } catch (error) {
        console.error('Error fetching possible moves:', error);
        toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de récupérer les mouvements possibles', life: 5000 });
      }
    }
  } else {
    try {
      const response = await move({
        i: selectedPiece.value.row,
        j: selectedPiece.value.col,
        toI: row - 1,
        toJ: col - 1
      });

      if (response.success) {
        board.value = response.listCase;
        colorPlayer.value = response.turn === Color.BLACK ? 'Noirs' : 'Blancs';
        pieceKilled.value = response.pieceKilled;
        possibleMoves.value = []; // Clear possible moves after move
      } else {
        toast.add({ severity: 'error', summary: 'Mouvement invalide', detail: 'Veuillez réessayer', life: 5000 });
      }
    } catch (error) {
      console.error(error);
      toast.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue', life: 5000 });
      if (error instanceof AxiosError && error?.response?.status === 404) {
        router.push('/');
      }
    }
    selectedPiece.value = null;
  }
};

const isPossibleMove = (row: number, col: number): boolean => {
  return possibleMoves.value.some(move => move.i === row && move.j === col);
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
  position: relative;
}

.chess-cell:hover {
  opacity: 0.8;
}

.possible-move {
  background-color: rgba(255, 255, 0, 0.5) !important;
  /* Yellow highlight */
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

#main {
  display: flex;
  justify-content: space-around;
  gap: 50px;
  vertical-align: top;
}

.topleft {
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 12px;
}

.bottomleft {
  position: absolute;
  bottom: 5px;
  left: 5px;
  font-size: 12px;
}

.text-white {
  color: white;
}

.text-noir {
  color: black;
}

@media screen and (max-width: 768px) {
  #main {
    flex-direction: column;
  }
}
</style>
