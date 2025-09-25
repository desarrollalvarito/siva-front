<script setup lang="ts">
import type { Employee, Production } from '@/types/model';
import { useDate } from 'vuetify';
import { VDateInput } from 'vuetify/labs/components';

const adapter = useDate()

const props = defineProps<{
  modelValue: boolean
  production?: Production | null
  isEdit?: boolean
  ordersProductions: Array<{ id: number; name: string; productions: number; orders: number; }>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', production: Production): void
}>()

const { fetchEmployees } = useEmployee()
const employees = ref<Employee[]>([])
const isEditing = computed(() => props.isEdit && props.production?.id)
const formRef = ref()
const showError = ref(false)

// Fechas
const today = new Date()
const minDate = new Date().toISOString().split('T')[0]
const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

// Formulario reactivo
const form = ref<Production>({
  id: 0,
  cook: {
    id: 0,
    workShift: '',
    jobRole: '',
    person: { id: 0, run: '', names: '', lastName: '', gender: '', birthdate: null },
  },
  date: today,
  status: 'PENDING',
  productionProduct: []
})
const formEmpty = JSON.parse(JSON.stringify(form.value))

// Datos de productos procesados
const processedProducts = ref<Array<{
  id: number
  name: string
  orders: number
  productions: number
  pending: number
  quantity: number
  available: number
}>>([])

async function loadProduction() {
  employees.value = await fetchEmployees()
  calculateProcessedProducts()
}

// Calcular productos procesados
const calculateProcessedProducts = () => {
  processedProducts.value = props.ordersProductions.map(item => {
    // Buscar si ya existe una producción para este producto
    const existingProduction = form.value.productionProduct.find(pp => pp.product.id === item.id)
    const quantity = existingProduction ? existingProduction.quantity : 0
    const pending = Math.max(0, item.orders - item.productions)

    return {
      id: item.id,
      name: item.name,
      orders: item.orders,
      productions: item.productions,
      pending: pending,
      quantity: quantity,
      available: (item.productions + quantity) - item.orders
    }
  })
}

await loadProduction()

// Actualizar cantidad de producción
const updateProductionQuantity = (productId: number, quantity: number) => {
  // Validar que la cantidad no sea negativa
  const validQuantity = Math.max(0, quantity)

  // Buscar el índice del producto en productionProduct
  const index = form.value.productionProduct.findIndex(pp => pp.product.id === productId)

  if (index !== -1) {
    // Actualizar cantidad existente
    if (validQuantity >= 0) {
      form.value.productionProduct[index].quantity = validQuantity
    } else {
      // Eliminar si la cantidad es 0
      form.value.productionProduct.splice(index, 1)
    }
  } else if (validQuantity > 0) {
    // Agregar nuevo producto a la producción
    const product = props.ordersProductions.find(op => op.id === productId)
    if (product) {
      form.value.productionProduct.push({
        product: {
          id: product.id,
          name: product.name
        },
        quantity: validQuantity
      })
    }
  }

  // Recalcular los productos procesados
  calculateProcessedProducts()
}

// Calcular total de productos asignados
const totalAssigned = computed(() => {
  return processedProducts.value.reduce((total, product) => total + product.quantity, 0)
})

const hasProductAdded = computed(() => {
  return form.value.productionProduct.some(op => op.quantity > 0)
})

const resetForm = () => {
  form.value = JSON.parse(JSON.stringify(formEmpty))
  form.value.date = today
  calculateProcessedProducts()
}

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

// Sincronizar props al formulario
watch(() => props.production, newVal => {
  if (newVal) {
    form.value = JSON.parse(JSON.stringify(newVal))
    if (isNullOrUndefined(newVal.cook)) {
      form.value.cook = JSON.parse(JSON.stringify(formEmpty.cook))
    }
    form.value.date = newVal.date ? adapter.date(new Date(newVal.date).toISOString().split('T')[0]) : new Date()
    // Recalcular productos procesados después de cargar la producción
    calculateProcessedProducts()
  } else {
    resetForm()
  }
}, { immediate: true })

// Actualizar cuando cambian las órdenes de producción
watch(() => props.ordersProductions, () => {
  calculateProcessedProducts()
}, { deep: true })

// Método para habilitar campos
const fieldsEnabled = computed(() => {
  return isEditing.value || (form.value.cook.id) > 0 ? true : false
})

const handleCookSelect = (cookId: number) => {
  const selected = employeeFiltered.value.find(emp => emp.id === cookId)
  if (selected && form.value.cook) {
    form.value.cook = { ...selected }
  }
}

const employeeFiltered = computed(() => {
  return employees.value
    .filter(emp => {
      if (!emp || !emp.jobRole) return false
      return emp.jobRole.toUpperCase().includes('BAKER')
    })
    .map(emp => ({
      ...emp,
      displayName: `${emp.person?.names || ''} ${emp.person?.lastName || ''}`.trim() || 'Nombre no disponible',
      subtitle: `RUN: ${emp.person?.run || 'N/A'} - TURNO: ${emp.workShift || 'N/A'}`
    }))
})

const formatAvailable = (available: number) => {
  return available >= 0 ? 'Sobran: ' + Math.abs(available) : 'Faltan: ' + Math.abs(available)
}

// Validar cantidad máxima
const validateMaxQuantity = (product: any, quantity: number) => {
  // Puede producir hasta 500 de lo pendiente como máximo
  const maxQuantity = product.pending + 500
  return Math.min(quantity, maxQuantity)
}

const cancel = () => {
  emit('update:modelValue', false)
  resetForm()
}

const handleSubmit = async () => {
  // Validar el formulario antes de enviar
  const { valid } = await formRef.value.validate()
  if (valid && hasProductAdded.value) {
    submitForm()
  }
  if (!hasProductAdded.value) {
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 3000)
  }
}

const submitForm = () => {
  emit('submit', form.value)
  emit('update:modelValue', false)
}

</script>

<template>
  <VDialog max-width="900" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <VForm @submit.prevent="handleSubmit" ref="formRef">
      <VCard :title="`${isEdit ? 'Modificar' : 'Nueva'} producion`">
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <VAutocomplete v-model="form.cook.id" :items="employeeFiltered" label="Seleccionar Hornero"
                :item-title="getFullName" item-value="id" placeholder="Buscar Hornero por Nombre" clearable
                :hide-no-data="false" @update:model-value="handleCookSelect" :rules="[required]"
                :disabled="fieldsEnabled">
                <template #item="{ props, item }">
                  <VListItem v-bind="props" :subtitle="item.raw.subtitle" :title="item.raw.displayName" />
                </template>
              </VAutocomplete>
            </VCol>

            <VCol cols="12" md="6">
              <VDateInput v-model="form.date" label="Fecha de produccion" placeholder="01/01/1991" prepend-icon=""
                :rules="[required, verifyMinDate]" :disabled="!fieldsEnabled" :min="minDate" :max="maxDate" />
            </VCol>
          </VRow>
          <VDivider class="my-4" />
          <VCard>
            <VToolbar flat color="surface">
              <VToolbarTitle>
                <VIcon color="primary" icon="mdi-food" class="mr-2" />
                Asignación de Producción
              </VToolbarTitle>
              <VSpacer />
              <div class="d-flex align-center">
                <span class="text-body-2 mr-2">Total asignado:</span>
                <VChip color="primary" size="small">
                  {{ totalAssigned }} unidades
                </VChip>
              </div>
            </VToolbar>
            <VDataTable :headers="headersProductionProducts" :items="processedProducts" :items-per-page="-1"
              hide-default-footer class="elevation-1">
              <template v-slot:item.pending="{ item }">
                <VChip :color="item.pending > 0 ? 'orange' : 'green'" variant="flat">
                  {{ item.pending }}
                </VChip>
              </template>

              <template v-slot:item.productions="{ item }">
                <span class="font-weight-bold text-blue-darken-2">{{ item.productions }}</span>
              </template>

              <template v-slot:item.quantity="{ item }">
                <VTextField v-model.number="item.quantity" type="number" density="compact" variant="outlined"
                  hide-details class="quantity-input" style="max-inline-size: 100px;" :min="0" :max="item.pending + 500"
                  @update:model-value="updateProductionQuantity(item.id, $event)"
                  @blur="updateProductionQuantity(item.id, item.quantity)" :disabled="!fieldsEnabled" />
              </template>

              <template v-slot:item.available="{ item }">
                <VChip :color="item.available >= 0 ? 'green' : 'red'" variant="flat">
                  {{ formatAvailable(item.available) }}
                  <VIcon v-if="item.available < 0" icon="mdi-alert" class="ml-1" size="small" />
                </VChip>
              </template>
            </VDataTable>
            <VCardText class="bg-grey-lighten-4">
              <VRow v-if="showError" class="mb-2">
                <VCol cols="12">
                  <div class="pa-1 m-5 text-center bg-red rounded text-white color-red">
                    <VIcon icon="mdi-alert"></VIcon><span> Debe añadir al menos una cantidad a producir
                      para continuar
                    </span>
                  </div>
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12" md="6">
                  <div class="d-flex align-center">
                    <VIcon icon="mdi-information" color="info" class="mr-2" />
                    <span class="text-caption">
                      <strong>Órdenes Pendientes:</strong> Cantidad requerida por clientes
                    </span>
                  </div>
                </VCol>
                <VCol cols="12" md="6">
                  <div class="d-flex align-center">
                    <VIcon icon="mdi-information" color="info" class="mr-2" />
                    <span class="text-caption">
                      <strong>Stock Disponible:</strong> Stock resultante (Producción + Existente - Órdenes)
                    </span>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
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
