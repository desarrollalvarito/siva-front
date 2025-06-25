<template>
  <v-form v-model="valid" @submit.prevent="handleSubmit">
    <v-text-field v-model="form.name" label="Nombre del producto" :rules="[rules.required]" required />
    <v-text-field v-model.number="form.price" label="Precio" type="number" :rules="[rules.required, rules.minZero]"
      required />

    <v-btn type="submit" color="primary" class="mt-4" :disabled="!valid">
      {{ isEdit ? 'Modificar' : 'Añadir' }}
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { Product } from '~/types/product';

const props = defineProps<{
  isEdit?: boolean
  modelValue?: Product | null
}>()

const emit = defineEmits<{
  (e: 'submit', product: Product): void
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

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      form.name = val.name
      form.price = val.price
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>
