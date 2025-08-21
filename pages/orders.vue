<script setup lang="ts">
import type { Order } from '@/types/model'

const { orders, loading, error, fetchOrders, createOrder, updateOrder, deleteOrder } = useOrder()
const dialogOpen = ref(false)
const isEditMode = ref(false)
const selectedOrder = ref<Order | null>(null)
const deleteDialog = ref()
const showSuccess = ref(false)
const textSuccess = ref('')
const recovery = ref(false)
const orderEmpty = <Order>{
  id: 0,
  date: null,
  quantity: 0,
  state: '',
  client: {
    id: 0,
    billName: '',
    rut: '',
    shippingAddress: '',
    personId: 0,
  },
  orderProduct: []
}

// Función para determinar el color según el estado
const getStateColor = (state: string) => {
  switch (state) {
    case 'PENDING': return 'warning'
    case 'COMPLETED': return 'success'
    case 'CANCELLED': return 'error'
    default: return 'secondary'
  }
}

// Función para formatear el estado para mostrar
const formatState = (state: string) => {
  const states: Record<string, string> = {
    PENDING: 'Pendiente',
    COMPLETED: 'Entregado',
    CANCELLED: 'Cancelado'
  }
  return states[state] || state
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

onMounted(fetchOrders)

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
    fetchOrders()
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
    await fetchOrders()
  }
}
</script>

<template>
  <VSheet border rounded>
    <ClientOnly>
      <VAlert v-if="error" type="error" class="mt-4" icon="mdi-database-off">
        Error de obtencion de datos: {{ error }}
      </VAlert>
      <DeleteModal ref="deleteDialog" tag="Pedido de" :name="selectedOrder?.client?.billName ?? ''" :recovery="recovery"
        @confirm="handleDelete" />
      <OrderModal v-model="dialogOpen" :is-edit="isEditMode" :order="selectedOrder" @submit="handleSubmit" />
      <VDataTable :headers="headersOrders" :hide-default-footer="orders?.length < 11" :items="orders" :loading="loading"
        loading-text="Cargando Pedidos...">
        <template #top>
          <VToolbar flat>
            <VToolbarTitle>
              <VIcon color="medium-emphasis" icon="mdi-food" size="x-small" start />
              Pedidos
            </VToolbarTitle>
            <VBtn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Añadir Pedido" border
              @click="openDialog(false, orderEmpty)" />
          </VToolbar>
        </template>

        <template #item.title="{ value }">
          <VChip :text="value" border="thin opacity-25" prepend-icon="mdi-item" label>
            <template #prepend>
              <VIcon color="medium-emphasis" />
            </template>
          </VChip>
        </template>

        <template #item.state="{ value }">
          <VChip :color="getStateColor(value)">
            {{ formatState(value) }}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <div v-if="item.state === 'PENDING'" class="d-flex ga-2 justify-end">
            <VBtn icon="mdi-pencil" size="small" variant="text" @click="openDialog(true, item)" />
            <VBtn icon="mdi-close-octagon" size="small" variant="text" @click="openDeleteDialog(false, item)" />
          </div>
          <div v-if="item.state === 'CANCELLED'" class="d-flex ga-2 justify-end">
            <VBtn icon="mdi-arrow-u-left-top-bold" size="small" variant="text" @click="openDeleteDialog(true, item)" />
          </div>
        </template>
        <template #no-data>
          No se han encontrado registros.
        </template>
      </VDataTable>
      <VSnackbar v-model="showSuccess">
        {{ textSuccess }}
      </VSnackbar>
    </ClientOnly>
  </VSheet>
</template>
