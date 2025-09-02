<script setup lang="ts">


</script>

<template>
  <VCard variant="flat" border color="primary">
    <VCardText class="text-center">
      <VAvatar size="60" color="primary" variant="flat" class="mb-2">
        <VIcon size="30" color="white">mdi-clipboard-list</VIcon>
      </VAvatar>
      <div class="text-h4 font-weight-bold">{{ kpis.ordenesDisponibles }}</div>
      <div class="text-body-1 text-medium-emphasis">Órdenes Disponibles</div>
      <div class="text-caption text-success" v-if="kpis.ordenesDisponibles > 0">
        <VIcon size="16" color="success">mdi-arrow-up</VIcon>
        Por programar
      </div>
      <div class="text-caption text-error" v-else>
        <VIcon size="16" color="error">mdi-alert</VIcon>
        Sin órdenes
      </div>
    </VCardText>
  </VCard>
</template>
