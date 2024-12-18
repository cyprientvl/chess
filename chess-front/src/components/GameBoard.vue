<template>
  <div id="main">
    <div id="pieceKilled">
      <h2>Pièces prises</h2>
      <div class="flex all-piece-killed">
        <div class="list-piece-killed">
          <div v-for="piece in blackKilledPieces" :key="piece" class="piece piece-black"
            v-html="getPieceSVG(`BLACK_${piece}` as FullPieceProperty)">
          </div>
        </div>
        <div class="list-piece-killed">
          <div v-for="piece in whiteKilledPieces" class="piece list-piece-killed"
            v-html="getPieceSVG(`WHITE_${piece}` as FullPieceProperty)" :key="piece">
          </div>
        </div>
      </div>
    </div>

    <div id="damier" class="p-4">
      <div class="chess-board" :class="[colorPlayer === 'Noirs' ? 'chess-board-rotate' : '']">
        <div v-for="row in 8" :key="'row-' + row" class="flex">
          <div v-for="col in 8" :key="'cell-' + row + '-' + col" :class="[
            'chess-cell cursor-pointer',
            ((row + col) % 2 === 0) ? 'bg-white' : 'noir',
            {
              'possible-move': isPossibleMove(row - 1, col - 1) && selectedPiece,
              'selected-cell': isSelectedCell(row - 1, col - 1),
              'last-move-from': isLastMoveFrom(row - 1, col - 1),
              'last-move-to': isLastMoveTo(row - 1, col - 1)
            }
          ]" @click="!isReplayMode && handleCellClick(row, col)">
            <span v-if="col === (colorPlayer === 'Noirs' ? 8 : 1)"
              :class="['topleft', ((row + col) % 2 === 0) ? 'text-noir' : 'text-white']">
              {{ 9 - row }}
            </span>

            <span v-if="row === (colorPlayer === 'Noirs' ? 1 : 8)"
              :class="['bottomleft', ((row + col) % 2 === 0) ? 'text-noir' : 'text-white']">
              {{ String.fromCharCode(96 + col) }}
            </span>
            <div v-if="board[row - 1][col - 1]?.piece" class="piece"
              :class="{ 'piece-black': board[row - 1][col - 1]?.piece?.color === 'BLACK' }"
              v-html="getPieceSVG(getPieceFullProperty(board[row - 1][col - 1]?.piece!))">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modale de promotion -->
    <Dialog v-model:visible="showPromotionDialogLocal" modal header="Choisissez une pièce" :closable="false">
      <div class="flex justify-content-center gap-4">
        <div v-for="piece in availablePromotionPieces" :key="piece" class="cursor-pointer piece promotion-piece"
          @click="handlePromotion(removePieceColor(piece))" v-html="getPieceSVG(piece)">
        </div>
      </div>
    </Dialog>

    <!-- Modale de fin de partie -->
    <Dialog v-model:visible="showGameOverDialogLocal" modal header="Partie terminée" :closable="false">
      <div class="text-center">
        <h2 class="mb-4">{{ gameOverMessage }}</h2>
        <Button label="Retour à l'accueil" @click="$emit('goHome')" />
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Color, PIECES_IMG, PieceType, type FullPieceProperty, type Piece } from '@/model/Pieces.model';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import type { Case } from '@/model/Game.model';
import type { PossibleMove } from '@/model/PossibleMove.model';
import type { GameMoveDTO } from '@/modelDTO/GameMove.dto';

const props = defineProps<{
  board: Case[][];
  colorPlayer: 'Noirs' | 'Blancs';
  blackKilledPieces: PieceType[];
  whiteKilledPieces: PieceType[];
  lastMove: GameMoveDTO | null;
  isReplayMode?: boolean;
  possibleMoves: PossibleMove[];
  gameOverMessage?: string;
  showGameOverDialog?: boolean;
  showPromotionDialog?: boolean;
  availablePromotionPieces: FullPieceProperty[];
}>();

const emit = defineEmits<{
  (e: 'move', data: GameMoveDTO): void;
  (e: 'promote', pieceType: PieceType): void;
  (e: 'goHome'): void;
  (e: 'selectPiece', position: { row: number, col: number } | null): void;
}>();

const selectedPiece = ref<{ row: number, col: number } | null>(null);

const showPromotionDialogLocal = ref(props.showPromotionDialog);
const showGameOverDialogLocal = ref(props.showGameOverDialog);

watch(() => props.showPromotionDialog, (newVal) => {
  showPromotionDialogLocal.value = newVal;
});

watch(() => props.showGameOverDialog, (newVal) => {
  showGameOverDialogLocal.value = newVal;
});

const handleCellClick = (row: number, col: number) => {
  const currentCase = props.board[row - 1][col - 1];
  const currentPlayerColor = props.colorPlayer === 'Noirs' ? Color.BLACK : Color.WHITE;

  if (selectedPiece.value?.row === row - 1 && selectedPiece.value?.col === col - 1) {
    selectedPiece.value = null;
    emit('selectPiece', null);
    return;
  }

  if (!selectedPiece.value) {
    if (currentCase.piece && currentCase.piece.color === currentPlayerColor) {
      selectedPiece.value = { row: row - 1, col: col - 1 };
      emit('selectPiece', { row: row - 1, col: col - 1 });
    }
  } else {
    emit('move', {
      i: selectedPiece.value.row,
      j: selectedPiece.value.col,
      toI: row - 1,
      toJ: col - 1
    });
    selectedPiece.value = null;
  }
};

const handlePromotion = (pieceType: PieceType) => {
  emit('promote', pieceType);
};

const isPossibleMove = (row: number, col: number): boolean => {
  return props.possibleMoves.some(move => move.i === row && move.j === col);
};

const isSelectedCell = (row: number, col: number): boolean => {
  return selectedPiece.value?.row === row && selectedPiece.value?.col === col;
};

const isLastMoveFrom = (row: number, col: number): boolean => {
  return props.lastMove?.i === row && props.lastMove?.j === col;
};

const isLastMoveTo = (row: number, col: number): boolean => {
  return props.lastMove?.toI === row && props.lastMove?.toJ === col;
};

const getPieceSVG = (pieceType: FullPieceProperty | null) => {
  return pieceType ? PIECES_IMG[pieceType] : '';
};

const getPieceFullProperty = (piece: Piece): FullPieceProperty => {
  return `${piece.color}_${piece.pieceType}` as FullPieceProperty;
};

const removePieceColor = (pieceType: FullPieceProperty): PieceType => {
  return pieceType.split('_')[1] as PieceType;
};
</script>
