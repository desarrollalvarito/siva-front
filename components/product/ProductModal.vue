<template>
  <VDialog max-width="600" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <VForm @submit.prevent="handleSubmit">
      <VCard :title="`${isEdit ? 'Modificar' : 'Nuevo'} producto`">
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VTextField v-model="form.name" label="Nombre del producto" :rules="[required]" />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model.number="form.price" label="Precio" type="number" step="0.01"
                :rules="[required, positiveNumber]" />
            </VCol>
          </VRow>
        </VCardText>

        <VDivider />

        <VCardActions class="bg-surface-light">
          <VBtn text="Cancelar" variant="plain" @click="$emit('update:modelValue', false)" />
          <VSpacer />
          <VBtn type="submit">
            {{ isEdit ? 'Actualizar' : 'Crear' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VForm>
  </VDialog>
</template>

<script setup lang="ts">
import type { Product } from '@/types/model';

const props = defineProps<{
  modelValue: boolean
  product?: Product | null
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', product: Product): void;
}>();

// Formulario reactivo
const form = ref<Product>({
  name: '',
  price: 0
});

// Reglas de validación
const required = (v: string) => !!v || 'Campo requerido';
const positiveNumber = (v: number) => v > 0 || 'Debe ser mayor a 0';

// Sincronizar props al formulario
watch(() => props.product, (newVal) => {
  if (newVal) form.value = { ...newVal };
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', form.value);
  emit('update:modelValue', false);
};
</script>
