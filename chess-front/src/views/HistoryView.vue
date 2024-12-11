<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-gray-100">
    <Card class="w-8">
      <template #title>
        <div class="text-center mb-4">
          <h1>Historique des parties</h1>
          <span>Cliquez sur une partie pour la rejouer</span>
        </div>
      </template>
      <template #content>
        <div class="flex-col flex justify-content-center">
          <div v-if="loading" class="text-center">
            <ProgressSpinner style="width: 50px; height: 50px" />
          </div>
          <div v-else>
            <DataTable :value="history" tableStyle="min-width: 50rem" selectionMode="single" paginator :rows="10"
              @rowSelect="goToReplay" :rowsPerPageOptions="[5, 10, 20]">
              <Column field="id" header="ID" :sortable="true" />
              <Column field="owner.username" header="Joueur" :sortable="true" />
              <Column field="public" header="Visibilité" :sortable="true">
                <template #body="{ data }">
                  <span :class="data.public ? 'text-green-500' : 'text-red-500'">
                    {{ data.public ? 'Public' : 'Privé' }}
                  </span>
                </template>
              </Column>
              <Column field="owner_win" header="Victoires" :sortable="true" />
              <Column field="owner_color" header="Couleur" :sortable="true">
                <template #body="{ data }">
                  <div class="flex align-items-center">
                    <span :class="data.owner_color === 'WHITE' ? 'text-gray-800' : 'text-gray-900'">
                      {{ data.owner_color === 'WHITE' ? '⚪' : '⚫' }}
                      {{ data.owner_color === 'WHITE' ? 'Blanc' : 'Noir' }}
                    </span>
                  </div>
                </template>
              </Column>
              <Column field="creation_date" header="Date de création" :sortable="true">
                <template #body="{ data }">
                  {{ formatDate(data.creation_date) }}
                </template>
              </Column>
              <Column field="date_end" header="Date de fin" :sortable="true">
                <template #body="{ data }">
                  {{ data.date_end ? formatDate(data.date_end) : 'En cours' }}
                </template>
              </Column>
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
import Column from 'primevue/column';
import router from '@/router';
import type { HistoryModel } from '@/model/History.model';
import { useLeaderboardService } from '@/composables/leaderboard/leaderboardService';

const { getUserHistory, getConnectedUserHistory } = useLeaderboardService();

const toast = useToast();
const loading = ref(true);
const history = ref<HistoryModel[]>([]);

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const loadHistory = async () => {
  try {
    loading.value = true;
    let response: HistoryModel[] = [];
    if (router.currentRoute.value.params.userId === undefined) {
      response = await getConnectedUserHistory();
    } else {
      response = await getUserHistory(Number(router.currentRoute.value.params.userId));
    }

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

const goToReplay = (event: { data: HistoryModel }) => {
  router.push('/replay/' + event.data.id);
};

onMounted(() => {
  loadHistory();
});
</script>

<style scoped>
.p-card {
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.p-datatable {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
</style>
