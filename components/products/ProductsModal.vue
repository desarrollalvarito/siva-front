<template>
  <VDialog max-width="600" :model-value="dialog" @update:model-value="$emit('update:dialog', $event)">
    <VCard :title="`${isEdit ? 'Modificar' : 'Añadir'} un producto`">
      <template #text>
        <VForm v-model="valid" @submit.prevent="handleSubmit">
          <VRow>
            <VCol cols="12">
              <VTextField v-model="form.name" label="Nombre del producto" :rules="[rules.required]" required />
            </VCol>

            <VCol cols="12" md="6">
              <VTextField v-model.number="form.price" label="Precio" type="number"
                :rules="[rules.required, rules.minZero]" required />
            </VCol>
          </VRow>
        </VForm>
      </template>

      <VDivider />

      <VCardActions class="bg-surface-light">
        <VBtn text="Cancel" variant="plain" @click="$emit('update:dialog', false)" />
        <VSpacer />
        <VBtn text="Save" type="submit" />
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product';

defineProps<{
  isEdit?: boolean
  modelValue?: Product | null
  dialog: boolean
}>()

const form = reactive<Product>({
  name: '',
  price: 0
})

const valid = ref(false)

const rules = {
  required: (v: any) => !!v || 'This field is required',
  minZero: (v: number) => v >= 0 || 'Must be 0 or greater'
}
const emit = defineEmits(['submit', 'update:dialog']);

const handleSubmit = (form: Product) => {
  emit('submit', form),
    emit('update:dialog', false)
}
</script>
