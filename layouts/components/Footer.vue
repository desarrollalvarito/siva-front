<script setup>
const icons = [
  'mdi-facebook',
  'mdi-twitter',
  'mdi-linkedin',
  'mdi-instagram',
]
</script>

<template>
  <VFooter
    class="d-flex flex-column"
    color="teal"
    rounded="lg"
  >
    <div class="d-flex w-100 align-center px-4 py-2">
      <p>&copy; {{ new Date().getFullYear() }} Developed by <strong> Mendozalvarito</strong></p>

      <div class="d-flex ga-2 ms-auto">
        <VBtn
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          size="small"
          variant="plain"
        />
      </div>
    </div>
  </VFooter>
</template>
