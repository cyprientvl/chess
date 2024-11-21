<template>
  <Toast />
  <AppMenu />

  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import Toast from "primevue/toast";
import AppMenu from "./AppMenu.vue";

</script>
