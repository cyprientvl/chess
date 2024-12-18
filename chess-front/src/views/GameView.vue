<template>
  <Suspense>
    <template #fallback>
      <div class="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    </template>

    <div>
      <div class="list-users">
        <div class="users">
          <img src="/assets/img/user-image.svg">
          <div>
            <p class="guest">{{ ownerUsername }}</p>
            <p class="user-color">{{ ownerColor }}</p>
          </div>
        </div>

        <h1>C'est aux {{ colorPlayer }} de jouer !</h1>

        <div class="users users-seconde">
          <img src="/assets/img/user-image.svg">
          <div>
            <p class="guest">Guest</p>
            <p class="user-color">{{ guestColor }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-content-center align-items-top mt-6 gap-5">
        <GameBoard :board="board" :colorPlayer="colorPlayer" :blackKilledPieces="blackKilledPieces"
          :whiteKilledPieces="whiteKilledPieces" :lastMove="lastMove" :possibleMoves="possibleMoves"
          :gameOverMessage="gameOverMessage" :showGameOverDialog="showGameOverDialog"
          :showPromotionDialog="showPromotionDialog" :availablePromotionPieces="availablePromotionPieces"
          @move="handleMove" @promote="handlePromotion" @goHome="goToHome" @selectPiece="handleSelectPiece" />

        <div class="text-center mt-4">
          <Button class="leave-game" style="color: white;" label="Quitter la partie" @click="quitGame" />
        </div>
      </div>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Color, PieceType, type FullPieceProperty, type Piece } from '@/model/Pieces.model';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useGameService } from '@/composables/game/gameService';
import router from '@/router';
import { AxiosError } from 'axios';
import { ResultPossible, type GameModel, type Case } from '@/model/Game.model';
import type { PossibleMove } from '@/model/PossibleMove.model';
import { useUserService } from '@/composables/user/userService';
import GameBoard from '../components/GameBoard.vue';
import type { GameMoveDTO } from '@/modelDTO/GameMove.dto';

const toast = useToast();
const { move, getCurrentGame, getPossibleMoves, promote, deleteGame } = useGameService();

const initialBoard: Case[][] = Array(8).fill(null).map(() =>
  Array(8).fill(null).map(() => ({ color: Color.WHITE, piece: undefined }))
);

const board = ref<Case[][]>(initialBoard);
const colorPlayer = ref<'Noirs' | 'Blancs'>('Blancs');
const blackKilledPieces = ref<PieceType[]>([]);
const whiteKilledPieces = ref<PieceType[]>([]);
const ownerUsername = ref<string>(useUserService().getUsername());
const ownerColor = ref<'Noirs' | 'Blancs'>();
const guestColor = ref<'Noirs' | 'Blancs'>();
const possibleMoves = ref<PossibleMove[]>([]);
const lastMove = ref<GameMoveDTO | null>(null);

const showPromotionDialog = ref(false);
const showGameOverDialog = ref(false);
const gameOverMessage = ref('');
const promotionPosition = ref<{ i: number; j: number; } | null>(null);
const availablePromotionPieces = ref<FullPieceProperty[]>([]);

onMounted(async () => {
  try {
    const response = await getCurrentGame();

    if (!response) {
      goToHome();
      return;
    }

    board.value = response.listCase;
    colorPlayer.value = response.turn === Color.BLACK ? 'Noirs' : 'Blancs';
    blackKilledPieces.value = parsePieceKilled(response.pieceKilled, Color.BLACK);
    whiteKilledPieces.value = parsePieceKilled(response.pieceKilled, Color.WHITE);

    ownerColor.value = response.ownerColor === Color.BLACK ? 'Noirs' : 'Blancs';
    guestColor.value = response.ownerColor === Color.BLACK ? 'Blancs' : 'Noirs';

    handleGameResult(response, -1, -1);
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Une erreur est survenue', life: 5000 });
    if (error instanceof AxiosError) {
      router.push('/');
    }
  }
});

const handleMove = async (moveData: GameMoveDTO) => {
  try {
    const response = await move(moveData);

    if (response.success) {
      lastMove.value = moveData;
      board.value = response.listCase;
      colorPlayer.value = response.turn === Color.BLACK ? 'Noirs' : 'Blancs';
      blackKilledPieces.value = parsePieceKilled(response.pieceKilled, Color.BLACK);
      whiteKilledPieces.value = parsePieceKilled(response.pieceKilled, Color.WHITE);
      possibleMoves.value = [];

      handleGameResult(response, moveData.toI + 1, moveData.toJ + 1);
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
};

const handleSelectPiece = async (position: { row: number, col: number } | null) => {
  if (position === null) {
    possibleMoves.value = [];
    return;
  }

  try {
    const movesResponse = await getPossibleMoves({
      i: position.row,
      j: position.col
    });
    possibleMoves.value = movesResponse;
  } catch (error) {
    console.error('Error fetching possible moves:', error);
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de récupérer les mouvements possibles', life: 5000 });
  }
};

const handlePromotion = async (pieceType: PieceType) => {
  if (!promotionPosition.value) return;

  try {
    const response = await promote(pieceType);

    if (response.success) {
      showPromotionDialog.value = false;
      promotionPosition.value = null;
      board.value = response.listCase;
      blackKilledPieces.value = parsePieceKilled(response.pieceKilled, Color.BLACK);
      whiteKilledPieces.value = parsePieceKilled(response.pieceKilled, Color.WHITE);
    }
  } catch (error) {
    console.error('Error during promotion:', error);
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la promotion', life: 5000 });
  }
};

const handleGameResult = (game: GameModel, row: number, col: number) => {
  if (game.result && game.result.length > 0) {
    for (const resultStr of game.result) {
      const [result, color] = resultStr.split(':') as [ResultPossible, Color];
      switch (result) {
        case ResultPossible.KINGLOSE:
          gameOverMessage.value = `Les ${color === Color.BLACK ? 'Blancs' : 'Noirs'} ont gagné !`;
          showGameOverDialog.value = true;
          return;

        case ResultPossible.PROMOTION:
          if (row === -1 || col === -1) return;
          promotionPosition.value = { i: row - 1, j: col - 1 };
          availablePromotionPieces.value = color === Color.BLACK
            ? blackKilledPieces.value.filter(piece => piece != PieceType.PAWN).map(piece => `BLACK_${piece}` as FullPieceProperty)
            : whiteKilledPieces.value.filter(piece => piece != PieceType.PAWN).map(piece => `WHITE_${piece}` as FullPieceProperty);
          showPromotionDialog.value = true;
          break;

        case ResultPossible.KINGMOVE:
          toast.add({
            severity: 'warn',
            summary: 'Attention',
            detail: 'Votre roi est en danger ! Vous devez le déplacer.'
          });
          break;
      }
    }
  }
};

const goToHome = () => {
  router.push('/');
};

const quitGame = async () => {
  try {
    await deleteGame();
    goToHome();
  } catch (error) {
    console.error('Error during game deletion:', error);
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la suppression de la partie', life: 5000 });
  }
};

const parsePieceKilled = (piecesKilled: Piece[], color: Color): PieceType[] => {
  return piecesKilled.filter(piece => piece.color === color).map(piece => piece.pieceType);
};
</script>
