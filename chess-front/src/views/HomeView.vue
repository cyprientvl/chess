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
                <div class="start-game" @click="createGameButton">
                  <img src="/assets/img/play.png">
                  <div>
                      <p class="start-game-title">Commencer une partie</p>
                      <p>Jouez avec un amie en local</p>
                  </div>
                </div>
          </template>
          <template v-else>
            <div class="start-game" @click="joinGame">
                <img src="/assets/img/play.png">
                <div>
                    <p class="start-game-title">Partie en cours : #{{ gameId }}</p>
                    <p>Jouez avec un amie en local</p>
                </div>
              </div>
          </template>
      </div>
    </div>
    <Toast />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';

import { useGameService } from '@/composables/game/gameService';
const { getCurrentGameID, createGame } = useGameService();

const router = useRouter();
const toast = useToast();
const gameId = ref<number>(-1);
const loading = ref(true);
const creating = ref(false);

// Vérifier si l'utilisateur a une partie en cours
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

// Créer une nouvelle partie
const createGameButton = async () => {
  try {
    creating.value = true;
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    await createGame({ isPublic: false, ownerColor: "BLACK" });

    // Rediriger vers la page de jeu avec l'ID reçu
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

// Rejoindre une partie existante
const joinGame = () => {
  if (gameId.value > -1) {
    router.push(`/game`);
  }
};

// Vérifier la partie au chargement du composant
onMounted(() => {
  checkUserGame();
});
</script>

<style scoped>
.p-card {
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
