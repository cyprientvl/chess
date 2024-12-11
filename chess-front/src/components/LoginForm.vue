<template>

  <div id="login-page">

    <img class="login-logo" src="/assets/img/logo.png">

    <img class="background-logo-image" src="/assets/img/chessboard-background.346891ba.png">

    <div style="width: 400px;">
      <div class="base-container">
        <form @submit.prevent="login">

          <small id="username-error" class="p-error" v-if="submitted && !username">
            Username is required.
          </small>
          <div class="form-container">
            <img src="/assets/img/profile.png">
            <InputText id="username" placeholder="Nom d'utilisateur" v-model="username"
              :class="{ 'p-invalid': submitted && !username }" fluid aria-describedby="username-error" />
          </div>

          <small id="password-error" class="p-error" v-if="submitted && !password">
            Password is required.
          </small>
          <div class="form-container">
            <img src="/assets/img/lock.png">
            <Password placeholder="Mot de passe" id="password" v-model="password" :feedback="false" toggleMask
              class="w-full" :class="{ 'p-invalid': submitted && !password }" aria-describedby="password-error" fluid />

          </div>

          <Button type="submit" label="Se connecter" class="w-6" :loading="loading" />

        </form>

        <div class="separator">
          <div class="ligne"></div>
          <p>OU</p>
          <div class="ligne"></div>
        </div>

        <Button type="button" label="S'inscrire" severity="secondary" @click="register" class="w-6 register"
          :disabled="loading" />

      </div>
      <div class="new">
        <p>Nouveau ?</p>
        <p>Inscrivez-vous et commencez à jouer aux échecs !</p>
      </div>

    </div>
  </div>
  <Toast />

</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useUserService } from '@/composables/user/userService';
import { AxiosError } from 'axios';
const { authenticate } = useUserService();

const router = useRouter();
const toast = useToast();
const username = ref('');
const password = ref('');
const loading = ref(false);
const submitted = ref(false);

const emit = defineEmits<{
  (e: 'loginSuccess', username: string): void
}>();

const login = async () => {
  submitted.value = true;

  if (!username.value || !password.value) {
    return;
  }

  try {
    loading.value = true;
    await authenticate({ username: username.value, password: password.value });

    emit('loginSuccess', username.value);
    router.push('/');

  } catch (error) {
    if (error instanceof AxiosError && error?.response?.status === 404) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'User not found',
        life: 3000
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Login failed',
        life: 3000
      });
    }
  } finally {
    loading.value = false;
  }
};

const register = () => {
  router.push('/register');
};
</script>

<style scoped>
.p-card {
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.register {
  width: 100% !important;
  margin-top: 20px;
}
</style>
