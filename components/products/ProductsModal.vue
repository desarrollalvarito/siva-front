<template>
  <v-dialog v-model="dialog" max-width="500">
    <template #activator="{ props }">
      <slot name="activator" v-bind="props" />
    </template>

    <v-card>
      <v-card-title>
        <span class="text-h6">{{ isEdit ? 'Modificar' : 'Añadir' }} Product</span>
      </v-card-title>
      <v-card-text>
        <ProductsForm :isEdit="isEdit" :modelValue="modelValue" @submit="handleSubmit" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product';

defineProps<{
  isEdit?: boolean
  modelValue?: Product | null
}>()

const emit = defineEmits(['submit'])

const dialog = ref(false)

const handleSubmit = (form: Product) => {
  emit('submit', form)
  dialog.value = false
}
</script>
