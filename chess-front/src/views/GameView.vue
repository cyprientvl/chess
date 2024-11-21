<template>
  <div id="game">

    <GameBoard />
  </div>

</template>

<script setup lang="ts">
import GameBoard from '@/components/GameBoard.vue';
</script>

<style scoped>
#game {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
