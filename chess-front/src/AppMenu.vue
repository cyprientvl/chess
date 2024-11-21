<template>
  <header class="card">
    <Menubar :model="items">
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a :href="href" v-bind="props.action" @click="navigate">
            <span :class="[item.icon, 'text-color']" />
            <span class="text-primary font-semibold">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </Menubar>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Menubar from "primevue/menubar";

const items = ref([
  {
    label: 'Accueil',
    icon: 'pi pi-home',
    route: '/',
  },
  {
    label: 'Statistiques',
    icon: 'pi pi-chart-bar',
    route: '/stats'
  },
  {
    label: 'Compte',
    icon: 'pi pi-user',
    route: '/account'
  }
]);
</script>
