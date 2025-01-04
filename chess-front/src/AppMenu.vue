<template>
  <aside class="sidebar">
    <div class="logo">
      <router-link to="/">
        <img src="/assets/img/logo.png" alt="Logo" />
      </router-link>
    </div>

    <nav>
      <ul>
        <li>
          <router-link v-slot="{ href, navigate }" to="/" custom>
            <a :href="href" @click="navigate">
              <img src="/assets/img/nav-item-1.png" alt="nav-icon" />
              <p>Accueil</p>
            </a>
          </router-link>
        </li>

        <li>
          <router-link v-slot="{ href, navigate }" to="/leaderboard" custom>
            <a :href="href" @click="navigate">
              <img src="/assets/img/nav-item-1.png" alt="nav-icon" />
              <p>Classement</p>
            </a>
          </router-link>
        </li>

        <li v-if="isAuthenticated">
          <router-link v-slot="{ href, navigate }" to="/account" custom>
            <a :href="href" @click="navigate">
              <img src="/assets/img/nav-item-1.png" alt="nav-icon" />
              <p>Compte</p>
            </a>
          </router-link>
        </li>

        <li v-if="!isAuthenticated">
          <a class="create-account" href="/register">
            Créer un compte
          </a>
        </li>
        <li v-if="!isAuthenticated">
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

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

</script>
