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
          <img src="https://www.chess.com/bundles/web/images/user-image.svg">
          <div>
            <p class="guest">Guest</p>
            <p class="user-color">Blanc</p>
          </div>
        </div>

        <h1 class="colot-turn">C'est aux {{ colorPlayer }} de jouer !</h1>

        <div class="users users-seconde">
          <img src="https://www.chess.com/bundles/web/images/user-image.svg">
          <div>
            <p class="guest">Guest</p>
            <p class="user-color">Noir</p>
          </div>

        </div>
      </div>

      <div id="main">
        <div id="pieceKilled">
          <h2>Pièces prises</h2>
          <div class="flex">
            <div v-for="piece in blackKilledPieces" :key="piece" class="piece piece-black"
              v-html="getPieceSVG(`BLACK_${piece}` as FullPieceProperty)">
            </div>

            <div v-for="piece in whiteKilledPieces" class="piece"
              v-html="getPieceSVG(`WHITE_${piece}` as FullPieceProperty)" :key="piece">
            </div>
          </div>
        </div>
        <div id="damier" class="p-4">

          <div class="chess-board">
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
              ]" @click="handleCellClick(row, col)">
                <span v-if="col === 1" :class="['topleft', ((row + col) % 2 === 0) ? 'text-noir' : 'text-white']">
                  {{ 9 - row }}
                </span>

                <span v-if="row === 8" :class="['bottomleft', ((row + col) % 2 === 0) ? 'text-noir' : 'text-white']">
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

        <div class="text-center mt-4">
          <Button label="Quitter la partie" @click="quitGame" />
        </div>

        <!-- Modale de promotion -->
        <Dialog v-model:visible="showPromotionDialog" modal header="Choisissez une pièce" :closable="false">
          <div class="flex justify-content-center gap-4">
            <div v-for="piece in availablePromotionPieces" :key="piece" class="cursor-pointer piece promotion-piece"
              @click="handlePromotion(removePieceColor(piece))" v-html="getPieceSVG(piece)">
            </div>
          </div>
        </Dialog>

        <!-- Modale de fin de partie -->
        <Dialog v-model:visible="showGameOverDialog" modal header="Partie terminée" :closable="false">
          <div class="text-center">
            <h2 class="mb-4">{{ gameOverMessage }}</h2>
            <Button label="Retour à l'accueil" @click="goToHome" />
          </div>
        </Dialog>
      </div>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Color, PIECES_SVG, PieceType, type FullPieceProperty, type Piece } from '@/model/Pieces.model';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useGameService } from '@/composables/game/gameService';
import router from '@/router';
import { AxiosError } from 'axios';
import { ResultPossible, type GameModel, type Case } from '@/model/Game.model';
import type { PossibleMove } from '@/model/PossibleMove.model';

const toast = useToast();
const { move, getCurrentGame, getPossibleMoves, promote, deleteGame } = useGameService();

const initialBoard: Case[][] = Array(8).fill(null).map(() =>
  Array(8).fill(null).map(() => ({ color: Color.WHITE, piece: undefined }))
);

const board = ref<Case[][]>(initialBoard);
const colorPlayer = ref<'Noirs' | 'Blancs'>();
const blackKilledPieces = ref<PieceType[]>([]);
const whiteKilledPieces = ref<PieceType[]>([]);

const availablePromotionPieces = ref<FullPieceProperty[]>([]);

const selectedPiece = ref<{ row: number, col: number } | null>(null);
const possibleMoves = ref<PossibleMove[]>([]);
const lastMove = ref<{ fromI: number; fromJ: number; toI: number; toJ: number; } | null>(null);

// États pour les modales
const showPromotionDialog = ref(false);
const showGameOverDialog = ref(false);
const gameOverMessage = ref('');
const promotionPosition = ref<{ i: number; j: number; } | null>(null);

const isSelectedCell = (row: number, col: number): boolean => {
  return selectedPiece.value?.row === row && selectedPiece.value?.col === col;
};

const isLastMoveFrom = (row: number, col: number): boolean => {
  return lastMove.value?.fromI === row && lastMove.value?.fromJ === col;
};

const isLastMoveTo = (row: number, col: number): boolean => {
  return lastMove.value?.toI === row && lastMove.value?.toJ === col;
};

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

    handleGameResult(response, -1, -1);
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
  const currentPlayerColor = colorPlayer.value === 'Noirs' ? Color.BLACK : Color.WHITE;

  // Si on clique sur la pièce déjà sélectionnée, on la désélectionne
  if (selectedPiece.value?.row === row - 1 && selectedPiece.value?.col === col - 1) {
    selectedPiece.value = null;
    possibleMoves.value = [];
    return;
  }

  if (selectedPiece.value === null) {
    if (currentCase.piece && currentCase.piece.color === currentPlayerColor) {
      selectedPiece.value = { row: row - 1, col: col - 1 };

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
        // Mettre à jour le dernier mouvement
        lastMove.value = {
          fromI: selectedPiece.value.row,
          fromJ: selectedPiece.value.col,
          toI: row - 1,
          toJ: col - 1
        };

        board.value = response.listCase;
        colorPlayer.value = response.turn === Color.BLACK ? 'Noirs' : 'Blancs';
        blackKilledPieces.value = parsePieceKilled(response.pieceKilled, Color.BLACK);
        whiteKilledPieces.value = parsePieceKilled(response.pieceKilled, Color.WHITE);
        possibleMoves.value = [];

        handleGameResult(response, row, col);
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

const handlePromotion = async (pieceType: PieceType) => {
  if (!promotionPosition.value) return;

  try {
    const response = await promote(
      pieceType
    );

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
  // Gestion des résultats multiples
  if (game.result && game.result.length > 0) {
    for (const resultStr of game.result) {
      const [result, color] = resultStr.split(':') as [ResultPossible, Color];
      switch (result) {
        case ResultPossible.KINGLOSE:
          gameOverMessage.value = `Les ${color === Color.BLACK ? 'Blancs' : 'Noirs'} ont gagné !`;
          showGameOverDialog.value = true;
          return; // On sort immédiatement car c'est la fin du jeu

        case ResultPossible.WHITEPROMOTION:
        case ResultPossible.BLACKPROMOTION:
          if (row === -1 || col === -1) return;
          promotionPosition.value = { i: row - 1, j: col - 1 };
          availablePromotionPieces.value = color === Color.BLACK ? blackKilledPieces.value.filter(piece => piece != PieceType.PAWN).map(piece => `BLACK_${piece}` as FullPieceProperty) : whiteKilledPieces.value.filter(piece => piece != PieceType.PAWN).map(piece => `WHITE_${piece}` as FullPieceProperty);
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

const isPossibleMove = (row: number, col: number): boolean => {
  return possibleMoves.value.some(move => move.i === row && move.j === col);
};

const getPieceSVG = (pieceType: FullPieceProperty | null) => {
  return pieceType ? PIECES_SVG[pieceType] : '';
};

const getPieceFullProperty = (piece: Piece): FullPieceProperty => {
  return `${piece.color}_${piece.pieceType}` as FullPieceProperty;
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

const removePieceColor = (pieceType: FullPieceProperty): PieceType => {
  return pieceType.split('_')[1] as PieceType;
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
  position: relative
}

.possible-move::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  height: 25px;
  width: 25px;
  border-radius: 50%;
  background-color: #606060;
  transform: translateX(-50%) translateY(-50%);
}

.selected-cell {
  animation: pulse 2s infinite;
}

.last-move-from,
.last-move-to {
  background-color: rgba(255, 255, 0, 0.3) !important;
}

@keyframes pulse {
  0% {
    box-shadow: inset 0 0 0 8px rgba(0, 128, 255, 0.4);
  }

  50% {
    box-shadow: inset 0 0 0 8px rgba(0, 128, 255, 0.2);
  }

  100% {
    box-shadow: inset 0 0 0 8px rgba(0, 128, 255, 0.4);
  }
}

.piece {
  width: 60px;
  height: 60px;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.piece svg {
  width: 100%;
  height: 100%;
}



.noir {
  background-color: #739552;
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

.promotion-piece {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.promotion-piece:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.bg-white {
  background-color: #EBECD0 !important;
}

@media screen and (max-width: 768px) {
  #main {
    flex-direction: column;
  }
}
</style>
