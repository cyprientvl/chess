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

      <div class="flex justify-content-center align-items-start mt-6 gap-8">
        <div class="card">
          <GameBoard :board="currentBoard" :colorPlayer="getCurrentTurn()" :blackKilledPieces="blackKilledPieces"
            :whiteKilledPieces="whiteKilledPieces" :lastMove="currentLastMove" :isReplayMode="true" :possibleMoves="[]"
            :gameOverMessage="''" :showGameOverDialog="false" :showPromotionDialog="false"
            :availablePromotionPieces="[]" @goHome="goToHome" />
        </div>

        <div class="flex flex-column gap-4 w-64">
          <div class="card p-4">
            <h3 class="text-xl font-semibold mb-4">Contrôles</h3>
            <div class="flex flex-column gap-3">
              <Button icon="pi pi-step-backward" @click="previousStep" :disabled="currentStepIndex === -1"
                label="Coup précédent" class="p-button-outlined w-full" />
              <Button icon="pi pi-step-forward" @click="nextStep"
                :disabled="currentStepIndex === replayData.actions.length - 1" label="Coup suivant"
                class="p-button-outlined w-full" />
              <div class="text-center mt-2">
                <small class="text-gray-600">
                  Coup {{ currentStepIndex + 1 }} / {{ replayData.actions.length }}
                </small>
              </div>
            </div>
          </div>

          <Button label="Retour à l'accueil" icon="pi pi-home" @click="goToHome" class="p-button-secondary w-full" />
        </div>
      </div>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameService } from '@/composables/game/gameService';
import type { ChessReplay } from '@/model/Replay.model';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import GameBoard from '../components/GameBoard.vue';
import { Color, PieceType, type Piece } from '@/model/Pieces.model';
import type { Case } from '@/model/Game.model';
import type { GameMoveDTO } from '@/modelDTO/GameMove.dto';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { getReplay } = useGameService();

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

const capturedBlackPieces = ref<Piece[]>([]);
const capturedWhitePieces = ref<Piece[]>([]);

const blackKilledPieces = ref<PieceType[]>([]);
const whiteKilledPieces = ref<PieceType[]>([]);

const setupInitialBoard = () => {
  const board = structuredClone(initialBoard);

  for (let i = 0; i < 8; i++) {
    board[1][i].piece = { pieceType: PieceType.PAWN, color: Color.BLACK, i: 1, j: i };
    board[6][i].piece = { pieceType: PieceType.PAWN, color: Color.WHITE, i: 6, j: i };
  }

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
    const step = replayData.value.actions[currentStepIndex.value];

    currentLastMove.value = {
      i: step.i,
      j: step.j,
      toI: step.toI,
      toJ: step.toJ
    };

    const destinationPiece = currentBoard.value[step.toI][step.toJ].piece;
    if (destinationPiece && step.pieceKilled) {
      const capturedPieces = step.pieceKilled.color === Color.BLACK ? capturedBlackPieces : capturedWhitePieces;
      capturedPieces.value.push({
        pieceType: step.pieceKilled.pieceType,
        color: step.pieceKilled.color,
        i: step.toI,
        j: step.toJ
      });

      
      if(step.pieceKilled.color === Color.BLACK){
        blackKilledPieces.value.push(step.pieceKilled.pieceType)
      }else{
        whiteKilledPieces.value.push(step.pieceKilled.pieceType);
      }
      
    }

    const movingPiece = currentBoard.value[step.i][step.j].piece;
    if (movingPiece) {
      currentBoard.value[step.toI][step.toJ].piece = {
        pieceType: movingPiece.pieceType,
        color: movingPiece.color,
        i: step.toI,
        j: step.toJ
      };
      currentBoard.value[step.i][step.j].piece = undefined;

      if(step.piece){
        let aaa = currentBoard.value[step.toI][step.toJ].piece;
        if(aaa) aaa.pieceType = step.piece;
      }

    }

    
  }
};

const previousStep = () => {
  if (currentStepIndex.value > -1) {
    const step = replayData.value.actions[currentStepIndex.value];

    const movedPiece = currentBoard.value[step.toI][step.toJ].piece;
    if (movedPiece) {
      currentBoard.value[step.i][step.j].piece = {
        pieceType: movedPiece.pieceType,
        color: movedPiece.color,
        i: step.i,
        j: step.j
      };

      if (step.pieceKilled) {
        const capturedPieces = step.pieceKilled.color === Color.BLACK ? capturedBlackPieces : capturedWhitePieces;
        const killedPieces = step.pieceKilled.color === Color.BLACK ? blackKilledPieces : whiteKilledPieces;

        const capturedIndex = capturedPieces.value.findIndex(
          p => p.pieceType === step.pieceKilled?.pieceType &&
            p.i === step.toI &&
            p.j === step.toJ
        );

        if (capturedIndex !== -1) {
          const removedPiece = capturedPieces.value.splice(capturedIndex, 1)[0];
          killedPieces.value.splice(killedPieces.value.findIndex(p => p === removedPiece.pieceType), 1);

          currentBoard.value[step.toI][step.toJ].piece = {
            pieceType: removedPiece.pieceType,
            color: removedPiece.color,
            i: removedPiece.i,
            j: removedPiece.j
          };
        }
      } else {
        currentBoard.value[step.toI][step.toJ].piece = undefined;
      }

      if(step.piece){
        let aaa = currentBoard.value[step.i][step.j].piece;
        if(aaa) aaa.pieceType = PieceType['PAWN'];
      }
    }

    

    currentLastMove.value = null;
    currentStepIndex.value--;
  }
};

const getCurrentTurn = () => {
  return replayData.value.ownerColor === Color.WHITE ? 'Blancs' : 'Noirs';
};

const goToHome = () => {
  router.push('/');
};
</script>
