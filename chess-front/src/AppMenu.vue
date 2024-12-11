<template>
  <aside class="sidebar">
    <!-- Logo Section -->
    <div class="logo">
      <img src="/assets/img/logo.png" alt="Logo" />
    </div>

    <!-- Navigation Section -->
    <nav>
      <ul>
        <li v-for="(item, index) in items" :key="index">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a :href="href" @click="navigate">
              <img v-if="item.icon" :src="'/assets/img/' + item.icon" alt="nav-icon" />
              <p>{{ item.label }}</p>
            </a>
          </router-link>
          <a v-else>
            <img v-if="item.icon" :src="'/assets/img/' + item.icon" alt="nav-icon" />
            <p>{{ item.label }}</p>
          </a>
        </li>
        <li>
          <a class="create-account" href="/register">
            Créer un compte
          </a>
        </li>
        <li>
          <a class="login-btn" href="/login">
            Se connecter
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { ref } from "vue";
import { onMounted } from 'vue';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const items = ref([
  {
    label: 'Accueil',
    icon: 'nav-item-1.png',
    route: '/',
  },
  {
    label: 'Leaderboard',
    icon: 'nav-item-1.png',
    route: '/leaderboard'
  }
]);

onMounted(() => {
  if (isAuthenticated.value) {
    items.value.push({
      label: 'Compte',
      icon: 'nav-item-1.png',
      route: '/account'
    });
  }
});
</script>
