<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-gray-100">
    <Card class="w-full w-8">
      <template #title>
        <div class="text-center mb-4">
          <h1>Votre compte</h1>
        </div>
      </template>
      <template #content>
        <div class="text-center">
          <p class="mb-4">Connecté en tant que : {{ username }}</p>
        </div>
        <div class="flex justify-content-center gap-4">
          <Button label="Voir mon historique" @click="() => router.push('/history/me')" />
          <Button label="Modifier le profil" @click="showEditProfile = true" class="p-button-outlined" />
          <Button label="Se déconnecter" severity="danger" @click="handleLogout" :loading="loading" />
        </div>
      </template>
    </Card>
    <Toast />

    <EditProfileDialog v-model:visible="showEditProfile" @profile-updated="handleProfileUpdated" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import EditProfileDialog from '@/components/EditProfileDialog.vue';


const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const { username, loading } = storeToRefs(authStore);

const showEditProfile = ref(false);

const handleProfileUpdated = () => {
  toast.add({
    severity: 'success',
    summary: 'Succès',
    detail: 'Votre profil a été mis à jour avec succès',
    life: 3000
  });
};

const handleLogout = async () => {
  try {
    loading.value = true;

    authStore.logout();

    toast.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Vous avez été déconnecté avec succès',
      life: 3000
    });

    router.push('/login');
  } catch {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Une erreur est survenue lors de la déconnexion',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.p-card {
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
