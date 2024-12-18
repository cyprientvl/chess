<template>
  <div v-if="loading" class="text-center">
    <ProgressSpinner style="width: 50px; height: 50px" />
  </div>
  <div id="home-page">
    <div>
      <img class="playboard" src="/assets/img/standardboard.png">
    </div>
    <div class="">
      <h1>Jouez aux échecs en ligne sur le site n°1 !</h1>

      <template v-if="gameId === -1">
        <div class="start-game" @click="showGameDialog">
          <img src="/assets/img/play.png">
          <div>
            <p class="start-game-title">Commencer une partie</p>
            <p>Jouez avec un ami en local</p>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="start-game" @click="joinGame">
          <img src="/assets/img/play.png">
          <div>
            <p class="start-game-title">Partie en cours : #{{ gameId }}</p>
            <p>Jouez avec un en local</p>
          </div>
        </div>
      </template>
    </div>
  </div>

  <Dialog v-model:visible="displayGameDialog" modal header="Configuration de la partie" :style="{ width: '400px' }">
    <div class="flex flex-column gap-3">
      <div class="flex align-items-center">
        <label class="w-8rem">Visibilité :</label>
        <SelectButton v-model="gameSettings.isPublic" :options="[
          { label: 'Privée', value: false },
          { label: 'Publique', value: true }
        ]" optionLabel="label" optionValue="value" />
      </div>

      <div class="flex align-items-center">
        <label class="w-8rem">Couleur :</label>
        <SelectButton v-model="gameSettings.ownerColor" :options="[
          { label: 'Blancs', value: 'WHITE' },
          { label: 'Noirs', value: 'BLACK' }
        ]" optionLabel="label" optionValue="value" />
      </div>
    </div>

    <template #footer>
      <Button label="Annuler" icon="pi pi-times" @click="displayGameDialog = false" class="p-button-text" />
      <Button label="Créer la partie" icon="pi pi-check" @click="createGameButton" :loading="creating" autofocus />
    </template>
  </Dialog>

  <Toast />
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';

import { useGameService } from '@/composables/game/gameService';
const { getCurrentGameID, createGame } = useGameService();

const router = useRouter();
const toast = useToast();
const gameId = ref<number>(-1);
const loading = ref(true);
const creating = ref(false);
const displayGameDialog = ref(false);

const gameSettings = reactive({
  isPublic: false,
  ownerColor: "BLACK"
});

const checkUserGame = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await getCurrentGameID();
    gameId.value = response.gameId;
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de récupérer les informations de la partie',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const showGameDialog = () => {
  displayGameDialog.value = true;
};

const createGameButton = async () => {
  try {
    creating.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    await createGame(gameSettings);
    displayGameDialog.value = false;
    router.push(`/game`);
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de créer une nouvelle partie',
      life: 3000
    });
  } finally {
    creating.value = false;
  }
};

const joinGame = () => {
  if (gameId.value > -1) {
    router.push(`/game`);
  }
};

onMounted(() => {
  checkUserGame();
});
</script>

<style scoped>
.p-card {
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.p-selectbutton {
  display: flex;
}

.p-selectbutton .p-button {
  padding: 0.5rem 1rem;
}

.w-8rem {
  width: 8rem;
}
</style>
