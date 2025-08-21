<template>
  <VDialog v-model="dialog" max-width="400">
    <VCard>
      <VCardTitle class="text-h6" :class="recovery ? 'bg-warning' : 'bg-error'">
        <VIcon icon="mdi-alert" class="mr-2" />
        Confirmar {{ recovery ? "Recuperacion" : "Eliminacion" }}
      </VCardTitle>
      <VCardText>
        ¿Estás seguro de {{ recovery ? "recuperar" : "eliminar" }} el {{ tag }} {{ name }}?
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn @click="dialog = false">Cancelar</VBtn>
        <VBtn :color="recovery ? 'warning' : 'error'" @click="confirmDelete">
          {{ recovery ? "Recuperar" : "Eliminar" }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">

const props = defineProps<{
  tag: string
  name: string
  recovery?: boolean
}>();

const emit = defineEmits(['confirm']);

const dialog = ref(false);

const confirmDelete = async () => {
  emit('confirm');
  dialog.value = false;
};

// Método para abrir el diálogo desde el padre
const open = () => {
  dialog.value = true;
};

defineExpose({ open });
</script>
