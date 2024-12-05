<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-gray-100">
    <Card class="w-full md:w-6 lg:w-4">
      <template #title>
        <div class="text-center mb-4">
          <h1>Historique des parties</h1>
        </div>
      </template>
      <template #content>
        <div class="flex justify-content-center">
          <div v-if="loading" class="text-center">
            <ProgressSpinner style="width: 50px; height: 50px" />
          </div>
          <div v-else class="text-center">
            <template v-if="gameId === -1">
              <Button label="Créer une nouvelle partie" icon="pi pi-plus" @click="createGameButton" :loading="creating"
                class="w-full mb-3" />
            </template>
            <template v-else>
              <Button label="Rejoindre la partie" icon="pi pi-sign-in" @click="joinGame" severity="success"
                class="w-full mb-3" />
              <small class="block text-gray-600">Partie en cours : #{{ gameId }}</small>
            </template>
          </div>
        </div>
      </template>
    </Card>
    <Toast />
  </div>
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
