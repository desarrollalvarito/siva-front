<script setup lang="ts">
import type { Order, Product } from '@/types/model';
import { useDate } from 'vuetify';
import { VDateInput } from 'vuetify/labs/components';

const adapter = useDate()

const props = defineProps<{
  modelValue: boolean
  order?: Order | null
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', order: Order): void
}>()


const { clients, fetchClients } = useClient()
const { products, fetchProducts } = useProduct()
const search = ref('')
const isEditing = computed(() => props.isEdit && props.order?.id)
const selectedProduct = ref<Product | null>(null)
const productQuantity = ref(1)

// Formulario reactivo
const form = ref<Order>({
  id: 0,
  date: null,
  quantity: 0,
  state: '',
  client: { id: 0, billName: '', rut: '', shippingAddress: '', personId: 0 },
  orderProduct: []
})

// Reglas de validación
const required = (v: string) => !!v || 'Campo requerido'
const positiveNumber = (v: number) => v > 0 || 'Debe ser mayor a 0'
const notAdded = (v: Product) => {
  if (v && form.value.orderProduct.some(op => op.product.id === v.id)) {
    return 'Producto añadido'
  }
  return true
}

const resetForm = () => {
  form.value = {
    id: 0,
    date: null,
    quantity: 0,
    state: '',
    client: { id: 0, billName: '', rut: '', shippingAddress: '', personId: 0 },
    orderProduct: []
  }
  search.value = ''
}

// Validar si el producto seleccionado ya ha sido agregado
const isProductAdded = computed(() => {
  return form.value.orderProduct.some(op => op.product.id === selectedProduct.value?.id)
})

// Sincronizar props al formulario
watch(() => props.order, newVal => {
  if (newVal) {
    form.value = JSON.parse(JSON.stringify(newVal)) // Clonar para evitar mutaciones directas
    search.value = newVal.client.rut || ''
    selectedProduct.value = null // Reiniciar selección de producto
    productQuantity.value = 1 // Reiniciar cantidad de producto
    form.value.date = newVal.date ? adapter.date(new Date(newVal.date).toISOString().split('T')[0]) : null
  } else {
    resetForm()
  }
}, { immediate: true })

// Método para habilitar campos
const fieldsEnabled = computed(() => {
  return isEditing.value || (form.value.client?.id ?? 0) > 0 ? true : false
})

const handleSubmit = () => {
  emit('submit', form.value)
  emit('update:modelValue', false)
}

const handleRutSelect = (clientId: number) => {
  const selected = clients.value.find(p => p.id === clientId)
  if (selected && typeof selected.id === 'number') {
    form.value.client = { ...selected }
    search.value = selected.billName
  }
}

const cancel = () => {
  emit('update:modelValue', false)
  resetForm()
}

const totalItems = computed(() => {
  if (!form.value.orderProduct || !Array.isArray(form.value.orderProduct)) {
    return 0
  }

  return form.value.orderProduct.reduce((total, product) => {
    if (product.state === 'INACTIVE') {
      return total // Omitir productos inactivos
    }
    // Convertir a número y asegurar valor válido
    const quantity = Number(product.quantity) || 0
    return total + quantity
  }, 0)
})

const addProduct = () => {
  if (selectedProduct.value && productQuantity.value > 0 && !isProductAdded.value) {
    // Verificar si el producto ya está en la lista
    const index = form.value.orderProduct.findIndex(op => op.product.id === selectedProduct.value?.id)
    if (index > -1) {
      // Si ya existe, actualizar la cantidad
      form.value.orderProduct[index].quantity += productQuantity.value
      form.value.orderProduct[index].state = 'ACTIVE' // Asegurar que el estado sea activo
    } else {
      // Si no existe, agregar nuevo producto
      form.value.orderProduct.push({
        orderId: Number(form.value.id),
        product: selectedProduct.value,
        quantity: productQuantity.value,
        aditional: false,
        state: 'ACTIVE' // Asignar estado activo al nuevo producto
      })
    }
    // Actualizar total
    updateTotal()
    selectedProduct.value = null
    productQuantity.value = 1
  }
}

const removeProduct = (item: Product) => {
  console.log(item);
  const index = form.value.orderProduct.findIndex(op => op.product.id === item.id)
  console.log(index);
  if (index > -1) {
    form.value.orderProduct[index].state = 'INACTIVE'
    form.value.orderProduct[index].quantity = 0
    updateTotal()
  }
}

const updateTotal = () => {
  // Forzar reactividad
  form.value.orderProduct = [...form.value.orderProduct]
}

onMounted(async () => {
  fetchClients();
  fetchProducts();
})
</script>

<template>
  <VDialog max-width="750" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <VForm @submit.prevent="handleSubmit">
      <VCard :title="`${isEdit ? 'Modificar' : 'Nueva'} Orden`">
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <VAutocomplete v-model="form.client.rut" :items="clients" label="Buscar por RUT" item-title="rut"
                item-value="id" placeholder="12345678-9" clearable :hide-no-data="false" :search="search"
                @update:search="val => search = val" @update:model-value="handleRutSelect" :rules="[required]"
                :disabled="fieldsEnabled">
                <template #item="{ props, item }">
                  <VListItem v-bind="props" :subtitle="item.raw.billName" :title="item.raw.rut" />
                </template>
              </VAutocomplete>
            </VCol>
            <VCol cols="12" md="6">
              <VDateInput v-model="form.date" label="Fecha de pedido" placeholder="01/01/1991" prepend-icon=""
                :rules="[required]" :disabled="!fieldsEnabled" />
            </VCol>
          </VRow>
          <VDivider class="my-4" />
          <VCard>
            <VDataTable :headers="headersOrderProducts" :items="form.orderProduct" hide-default-footer>
              <template v-slot:top>
                <VToolbar flat>
                  <VToolbarTitle>
                    <VIcon color="medium-emphasis" icon="mdi-food" size="x-small" start />
                    Productos
                  </VToolbarTitle>
                  <v-autocomplete v-model="selectedProduct" :items="products" item-title="name" item-value="id"
                    label="Seleccionar producto" return-object style="max-inline-size: 200px;" class="mr-4"
                    :disabled="!fieldsEnabled"></v-autocomplete>
                  <VTextField v-model.number="productQuantity" type="number" label="Cantidad" min="1"
                    style="max-inline-size: 120px;" class="mr-4" :disabled="!fieldsEnabled"></VTextField>
                  <VBtn class="me-2" prepend-icon="mdi-plus" rounded="lg" @click="addProduct" border
                    :disabled="!selectedProduct || !productQuantity || isProductAdded" text="Añadir" />
                </VToolbar>
                <VAlert v-if="isProductAdded" type="warning" icon="mdi-alert"> No se puede añadir 2 veces el mismo
                  producto
                </VAlert>
              </template>
              <template v-slot:item="{ item }">
                <tr v-if="item.state !== 'INACTIVE'">
                  <td>{{ item.product.name }}</td>
                  <td>{{ item.product.price }}</td>
                  <td>
                    <VTextField v-model.number="item.quantity" type="number" min="1" density="compact" hide-details
                      @update:model-value="updateTotal"></VTextField>
                  </td>
                  <td>{{ item.product.price * item.quantity }}</td>
                  <td>
                    <v-icon size="small" @click="removeProduct(item.product)" color="error">
                      mdi-delete
                    </v-icon>
                  </td>
                </tr>
              </template>
              <template v-slot:bottom>
                <div class="text-h6 pa-4">Total: {{ totalItems }} producto{{ totalItems !== 1 ? 's' : '' }}</div>
              </template>
            </VDataTable>
          </VCard>
        </VCardText>
        <VDivider />
        <VCardActions class="bg-surface-light">
          <VBtn text="Cancelar" variant="plain" @click="cancel" />
          <VSpacer />
          <VBtn type="submit">
            {{ isEdit ? 'Actualizar' : 'Crear' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VForm>
  </VDialog>
</template>
