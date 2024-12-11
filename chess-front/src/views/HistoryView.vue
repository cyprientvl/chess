<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-gray-100">
    <Card class="w-8">
      <template #title>
        <div class="text-center mb-4">
          <h1>Historique des parties</h1>
        </div>
      </template>
      <template #content>
        <div class="flex-col flex justify-content-center">
          <div v-if="loading" class="text-center">
            <ProgressSpinner style="width: 50px; height: 50px" />
          </div>
          <div v-else>
            <DataTable :value="history" tableStyle="min-width: 50rem" selectionMode="single">
              <Column field="creation_date" header="creation_date" :sortable="true" />
            </DataTable>
          </div>
        </div>
      </template>
    </Card>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import router from '@/router';

import type { HistoryModel } from '@/model/History.model';

import { useLeaderboardService } from '@/composables/leaderboard/leaderboardService';
const { getUserHistory } = useLeaderboardService();

const toast = useToast();
const loading = ref(true);
const history = ref<HistoryModel[]>([]);


const loadHistory = async () => {
  try {
    loading.value = true;
    const response = await getUserHistory(Number(router.currentRoute.value.params.userId));
    history.value = response;
    loading.value = false;
  } catch {
    loading.value = false;
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de récupérer l\'historique des parties',
      life: 3000
    });
  }
};

// Vérifier la partie au chargement du composant
onMounted(() => {
  loadHistory();
});
</script>

<style scoped>
.p-card {
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
