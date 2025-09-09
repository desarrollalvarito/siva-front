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
const { employees, fetchEmployees } = useEmployee()
const { products, fetchProducts } = useProduct()
const searchClient = ref('')
const searchDriver = ref('')
const isEditing = computed(() => props.isEdit && props.order?.id)
const isDelivery = ref(false)
const selectedProduct = ref<Product | null>(null)
const productQuantity = ref(1)
// Fechas mínima y máxima
const minDate = new Date().toISOString().split('T')[0]
const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

// Formulario reactivo
const form = ref<Order>({
  id: 0,
  date: null,
  quantity: 0,
  state: '',
  client: { billName: '', rut: '', shippingAddress: '', person: { id: 0, run: '', names: '', lastName: '', gender: '', birthdate: null } },
  orderProduct: [],
  delivery: {
    status: 'CANCELLED',
    driver: {
      workShift: '',
      jobRole: '',
      person: { id: 0, run: '', names: '', lastName: '', gender: '', birthdate: null }
    }
  }
})

const formEmpty = JSON.parse(JSON.stringify(form.value))

// Reglas de validación
const required = (v: string) => !!v || 'Campo requerido'
const positiveNumber = (v: number) => v > 0 || 'Debe ser mayor a 0'
const verifyMinDate = (v: string) => {
  const convert =
    v.split('/').reverse().reduce((final, value) => {
      return final === '' ? final + value : final + '-' + value
    })
  return adapter.isBefore(adapter.date(convert), adapter.date(minDate)) ? 'La fecha no puede ser anterior a hoy' : true
}
const notAdded = (v: Product) => {
  if (v && form.value.orderProduct.some(op => op.product.id === v.id)) {
    return 'Producto añadido'
  }
  return true
}

const resetForm = () => {
  form.value = JSON.parse(JSON.stringify(formEmpty))
  searchClient.value = ''
}

// Validar si el producto seleccionado ya ha sido agregado
const isProductAdded = computed(() => {
  return form.value.orderProduct.some(op => op.product.id === selectedProduct.value?.id)
})

// Sincronizar props al formulario
watch(() => props.order, newVal => {
  if (newVal) {
    form.value = JSON.parse(JSON.stringify(newVal)) // Clonar para evitar mutaciones directas
    if (isNullOrUndefined(newVal.delivery)) {
      form.value.delivery = JSON.parse(JSON.stringify(formEmpty.delivery))
    }
    searchClient.value = newVal.client.billName || ''
    searchDriver.value = newVal?.delivery?.driver.person.names || ''
    selectedProduct.value = null // Reiniciar selección de producto
    productQuantity.value = 1 // Reiniciar cantidad de producto
    form.value.delivery?.status !== "CANCELLED" ? isDelivery.value = true : isDelivery.value = false
    form.value.date = newVal.date ? adapter.date(new Date(newVal.date).toISOString().split('T')[0]) : new Date()
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

const handleClientSelect = (clientId: number) => {
  const selected = clients.value.find(c => c.id === clientId)
  if (selected && typeof selected.id === 'number') {
    form.value.client = { ...selected }
    searchClient.value = selected.billName
  }
}

const handleDriverSelect = (driverId: number) => {
  const selected = employees.value.find(emp => emp.id === driverId)
  if (selected && form.value.delivery) {
    form.value.delivery.driver = { ...selected }
    searchDriver.value = selected.person.names + " " + selected.person.lastName
  }
}

const handleDeliverySwitch = () => {
  if (isDelivery.value && form.value.delivery) {
    form.value.delivery.status = "PENDING"
  }
  else {
    if (form.value.delivery) {
      form.value.delivery.status = "CANCELLED"
    }
  }
}

const employeeFiltered = computed(() => {
  return employees.value
    .filter(emp => {
      // Validaciones seguras
      if (!emp || !emp.jobRole) return false
      return emp.jobRole.toUpperCase().includes('DELIVERY')
    })
    .map(emp => ({
      ...emp,
      displayName: `${emp.person?.names || ''} ${emp.person?.lastName || ''}`.trim() || 'Nombre no disponible',
      // Información adicional útil
      subtitle: `RUT: ${emp.person?.run || 'N/A'} - ${emp.jobRole || 'N/A'}`
    }))
})

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
  const index = form.value.orderProduct.findIndex(op => op.product.id === item.id)
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
  fetchClients()
  fetchEmployees()
  fetchProducts()
})
</script>

<template>
  <VDialog max-width="750" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <VForm @submit.prevent="handleSubmit">
      <VCard :title="`${isEdit ? 'Modificar' : 'Nueva'} Orden`">
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <VAutocomplete v-model="form.client.id" :items="clients" label="Seleccionar Cliente" item-title="billName"
                item-value="id" placeholder="Buscar Cliente por RUT" clearable :hide-no-data="false"
                :search="searchClient" @update:model-value="handleClientSelect" :rules="[required]"
                :disabled="fieldsEnabled">
                <template #item="{ props, item }">
                  <VListItem v-bind="props" :subtitle="item.raw.billName" :title="item.raw.rut" />
                </template>
              </VAutocomplete>
            </VCol>
            <VCol cols="12" md="6">
              <VDateInput v-model="form.date" label="Fecha de pedido" placeholder="01/01/1991" prepend-icon=""
                :rules="[required, verifyMinDate]" :disabled="!fieldsEnabled" :min="minDate" :max="maxDate" />
            </VCol>
          </VRow>
          <VRow justify="end">
            <VCol cols="3" md="3" offset="3">
              <VSwitch v-model="isDelivery" :label="`${isDelivery ? 'Con' : 'Sin'} entrega`" prepend-icon=""
                :disabled="!fieldsEnabled" @update:model-value="handleDeliverySwitch" />
            </VCol>
            <VCol cols="6" md="6">
              <VAutocomplete v-model="form.delivery.driver.id" :items="employeeFiltered"
                :label="form.delivery ? 'Seleccionar conductor' : 'Active entrega para habilitar'"
                item-title="displayName" item-value="id" placeholder="Buscar conductor" clearable
                @update:model-value="handleDriverSelect" :disabled="!isDelivery">
                <template #item="{ props, item }">
                  <VListItem v-bind="props" :title="item.raw.displayName" :subtitle="item.raw.subtitle" />
                </template>
              </VAutocomplete>
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
                  <td align="right">$ {{ item.product.price }}</td>
                  <td>
                    <VTextField v-model.number="item.quantity" type="number" style="max-inline-size: 100px;" min="1"
                      density="compact" hide-details @update:model-value="updateTotal"></VTextField>
                  </td>
                  <td align="right">$ {{ item.product.price * item.quantity }}</td>
                  <td align="center">
                    <VTooltip location="bottom">
                      <template #activator="{ props: tooltipProps }">
                        <VIcon v-bind="tooltipProps" icon="mdi-delete" size="small" variant="text" color="error"
                          @click="removeProduct(item.product)" />
                      </template>
                      <span>Eliminar</span>
                    </VTooltip>
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
