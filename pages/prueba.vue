<template>
  <Parent ref="childRef" />
  <button @click="childRef.open()">Abrir diálogo</button>
</template>

<script setup lang="ts">
const childRef = ref(null)
</script>
