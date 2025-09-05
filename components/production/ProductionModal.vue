<script setup lang="ts">
import type { Product, Production, ProductionProduct } from '@/types/model';
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

const { employees, fetchEmployees } = useEmployee()
const searchCook = ref('')
const isEditing = computed(() => props.isEdit && props.production?.id)
const selectedProduct = ref<Product | null>(null)
const productQuantity = ref(1)
// Fechas mínima y máxima
const minDate = new Date().toISOString().split('T')[0]
const maxDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

// Formulario reactivo
const form = ref<Production>({
  id: 0,
  cook: {
    workShift: '',
    jobRole: '',
    person: { id: 0, run: '', names: '', lastName: '', gender: '', birthdate: null },
  },
  date: null,
  status: '',
  productionProduct: []
})

// Datos de productos con órdenes y producción
const orderProductions = computed(() => {
  return props.ordersProductions.map(item => ({
    id: item.id,
    name: item.name,
    orders: item.orders,
    productions: item.productions,
    quantity: calculateQuantity(item)
  }))
})

// Calcular pendientes
const calculateQuantity = (item: any) => {
  const productionSelected = form.value.productionProduct.filter((pp: ProductionProduct) => pp.id === item.id)
  // Accede de forma segura al primer elemento si existe
  if (productionSelected.length > 0) {
    // Aquí puedes usar productionSelected[0] para 
    // 
    // obtener la cantidad producida, por ejemplo:
    return productionSelected[0].quantity
  }
  // Si no hay producción registrada, retorna la cantidad total de órdenes pendientes
  return 0
}

const formEmpty = JSON.parse(JSON.stringify(form.value))

const resetForm = () => {
  form.value = JSON.parse(JSON.stringify(formEmpty))
  searchCook.value = ''
}

// Reglas de validación
const required = (v: string) => !!v || 'Campo requerido'
const positiveNumber = (v: number) => v > 0 || 'Debe ser mayor a 0'
const verifyMinDate = (v: string) => {
  const convert =
    v.split('/').reverse().reduce((final, value) => {
      return final === '' ? final + value : final + '-' + value
    })
  console.log(convert, minDate);
  console.log(adapter.date(convert), adapter.date(minDate));
  console.log(adapter.isBefore(adapter.date(convert), adapter.date(minDate)));
  return adapter.isBefore(adapter.date(convert), adapter.date(minDate)) ? 'La fecha no puede ser anterior a hoy' : true
}

// Sincronizar props al formulario
watch(() => props.production, newVal => {
  if (newVal) {
    form.value = JSON.parse(JSON.stringify(newVal)) // Clonar para evitar mutaciones directas
    if (isNullOrUndefined(newVal.cook)) {
      form.value.cook = JSON.parse(JSON.stringify(formEmpty.cook))
    }
    searchCook.value = newVal?.cook?.person.names || ''
    selectedProduct.value = null // Reiniciar selección de producto
    productQuantity.value = 1 // Reiniciar cantidad de producto
    form.value.date = newVal.date ? adapter.date(new Date(newVal.date).toISOString().split('T')[0]) : adapter.date(new Date())
  }
  else resetForm()
}, { immediate: true })

// Método para habilitar campos
const fieldsEnabled = computed(() => {
  return isEditing.value || (form.value.cook?.id ?? 0) > 0 ? true : false
})

const handleSubmit = () => {
  emit('submit', form.value)
  emit('update:modelValue', false)
}

const handleCookSelect = (cookId: number) => {
  const selected = employeeFiltered.value.find(emp => emp.id === cookId)
  if (selected && form.value.cook) {
    form.value.cook = { ...selected }
    searchCook.value = selected.displayName
  }
}

const employeeFiltered = computed(() => {
  return employees.value
    .filter(emp => {
      // Validaciones seguras
      if (!emp || !emp.jobRole) return false
      return emp.jobRole.toUpperCase().includes('BAKER')
    })
    .map(emp => ({
      ...emp,
      displayName: `${emp.person?.names || ''} ${emp.person?.lastName || ''}`.trim() || 'Nombre no disponible',
      // Información adicional útil
      subtitle: `RUN: ${emp.person?.run || 'N/A'} - TURNO: ${emp.workShift || 'N/A'}`
    }))
})

const totalItems = computed(() => {
  return orderProductions.value.reduce((total, product) => {
    // Convertir a número y asegurar valor válido
    console.log(product.quantity);
    const quantity = Number(product.quantity) || 0
    return total + quantity
  }, 0)
})

const cancel = () => {
  emit('update:modelValue', false)
  resetForm()
}

onMounted(async () => {
  fetchEmployees()
})
</script>

<template>
  <VDialog max-width="750" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <VForm @submit.prevent="handleSubmit">
      <VCard :title="`${isEdit ? 'Modificar' : 'Nueva'} producion`">
        <VCardText>
          <VRow>
            <VCol cols="12" md="6">
              <VAutocomplete v-model="form.cook.id" :items="employeeFiltered" label="Seleccionar Hornero"
                item-title="person.names" item-value="id" placeholder="Buscar Hornero por RUN" clearable
                :hide-no-data="false" :search="searchCook" @update:model-value="handleCookSelect" :rules="[required]"
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
            <VDataTable :headers="headersProductionProducts" :items="orderProductions" hide-default-footer>
              <template v-slot:top>
                <VToolbar flat>
                  <VToolbarTitle>
                    <VIcon color="medium-emphasis" icon="mdi-food" size="x-small" start />
                    Productos Ordenados
                  </VToolbarTitle>
                </VToolbar>
              </template>
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.name }}</td>
                  <td align="right">$ {{ item.orders - item.productions }}</td>
                  <td>
                    <VTextField v-model.number="item.quantity" type="number" min="1" density="compact" hide-details
                      @update:model-value=""></VTextField>
                  </td>
                  <td align="right">$ {{ item.orders - (item.quantity + item.productions) }}</td>
                </tr>
              </template>
              <template v-slot:bottom>
                <div class="text-h6 pa-4">Total: {{ totalItems }} producto{{ totalItems !== 1 ? 's' : '' }} asignados
                </div>
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
