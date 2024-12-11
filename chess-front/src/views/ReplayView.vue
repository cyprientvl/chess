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
        <p>Étape {{ currentStepIndex + 1 }} sur {{ replaySteps.length }}</p>
      </div>

      <GameBoard :board="currentBoard" :colorPlayer="currentStep?.turn === Color.BLACK ? 'Noirs' : 'Blancs'"
        :blackKilledPieces="currentBlackKilledPieces" :whiteKilledPieces="currentWhiteKilledPieces"
        :lastMove="currentLastMove" :isReplayMode="true" :possibleMoves="[]" :gameOverMessage="''"
        :showGameOverDialog="false" :showPromotionDialog="false" :availablePromotionPieces="[]" @goHome="goToHome" />

      <div class="flex justify-content-center gap-4 mt-4">
        <Button icon="pi pi-step-backward" @click="previousStep" :disabled="currentStepIndex === 0" label="Précédent" />
        <Button icon="pi pi-step-forward" @click="nextStep" :disabled="currentStepIndex === replaySteps.length - 1"
          label="Suivant" />
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
import type { ReplayStep } from '@/model/Replay.model';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import GameBoard from '../components/GameBoard.vue';
import { Color } from '@/model/Pieces.model';
import type { Case } from '@/model/Game.model';
import type { PieceType } from '@/model/Pieces.model';
import type { GameMoveDTO } from '@/modelDTO/GameMove.dto';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const { getReplay } = useGameService();

const replaySteps = ref<ReplayStep[]>([]);
const currentStepIndex = ref(0);
const currentStep = ref<ReplayStep | null>(null);
const currentBoard = ref<Case[][]>([]);
const currentLastMove = ref<GameMoveDTO | null>(null);
const currentBlackKilledPieces = ref<PieceType[]>([]);
const currentWhiteKilledPieces = ref<PieceType[]>([]);

onMounted(async () => {
  try {
    const gameId = parseInt(route.params.id as string);
    replaySteps.value = await getReplay(gameId);
    if (replaySteps.value.length > 0) {
      updateCurrentStep();
    }
  } catch (error) {
    console.error('Error loading replay:', error);
    toast.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger le replay', life: 5000 });
    router.push('/');
  }
});

const nextStep = () => {
  if (currentStepIndex.value < replaySteps.value.length - 1) {
    currentStepIndex.value++;
    updateCurrentStep();
  }
};

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    updateCurrentStep();
  }
};

const updateCurrentStep = () => {
  const step = replaySteps.value[currentStepIndex.value];
  currentStep.value = step;
  currentBoard.value = step.board;
  currentLastMove.value = step.lastMove;
  currentBlackKilledPieces.value = step.blackKilledPieces;
  currentWhiteKilledPieces.value = step.whiteKilledPieces;
};

const goToHome = () => {
  router.push('/');
};
</script>
