<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-gray-100">
    <Card class="w-8">
      <template #title>
        <div class="text-center mb-4">
          <h1>Leaderboard</h1>
        </div>
      </template>
      <template #content>
        <div class="flex-col flex justify-content-center">
          <div v-if="loading" class="text-center">
            <ProgressSpinner style="width: 50px; height: 50px" />
          </div>
          <div v-else>
            <DataTable :value="leaderboard" tableStyle="min-width: 50rem" @rowSelect="navigateToProfile"
              selectionMode="single">
              <Column field="username" header="Username" :sortable="true" />
              <Column field="score" header="Score" :sortable="true" />
              <Column field="rank" header="Rank" :sortable="true" />
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
import { AxiosError } from 'axios';
import { useLeaderboardService } from '@/composables/leaderboard/leaderboardService';
import type { LeaderboardModel } from '@/model/Leaderboard.model';
const { getLeaderboard } = useLeaderboardService();
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
const leaderboard = ref<LeaderboardModel[]>([]);
const router = useRouter();
const toast = useToast();
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await getLeaderboard();
    leaderboard.value = response;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    const axiosError = error as AxiosError;
    toast.add({ severity: 'error', summary: 'Error', detail: axiosError.message, life: 3000 });
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
</style>
