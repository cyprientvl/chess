<template>
  <Toast />

  <div class="layout">
    <AppMenu />

    <main style="margin-left: 180px;">
      <RouterView />
    </main>

  </div>
  
</template>

<script setup lang="ts">
import Toast from "primevue/toast";
import AppMenu from "./AppMenu.vue";

</script>
