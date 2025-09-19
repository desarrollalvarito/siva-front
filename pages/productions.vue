<script setup lang="ts">
import type { Production } from '@/types/model';
import { VDateInput } from 'vuetify/labs/components';

const { productions, loading, error, date, kpis, ordersProductions, fetchOrdersProductions, fetchMetrics, fetchProductions, createProduction, updateProduction, deleteProduction } = useProduction()
const dialogOpen = ref(false)
const isEditMode = ref(false)
const selectedProduction = ref<Production | null>(null)
const deleteDialog = ref()
const reportDialog = ref() // Referencia para el diálogo de reporte
const page = ref(1)
const showSuccess = ref(false)
const textSuccess = ref('')
const recovery = ref(false)
const searchDate = ref<Date>(new Date())
const ProductionEmpty = ref<Production>({
  id: 0,
  cook: {
    workShift: '',
    jobRole: '',
    person: { id: 0, run: '', names: '', lastName: '', gender: '', birthdate: null },
  },
  date: new Date().toISOString().split('T')[0],
  status: '',
  productionProduct: []
})

// Estado para las asignaciones de producción
const productionAssignments = ref<any[]>([])
const loadingAssignments = ref(false)

// Métodos CRUD
const openDialog = (edit: boolean, production: Production | null = null) => {
  isEditMode.value = edit
  if (production) {
    // Si es edición, asignar el Productiono seleccionado
    selectedProduction.value = { ...production } // Clonar para evitar mutaciones directas
  }
  else {
    // Si es creación, reiniciar el formulario
    selectedProduction.value = null
  }
  dialogOpen.value = true
}

const openDeleteDialog = (recoveryOption: boolean, production: Production) => {
  recovery.value = recoveryOption
  selectedProduction.value = production
  deleteDialog.value?.open()
}

const updateDate = () => {
  date.value = searchDate.value.toISOString().split('T')[0]
  fetchProductions()
  fetchMetrics()
  fetchOrdersProductions()
}

// Cargar asignaciones de producción
const loadProductionAssignments = async () => {
  try {
    loadingAssignments.value = true
    // Simular carga de datos (en producción, esto vendría de tu API)
    productionAssignments.value = productions.value.map(p => ({
      ...p,
      totalAssigned: p.productionProduct.reduce((total, product) => total + product.quantity, 0),
    }))

    // Abrir el diálogo de reporte
    reportDialog.value?.open()
  } catch (error) {
    console.error('Error cargando asignaciones:', error)
  } finally {
    loadingAssignments.value = false
  }
}

onMounted(() => {
  updateDate()
})

const handleSubmit = async (Production: Production) => {
  try {
    loading.value = true
    Production.userAt = 1
    if (isEditMode.value && Production.id) {
      // Actualizar
      await updateProduction(Production)
    }
    else {
      // Crear (simula ID autoincremental)
      await createProduction(Production)
    }
    textSuccess.value = `Orden ${isEditMode.value ? 'actualizada' : 'creada'} satisfactoriamente`
    showSuccess.value = true
    updateDate()
  }
  catch (error) {
    console.error('Error:', error)
  }
  finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (selectedProduction.value && typeof selectedProduction.value.id === 'number') {
    if (selectedProduction.value.status !== 'CANCELLED') {
      await deleteProduction(selectedProduction.value.id)
      textSuccess.value = 'Orden eliminado Satisfactoriamente'
    }
    else {
      selectedProduction.value.status = 'PENDING'
      await updateProduction(selectedProduction.value)
      textSuccess.value = 'Orden recuperado Satisfactoriamente'
    }
    showSuccess.value = true
    await fetchProductions()
  }
}

// Cambiar estado a "En Producción" para una asignación específica
const setStartProduction = async (production: Production) => {
  try {
    // Aquí iría la llamada a tu API para actualizar el estado
    const assignment = productions.value.find(a => a.id === production.id)
    if (assignment) {
      assignment.status = 'IN_PROGRESS'
      // Actualizar la producción correspondiente en la base de datos
      await updateProduction(production)
      textSuccess.value = 'Producción marcada como "En Producción"'
      showSuccess.value = true
    }
  } catch (error) {
    console.error('Error actualizando estado:', error)
  }
}

// Cambiar estado de todas las asignaciones
const setAllToProduction = async () => {
  try {
    for (const assignment of productions.value) {
      if (assignment.status === 'PENDING') {
        assignment.status = 'IN_PROGRESS'
        await updateProduction(assignment)
      }
    }
    textSuccess.value = 'Todas las producciones marcadas como "En Producción"'
    showSuccess.value = true
    await fetchProductions() // Actualizar la lista
  } catch (error) {
    console.error('Error actualizando estados:', error)
  }
}
</script>

<template>
  <VSheet border rounded>
    <ClientOnly>
      <OrderAvailable :kpis="kpis" />
      <VAlert v-if="error" type="error" class="mt-4" icon="mdi-database-off">
        Error de obtencion de datos: {{ error }}
      </VAlert>
      <!-- SECCIÓN DE PRODUCCIONES -->
      <VContainer fluid>
        <VCard elevation="2" class="production-section">
          <VToolbar color="surface" flat>
            <VToolbarTitle class="d-flex align-center">
              <VIcon color="primary" icon="mdi-hamburger" class="mr-2" />
              <span class="text-h6">Producción del Día</span>
            </VToolbarTitle>

            <VSpacer />

            <VDateInput v-model="searchDate" label="Fecha de producción" placeholder="Seleccionar fecha"
              prepend-icon="mdi-calendar" style="max-inline-size: 250px;" class="mr-3" density="comfortable"
              @update:model-value="updateDate" />
            <VBtn color="primary" prepend-icon="mdi-plus" rounded="lg" @click="openDialog(false)" elevation="1">
              Nueva Producción
            </VBtn>
          </VToolbar>

          <VDataIterator :items="productions" :page="page">
            <template v-slot:default="{ items }">
              <VContainer class="pa-3" fluid>
                <VRow>
                  <VCol v-for="item in items" :key="item.raw.id" cols="12" sm="6" md="6" lg="4" class="pa-2">
                    <ProductionCard :production="item.raw" @edit="openDialog(true, item.raw)"
                      @delete="openDeleteDialog(false, item.raw)" @recover="openDeleteDialog(true, item.raw)"
                      @start="setStartProduction(item.raw)" />
                  </VCol>
                </VRow>
              </VContainer>
            </template>

            <template #no-data>
              <VContainer class="text-center py-8">
                <VIcon size="64" color="grey-lighten-2">mdi-inbox</VIcon>
                <div class="text-h6 text-grey-lighten-1 mt-2">No hay producciones</div>
                <div class="text-body-2 text-grey">Crea una nueva producción para comenzar</div>
              </VContainer>
            </template>

            <template #footer>
              <VContainer class="d-flex justify-center py-4" v-if="productions.length > 0">
                <VBtn color="secondary" prepend-icon="mdi-file-document-outline" rounded="lg"
                  @click="loadProductionAssignments" :loading="loadingAssignments" elevation="1" class="mr-2">
                  Reporte de Asignaciones
                </VBtn>
                <VBtn color="primary" prepend-icon="mdi-play-circle-outline" rounded="lg" @click="setAllToProduction"
                  elevation="1">
                  Iniciar todas las Producciones
                </VBtn>
              </VContainer>
            </template>
          </VDataIterator>
        </VCard>
      </VContainer>
      <DeleteModal ref="deleteDialog" tag="Produccion del Hornero" :name="selectedProduction?.cook?.person.names ?? ''"
        :recovery="recovery" @confirm="handleDelete" />
      <!-- Diálogo de Reporte de Asignaciones usando el componente separado -->
      <ProductionReport ref="reportDialog" :assignments="productionAssignments" :date="searchDate" />
      <ProductionModal v-model="dialogOpen" :is-edit="isEditMode" :production="selectedProduction"
        :orders-productions="ordersProductions" @submit="handleSubmit" />
      <VSnackbar v-model="showSuccess">
        {{ textSuccess }}
      </VSnackbar>
    </ClientOnly>
  </VSheet>
</template>
