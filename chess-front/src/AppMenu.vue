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
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a :href="href" @click="navigate">
              <img v-if="item.icon" :src="'/assets/img/'+item.icon" alt="nav-icon" />
              <p>{{ item.label }}</p>
            </a>
          </router-link>
          <a v-else>
            <img v-if="item.icon" :src="'/assets/img/'+item.icon" alt="nav-icon" />
            <p>{{ item.label }}</p>
          </a>
        </li>
        <li>
          <a class="create-account">
            Créer un compte
          </a>
        </li>
        <li>
          <a class="login-btn">
            Se connecter
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Menubar from "primevue/menubar";

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
  },
  {
    label: 'Compte',
    icon: 'nav-item-1.png',
    route: '/account'
  }
]);
</script>
