<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-gray-100">
    <LoginForm />
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/LoginForm.vue';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const { isAuthenticated } = storeToRefs(authStore);

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/account');
  }
});
</script>
