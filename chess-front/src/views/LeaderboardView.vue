<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-gray-100">
    <Card class="w-8">
      <template #title>
        <div class="text-center mb-4">
          <h1>Leaderboard</h1>
          <span>Cliquez sur un joueur pour voir son historique</span>
        </div>
      </template>
      <template #content>
        <div class="flex-col flex justify-content-center">
          <div v-if="loading" class="text-center">
            <ProgressSpinner style="width: 50px; height: 50px" />
          </div>
          <div v-else>
            <DataTable :value="leaderboard" tableStyle="min-width: 50rem" @rowSelect="navigateToProfile"
              selectionMode="single" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]" filterDisplay="menu"
              :globalFilterFields="['username', 'score', 'rank']">
              <Column field="rank" header="Position" :sortable="true">
                <template #body="{ data }">
                  <div class="flex align-items-center">
                    <span :class="getRankClass(data.rank)">
                      {{ data.rank }}
                      {{ getRankIcon(data.rank) }}
                    </span>
                  </div>
                </template>
              </Column>

              <Column field="username" header="Joueur" :sortable="true">
                <template #body="{ data }">
                  <div class="flex align-items-center cursor-pointer hover:text-blue-500">
                    <i class="pi pi-user mr-2"></i>
                    {{ data.username }}
                  </div>
                </template>
              </Column>

              <Column field="score" header="Score" :sortable="true">
                <template #body="{ data }">
                  <div class="flex align-items-center">
                    <Tag :severity="getScoreSeverity(data.score)" :value="data.score.toString()" />
                  </div>
                </template>
              </Column>

              <template #empty>
                <div class="text-center p-4">
                  Aucun joueur trouvé
                </div>
              </template>

              <template #loading>
                <div class="text-center p-4">
                  Chargement du classement...
                </div>
              </template>
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
import { useLeaderboardService } from '@/composables/leaderboard/leaderboardService';
import type { LeaderboardModel } from '@/model/Leaderboard.model';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

const { getLeaderboard } = useLeaderboardService();
const leaderboard = ref<LeaderboardModel[]>([]);
const router = useRouter();
const toast = useToast();
const loading = ref(true);

const getRankClass = (rank: number): string => {
  if (rank === 1) return 'text-yellow-500 font-bold text-xl';
  if (rank === 2) return 'text-gray-400 font-bold text-lg';
  if (rank === 3) return 'text-amber-700 font-bold text-lg';
  return 'text-gray-700';
};

const getRankIcon = (rank: number): string => {
  if (rank === 1) return '👑';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
};

const getScoreSeverity = (score: number): string => {
  if (score >= 2000) return 'success';
  if (score >= 1500) return 'info';
  if (score >= 1000) return 'warning';
  return 'danger';
};

onMounted(async () => {
  try {
    const response = await getLeaderboard();
    leaderboard.value = response;
    loading.value = false;
  } catch {
    loading.value = false;
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger le classement',
      life: 3000
    });
  }
});

const navigateToProfile = (event: { data: LeaderboardModel }) => {
  router.push(`/history/${event.data.userId}`);
};
</script>

<style scoped>
.p-card {
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.p-datatable {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:text-blue-500:hover {
  color: #3B82F6;
}
</style>
