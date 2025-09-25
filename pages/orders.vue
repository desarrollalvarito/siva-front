<script setup lang="ts">
import type { Order } from '@/types/model';
import { VDateInput } from 'vuetify/labs/components';

const { fetchOrders, createOrder, updateOrder, deleteOrder } = useOrder()
const dialogOpen = ref(false)
const isEditMode = ref(false)
const selectedOrder = ref<Order | null>(null)
const deleteDialog = ref()
const reportDialog = ref() // Referencia para el diálogo de reporte
const showSuccess = ref(false)
const textSuccess = ref('')
const recovery = ref(false)
const searchDate = ref<Date>(new Date())
const orders = ref<Order[]>([])
const loading = ref(false)
const error = ref<string>('')
const loadingAssignments = ref(false)

// Estado para las asignaciones de producción
const deliveryAssignments = computed(() => {
  return orders.value.filter(o => o.state && o.delivery?.status === 'PENDING')
    .map(o => ({
      ...o,
      totalAssigned: o.orderProduct.reduce((total, product) => total + product.quantity, 0),
      mountAssigned: o.orderProduct.reduce((total, product) => total + (product.quantity * product.product.price), 0),
    }))
})
const orderEmpty = ref<Order>({
  id: 0,
  date: null,
  quantity: 0,
  state: '',
  client: { id: 0, billName: '', rut: '', shippingAddress: '', person: { id: 0, run: '', names: '', lastName: '', gender: '', birthdate: null } },
  orderProduct: [],
  delivery: {
    id: 0,
    status: 'CANCELLED',
    driver: {
      id: 0,
      workShift: '',
      jobRole: '',
      person: { id: 0, run: '', names: '', lastName: '', gender: '', birthdate: null }
    }
  }
})

await loadOrders()

async function loadOrders(): Promise<void> {
  loading.value = true
  error.value = ''

  try {
    orders.value = await fetchOrders(searchDate.value.toISOString().split('T')[0])
    await new Promise(resolve => setTimeout(resolve, 2000))
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Métodos CRUD
const openDialog = (edit: boolean, order: Order | null = null) => {
  isEditMode.value = edit
  if (order) {
    // Si es edición, asignar el ordero seleccionado
    selectedOrder.value = { ...order } // Clonar para evitar mutaciones directas
  }
  else {
    // Si es creación, reiniciar el formulario
    selectedOrder.value = null
  }
  dialogOpen.value = true
}

const openDeleteDialog = (recoveryOption: boolean, order: Order) => {
  recovery.value = recoveryOption
  selectedOrder.value = order
  deleteDialog.value?.open()
}

const updateDate = async () => {
  await loadOrders()
}

// Cargar asignaciones de producción
const loadProductionAssignments = async () => {
  try {
    loadingAssignments.value = true
    // Simular carga de datos (en producción, esto vendría de tu API)
    setTimeout(() => {
      loadingAssignments.value = false
      // Abrir el diálogo de reporte
      reportDialog.value?.open()
    }, 2000)
  } catch (error) {
    console.error('Error cargando asignaciones:', error)
  }
}

const handleSubmit = async (order: Order) => {
  try {
    loading.value = true
    order.userAt = 1
    if (isEditMode.value && order.id) {
      // Actualizar
      await updateOrder(order)
    }
    else {
      // Crear (simula ID autoincremental)
      await createOrder(order)
    }
    textSuccess.value = `Orden ${isEditMode.value ? 'actualizada' : 'creada'} satisfactoriamente`
    showSuccess.value = true
    await loadOrders()
  }
  catch (error) {
    console.error('Error:', error)
  }
  finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (selectedOrder.value && typeof selectedOrder.value.id === 'number') {
    if (selectedOrder.value.state !== 'CANCELLED') {
      await deleteOrder(selectedOrder.value.id)
      textSuccess.value = 'Orden eliminado Satisfactoriamente'
    }
    else {
      selectedOrder.value.state = 'PENDING'
      await updateOrder(selectedOrder.value)
      textSuccess.value = 'Orden recuperado Satisfactoriamente'
    }
    showSuccess.value = true
    await loadOrders()
  }
}
</script>

<template>
  <VRow>
    <VCol cols="12" class="d-flex justify-end pa-4">
      <VBtn :disabled="deliveryAssignments.length === 0" color="secondary" prepend-icon="mdi-file-document-outline"
        rounded="lg" @click="loadProductionAssignments" :loading="loadingAssignments" elevation="1" class="mr-2">
        Reporte de entregas
      </VBtn>
    </VCol>
  </VRow>
  <VSheet border rounded class="mt-4">
    <ClientOnly>
      <VAlert v-if="error" type="error" class="mt-4" icon="mdi-database-off">
        Error de obtencion de datos: {{ error }}
      </VAlert>
      <VDataTable :headers="headersOrders" :hide-default-footer="orders?.length < 11" :items="orders" :loading="loading"
        loading-text="Cargando Pedidos...">
        <template #top>
          <VToolbar flat>
            <VToolbarTitle>
              <VIcon color="medium-emphasis" icon="mdi-food" size="x-small" start />
              Pedidos
            </VToolbarTitle>
            <VDateInput v-model="searchDate" label="Fecha de pedido" placeholder="01/01/1991"
              prepend-icon="mdi-calendar" style="max-inline-size: 250px;" class="mr-6" clearable
              @update:model-value="updateDate" />
            <VBtn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Añadir Pedido" border
              @click="openDialog(false, orderEmpty)" />
          </VToolbar>
        </template>

        <template #item.state="{ value }">
          <VChip :color="getStateColor(value)">
            {{ formatState(value) }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <div v-if="item.state === 'PENDING'" class="d-flex ga-2 justify-end">
            <VTooltip location="bottom">
              <template #activator="{ props: tooltipProps }">
                <VBtn v-bind="tooltipProps" icon="mdi-pencil" size="small" variant="text"
                  @click="openDialog(true, item)" />
              </template>
              <span>Editar</span>
            </VTooltip>
            <VTooltip location="bottom">
              <template #activator="{ props: tooltipProps }">
                <VBtn v-bind="tooltipProps" icon="mdi-close-circle" size="small" variant="text"
                  @click="openDeleteDialog(false, item)" />
              </template>
              <span>Cancelar</span>
            </VTooltip>
          </div>
          <div v-if="item.state === 'CANCELLED'" class="d-flex ga-2 justify-end">
            <VTooltip location="bottom">
              <template #activator="{ props: tooltipProps }">
                <VBtn v-bind="tooltipProps" icon="mdi-arrow-u-left-top-bold" size="small" variant="text"
                  @click="openDeleteDialog(true, item)" />
              </template>
              <span>Recuperar</span>
            </VTooltip>
          </div>
        </template>
        <template #no-data>
          No se han encontrado registros.
        </template>
      </VDataTable>
      <!-- Diálogo de Reporte de Asignaciones usando el componente separado -->
      <OrderReport ref="reportDialog" :assignments="deliveryAssignments" :date="searchDate" />
      <DeleteModal ref="deleteDialog" tag="Pedido de" :name="selectedOrder?.client?.billName ?? ''" :recovery="recovery"
        @confirm="handleDelete" />
      <OrderModal v-model="dialogOpen" :is-edit="isEditMode" :order="selectedOrder" @submit="handleSubmit" />
      <VSnackbar v-model="showSuccess">
        {{ textSuccess }}
      </VSnackbar>
    </ClientOnly>
  </VSheet>
</template>
