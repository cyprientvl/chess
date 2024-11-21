<template>
  <div id="game">
    <Suspense>
      <GameBoard />
      <template #fallback>
        <div class="flex justify-content-center align-items-center min-h-screen">
          <ProgressSpinner />
        </div>
      </template>
    </Suspense>
  </div>

</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import GameBoard from '@/components/GameBoard.vue';
import ProgressSpinner from 'primevue/progressspinner';
import { useGameService } from '@/composables/game/gameService';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { AxiosError } from 'axios';

const router = useRouter();
const toast = useToast();
const { getCurrentGameID } = useGameService();

onMounted(async () => {
  try {
    const response = await getCurrentGameID();
    if (!response || response.gameId === -1) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No game in progress' });
      router.push('/');
    }
  } catch (error) {
    if ((error as AxiosError).response?.status === 404) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'No game in progress' });
      router.push('/');
    }
  }
});
</script>

<style scoped>
#game {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
