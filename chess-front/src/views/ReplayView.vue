<template>
  <Suspense>
    <template #fallback>
      <div class="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    </template>

    <div>
      <div class="text-center mb-4">
        <h2>Replay de la partie</h2>
        <p>Étape {{ currentStepIndex + 1 }} sur {{ replayData.actions.length }}</p>
        <p>Joueur : {{ replayData.ownerUsername }} - Couleur : {{ replayData.ownerColor === Color.BLACK ? 'Noirs' :
          'Blancs'
          }}</p>
      </div>

      <GameBoard :board="currentBoard" :colorPlayer="getCurrentTurn()" :blackKilledPieces="blackKilledPieces"
        :whiteKilledPieces="whiteKilledPieces" :lastMove="currentLastMove" :isReplayMode="true" :possibleMoves="[]"
        :gameOverMessage="''" :showGameOverDialog="false" :showPromotionDialog="false" :availablePromotionPieces="[]"
        @goHome="goToHome" />

      <div class="flex justify-content-center gap-4 mt-4">
        <Button icon="pi pi-step-backward" @click="previousStep" :disabled="currentStepIndex === -1"
          label="Précédent" />
        <Button icon="pi pi-step-forward" @click="nextStep"
          :disabled="currentStepIndex === replayData.actions.length - 1" label="Suivant" />
      </div>

      <div class="text-center mt-4">
        <Button label="Retour à l'accueil" @click="goToHome" />
      </div>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameService } from '@/composables/game/gameService';
import type { ChessReplay, ReplayStep } from '@/model/Replay.model';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import GameBoard from '../components/GameBoard.vue';
import { Color, PieceType } from '@/model/Pieces.model';
import type { Case } from '@/model/Game.model';
import type { GameMoveDTO } from '@/modelDTO/GameMove.dto';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { getReplay } = useGameService();

// État initial
const initialBoard: Case[][] = Array(8).fill(null).map(() =>
  Array(8).fill(null).map(() => ({ color: Color.WHITE, piece: undefined }))
);

const replayData = ref<ChessReplay>({
  ownerUsername: '',
  ownerColor: Color.WHITE,
  actions: []
});
const currentStepIndex = ref(-1);
const currentBoard = ref<Case[][]>(structuredClone(initialBoard));
const currentLastMove = ref<GameMoveDTO | null>(null);
const blackKilledPieces = ref<PieceType[]>([]);
const whiteKilledPieces = ref<PieceType[]>([]);

const setupInitialBoard = () => {
  // Configuration initiale de l'échiquier
  const board = structuredClone(initialBoard);

  // Placement des pions
  for (let i = 0; i < 8; i++) {
    board[1][i].piece = { pieceType: PieceType.PAWN, color: Color.BLACK, i: 1, j: i };
    board[6][i].piece = { pieceType: PieceType.PAWN, color: Color.WHITE, i: 6, j: i };
  }

  // Placement des autres pièces
  const pieces: PieceType[] = [PieceType.ROOK, PieceType.KNIGHT, PieceType.BISHOP, PieceType.QUEEN, PieceType.KING, PieceType.BISHOP, PieceType.KNIGHT, PieceType.ROOK];
  for (let j = 0; j < 8; j++) {
    board[0][j].piece = { pieceType: pieces[j], color: Color.BLACK, i: 0, j };
    board[7][j].piece = { pieceType: pieces[j], color: Color.WHITE, i: 7, j };
  }

  return board;
};

onMounted(async () => {
  try {
    const gameId = parseInt(route.params.gameId as string);
    const replay = await getReplay(gameId);
    replayData.value = replay;
    currentBoard.value = setupInitialBoard();
  } catch (error) {
    console.error('Error loading replay:', error);
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger le replay', life: 5000 });
    router.push('/');
  }
});

const nextStep = () => {
  if (currentStepIndex.value < replayData.value.actions.length - 1) {
    currentStepIndex.value++;
    applyStep(replayData.value.actions[currentStepIndex.value]);
  }
};

const previousStep = () => {
  if (currentStepIndex.value > -1) {
    undoStep(replayData.value.actions[currentStepIndex.value]);
    currentStepIndex.value--;
  }
};

const applyStep = (step: ReplayStep) => {
  // Mise à jour du dernier mouvement
  currentLastMove.value = {
    i: step.i,
    j: step.j,
    toI: step.toI,
    toJ: step.toJ
  };

  // Si une pièce a été tuée, l'ajouter à la liste appropriée
  if (step.pieceKilled) {
    const killedPieces = step.pieceKilled.color === Color.BLACK ? blackKilledPieces : whiteKilledPieces;
    killedPieces.value.push(step.pieceKilled.pieceType);
  }

  // Déplacer la pièce sur le plateau
  const piece = currentBoard.value[step.i][step.j].piece;
  if (piece) {
    currentBoard.value[step.toI][step.toJ].piece = {
      ...piece,
      i: step.toI,
      j: step.toJ
    };
    currentBoard.value[step.i][step.j].piece = undefined;
  }
};

const undoStep = (step: ReplayStep) => {
  // Annuler le dernier mouvement
  currentLastMove.value = null;

  // Si une pièce a été tuée, la retirer de la liste
  if (step.pieceKilled) {
    const killedPieces = step.pieceKilled.color === Color.BLACK ? blackKilledPieces : whiteKilledPieces;
    const index = killedPieces.value.indexOf(step.pieceKilled.pieceType);
    if (index > -1) {
      killedPieces.value.splice(index, 1);
    }
  }

  // Remettre la pièce à sa position d'origine
  const piece = currentBoard.value[step.toI][step.toJ].piece;
  if (piece) {
    currentBoard.value[step.i][step.j].piece = {
      ...piece,
      i: step.i,
      j: step.j
    };
    currentBoard.value[step.toI][step.toJ].piece = step.pieceKilled || undefined;
  }
};

const getCurrentTurn = () => {
  const currentStep = currentStepIndex.value >= 0 ? replayData.value.actions[currentStepIndex.value] : null;
  if (!currentStep) {
    return replayData.value.ownerColor === Color.WHITE ? 'Blancs' : 'Noirs';
  }
  return currentStep.color === Color.BLACK ? 'Noirs' : 'Blancs';
};

const goToHome = () => {
  router.push('/');
};
</script>
