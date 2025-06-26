<template>
  <v-dialog activator="parent" max-width="340">
    <template v-slot:default="{ isActive }">
      <VForm v-model="valid" @submit.prevent="handleSubmit">
        <v-card prepend-icon="mdi-picture-in-picture-bottom-right"
          :title="`${isEdit ? 'Modificar' : 'Añadir'} un producto`">
          <template #text>
            <VRow>
              <VCol cols="12">
                <VTextField v-model="form.name" label="Nombre del producto" :rules="[rules.required]" required />
              </VCol>

              <VCol cols="12" md="6">
                <VTextField v-model.number="form.price" label="Precio" type="number"
                  :rules="[rules.required, rules.minZero]" required />
              </VCol>
            </VRow>
          </template>
          <VDivider />
          <template v-slot:actions>
            <VBtn text="Cancel" variant="plain" @click="isActive.value = false" />
            <VSpacer />
            <VBtn text="Save" type="submit" />
          </template>
        </v-card>
      </VForm>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Product } from '@/types/product';

const props = defineProps<{
  isEdit?: boolean
  modelValue?: Product | null
}>()

const form = ref<Product>({
  name: '',
  price: 0
})

const valid = ref(false)

const rules = {
  required: (v: any) => !!v || 'This field is required',
  minZero: (v: number) => v >= 0 || 'Must be 0 or greater'
}
const emit = defineEmits(['submit']);

const handleSubmit = () => {
  console.log(form.name.value, form.price.value);
  emit('submit', form)
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      form.value.name = val.name
      form.value.price = val.price
    }
  },
  { immediate: true }
)
</script>
