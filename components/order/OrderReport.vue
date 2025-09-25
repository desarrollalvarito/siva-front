<template>
  <VDialog v-model="dialog" max-width="1000">
    <VCard>
      <VToolbar color="primary" dark>
        <VToolbarTitle>
          <VIcon icon="mdi-file-document-outline" class="mr-2" />
          Reporte de Asignaciones de Entregas
        </VToolbarTitle>
        <VSpacer />
        <VBtn icon @click="close">
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VToolbar>

      <VCardText>
        <VRow class="mb-4">
          <VCol>
            <div class="text-h6">Fecha: {{ formattedDate }}</div>
          </VCol>
        </VRow>

        <VAlert v-if="!hasAssignments" type="info" class="mb-4">
          No hay entregas para mostrar.
        </VAlert>

        <VTable v-else density="comfortable">
          <thead>
            <tr>
              <th>Conductor</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="assignment in assignments" :key="assignment.id">
              <tr v-for="(order, index) in assignment.orderProduct" :key="order.id">
                <td v-if="index === 0" :rowspan="assignment.orderProduct.length + 2">
                  <div class="font-weight-bold">{{ getFullName(assignment?.delivery?.driver) }}</div>
                  <div class="text-caption">RUN: {{ assignment?.delivery?.driver.person.run }}</div>
                  <div class="text-caption">Turno: {{ assignment?.delivery?.driver.workShift }}</div>
                </td>
                <td v-if="index === 0" :rowspan="assignment.orderProduct.length + 2">
                  <div class="font-weight-bold">{{ getFullName(assignment?.client) }}</div>
                  <div class="text-caption">RUN: {{ assignment?.client?.person?.run }}</div>
                  <div class="text-caption">RUT: {{ assignment?.client?.rut }}</div>
                  <div class="text-caption">DIRECCION: {{ assignment?.client?.shippingAddress }}</div>
                  <div class="text-caption">NRO. CONTACTO: {{ assignment?.client?.person?.contact }}</div>
                </td>
                <td>{{ order.product.name }}</td>
                <td align="right">{{ order.quantity }}</td>
              </tr>
              <tr class="total-row">
                <td class="text-right font-weight-bold">Total de Productos:</td>
                <td align="center"><span class="font-weight-bold">{{
                  assignment.totalAssigned }}</span></td>
              </tr>
              <tr class="total-row">
                <td class="text-right font-weight-bold">Monto Total:</td>
                <td align="center"><span class="font-weight-bold">$ {{
                  assignment.mountAssigned }}</span></td>
              </tr>
            </template>
          </tbody>
        </VTable>
      </VCardText>

      <VCardActions>
        <VSpacer />
        <VBtn color="primary" @click="printReport" prepend-icon="mdi-printer">
          Imprimir Reporte
        </VBtn>
        <VBtn @click="close">
          Cerrar
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
// Props
const props = defineProps({
  assignments: {
    type: Array,
    default: () => []
  },
  date: {
    type: Date,
    default: () => new Date()
  }
})

// Referencia al diálogo
const dialog = ref(false)

// Computed properties
const formattedDate = computed(() => {
  return props.date.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const hasAssignments = computed(() => {
  return props.assignments.some((assignment) => (assignment as any).state === 'PENDING')
})

// Métodos
const open = () => {
  dialog.value = true
}

const close = () => {
  dialog.value = false
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED': return 'success'
    case 'IN_PROGRESS': return 'info'
    case 'PENDING': return 'warning'
    case 'CANCELED': return 'error'
    default: return 'default'
  }
}

const printReport = () => {
  window.print()
}

// Exponer métodos al componente padre
defineExpose({
  open,
  close
})
</script>

<style scoped>
.total-row {
  background-color: #f5f5f5;
  font-weight: bold;
}

/* Estilos para impresión */
@media print {
  :deep(.v-toolbar) {
    display: none;
  }

  :deep(.v-card-actions) {
    display: none;
  }

  .v-card {
    box-shadow: none !important;
  }
}
</style>
