<script setup lang="ts">
import type { Production } from '@/types/model';
import { VDateInput } from 'vuetify/labs/components';

const { productions, loading, error, date, fetchProductions, createProduction, updateProduction, deleteProduction } = useProduction()
const dialogOpen = ref(false)
const isEditMode = ref(false)
const selectedProduction = ref<Production | null>(null)
const deleteDialog = ref()
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
  date: null,
  status: '',
  productionProduct: []
})

// Función para determinar el color según el estado
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'warning'
    case 'COMPLETED': return 'success'
    case 'CANCELLED': return 'error'
    default: return 'secondary'
  }
}

// Función para formatear el estado para mostrar
const formatStatus = (status: string) => {
  return statusList.find(item => item.value === status)?.title || status
}

// Métodos CRUD
const openDialog = (edit: boolean, Production: Production | null = null) => {
  isEditMode.value = edit
  if (Production) {
    // Si es edición, asignar el Productiono seleccionado
    selectedProduction.value = { ...Production } // Clonar para evitar mutaciones directas
  }
  else {
    // Si es creación, reiniciar el formulario
    selectedProduction.value = null
  }
  dialogOpen.value = true
}

const openDeleteDialog = (recoveryOption: boolean, Production: Production) => {
  recovery.value = recoveryOption
  selectedProduction.value = Production
  deleteDialog.value?.open()
}

const updateDate = () => {
  date.value = searchDate.value.toISOString().split('T')[0]
  fetchProductions()
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
    fetchProductions()
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
</script>

<template>
  <ClientOnly>
    <VContainer class="mb-2">
      <VRow>
        <VCol cols="12" md="4">x</VCol>
        <VCol cols="12" md="4">x</VCol>
        <VCol cols="12" md="4">x</VCol>
      </VRow>
    </VContainer>

    <VSheet border rounded>
      <VAlert v-if="error" type="error" class="mt-4" icon="mdi-database-off">
        Error de obtencion de datos: {{ error }}
      </VAlert>
      <VDataIterator :items="productions" :page=page>
        <template #header>
          <VToolbar flat>
            <VToolbarTitle>
              <VIcon color="medium-emphasis" icon="mdi-hamburger" size="x-small" start />
              Produccion
            </VToolbarTitle>
            <VDateInput v-model="searchDate" label="Fecha de produccion" placeholder="01/01/1991"
              prepend-icon="mdi-calendar" style="max-inline-size: 250px;" class="mr-6" clearable
              @update:model-value="updateDate" />
            <VBtn class="me-2" prepend-icon="mdi-hamburger-plus" rounded="lg" text="Añadir Produccion" border
              @click="openDialog(false, ProductionEmpty)" />
          </VToolbar>
        </template>
        <template v-slot:default="{ items }">
          <VContainer class="pa-2" fluid>
            <VRow no-gutters justify="center">
              <VCol v-for="item in items" :key="item.raw.id" cols="12" md="4">
                <VCard>
                  <VCardItem>
                    <VCardTitle class="text-truncate">Hornero: {{ item.raw.cook?.person.names + ' ' +
                      item.raw.cook?.person.lastName }}
                    </VCardTitle>
                    <VCardSubtitle>
                      <VChip class="ma-2" prepend-icon="mdi-card-account-details" color="info" size="x-small">
                        RUN: {{ item.raw.cook?.person.run }}
                      </VChip>
                      <VChip class="ma-2" prepend-icon="mdi-clock" color="primary" size="x-small">
                        Turno: {{ item.raw.cook?.workShift }}
                      </VChip>
                      <VChip class="ma-1" prepend-icon="mdi-list-status" :color="getStatusColor(item.raw.status)"
                        size="x-small">
                        {{ formatStatus(item.raw.status) }}
                      </VChip>
                    </VCardSubtitle>
                  </VCardItem>
                  <VCardText>
                    <VListSubheader>Asignaciones:</VListSubheader>
                    <VList>
                      <VListItem v-for="pp in item.raw.productionProduct" v-if="item.raw.productionProduct.length > 0">
                        {{ pp.product.name }}
                        <template v-slot:append>
                          {{ pp.quantity }}
                        </template>
                      </VListItem>
                      <VListItem v-else>
                        Sin Asignaciones
                      </VListItem>
                    </VList>
                  </VCardText>

                  <VCardActions>
                    <VSpacer></VSpacer>
                    <div v-if="item.raw.status === 'PENDING'">
                      <VTooltip location="bottom">
                        <template #activator="{ props: tooltipProps }">
                          <VBtn v-bind="tooltipProps" icon="mdi-pencil" size="small" variant="text"
                            @click="openDialog(true, item.raw)" />
                        </template>
                        <span>Editar</span>
                      </VTooltip>
                      <VTooltip location="bottom">
                        <template #activator="{ props: tooltipProps }">
                          <VBtn v-bind="tooltipProps" icon="mdi-close-circle" size="small" variant="text"
                            @click="openDeleteDialog(false, item.raw)" />
                        </template>
                        <span>Cancelar</span>
                      </VTooltip>
                    </div>
                    <div v-if="item.raw.status === 'CANCELLED'">
                      <VTooltip location="bottom">
                        <template #activator="{ props: tooltipProps }">
                          <VBtn v-bind="tooltipProps" icon="mdi-arrow-u-left-top-bold" size="small" variant="text"
                            @click="openDeleteDialog(true, item.raw)" />
                        </template>
                        <span>Recuperar</span>
                      </VTooltip>
                    </div>
                  </VCardActions>
                </VCard>
              </VCol>
            </VRow>
          </VContainer>
        </template>

        <template #no-data>
          <VContainer class="pa-2" fluid>
            No se han encontrado registros.
          </VContainer>
        </template>

      </VDataIterator>
    </VSheet>
    <DeleteModal ref="deleteDialog" tag="Produccion del Hornero"
      :name="selectedProduction?.assignedTo?.person.names ?? ''" :recovery="recovery" @confirm="handleDelete" />
    <ProductionModal v-model="dialogOpen" :is-edit="isEditMode" :Production="selectedProduction"
      @submit="handleSubmit" />
    <VSnackbar v-model="showSuccess">
      {{ textSuccess }}
    </VSnackbar>
  </ClientOnly>
</template>
