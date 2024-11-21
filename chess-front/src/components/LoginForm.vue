<template>
  <div class="flex justify-content-center align-items-center min-h-screen bg-gray-100" style="width: 75em;">
    <Card class="w-full md:w-6 lg:w-4">
      <template #title>
        <div class="text-center mb-4">
          <h2>Login</h2>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="login" class="p-fluid">
          <div class="field mb-4">
            <label for="username" class="block mb-2">Username</label>
            <InputText id="username" v-model="username" :class="{ 'p-invalid': submitted && !username }" fluid
              aria-describedby="username-error" />
            <small id="username-error" class="p-error" v-if="submitted && !username">
              Username is required.
            </small>
          </div>

          <div class="field mb-4">
            <label for="password" class="block mb-2">Password</label>
            <Password id="password" v-model="password" :feedback="false" toggleMask
              :class="{ 'p-invalid': submitted && !password }" aria-describedby="password-error" fluid />
            <small id="password-error" class="p-error" v-if="submitted && !password">
              Password is required.
            </small>
          </div>

          <div class="flex gap-2 justify-content-between">
            <Button type="submit" label="Login" class="w-6" :loading="loading" />
            <Button type="button" label="Register" severity="secondary" @click="register" class="w-6"
              :disabled="loading" />
          </div>
        </form>
      </template>
    </Card>

    <Toast />
  </div>
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
    const response = await fetch('http://localhost:3000/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        grant_type: 'password',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username.value); // Stocker le nom d'utilisateur
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Login successful',
        life: 3000
      });
      emit('loginSuccess', username.value);
      router.push('/');
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error instanceof Error ? error.message : 'Login failed',
      life: 3000
    });
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
</style>
