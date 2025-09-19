<script lang="ts" setup>
import type { Client, Person } from '@/types/model'

const { fetchClients, createClient, updateClient, deleteClient } = useClient()
const { createPerson, updatePerson } = usePerson()
const dialogOpen = ref(false)
const isEditMode = ref(false)
const selectedClient = ref<Client | null>(null)
const deleteDialog = ref()
const showSuccess = ref(false)
const textSuccess = ref('')
const clients = ref<Client[]>([])
const loading = ref(false)
const error = ref<string>('')
const clientEmpty = <Client>{
  id: 0,
  shippingAddress: '',
  billName: '',
  rut: '',
  person: {
    id: 0,
    run: '',
    names: '',
    lastName: '',
    gender: '',
    address: '',
    birthdate: null,
    contact: '',
  },
}

await loadClients()

async function loadClients(): Promise<void> {
  loading.value = true
  error.value = ''

  try {
    clients.value = await fetchClients()
    await new Promise(resolve => setTimeout(resolve, 2000))
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Métodos CRUD
const openDialog = (edit: boolean, client: Client | null = null) => {
  isEditMode.value = edit
  selectedClient.value = client ? { ...client } : { ...clientEmpty }
  dialogOpen.value = true
}

const openDeleteDialog = (client: Client) => {
  selectedClient.value = client
  deleteDialog.value?.open()
}

const handleSubmit = async (client: Client) => {
  try {
    loading.value = true
    if (isEditMode.value && client.id) {
      await updatePerson(client.person)
      await updateClient(client)
    }
    else {
      // Para nuevos clientes, crear persona si es necesario
      if (client.person.id === 0) {
        const newPerson: Person = await createPerson(client.person)
        if (newPerson?.id) (client as any).personId = newPerson.id
      }
      await createClient(client)
    }
    textSuccess.value = `Cliente ${isEditMode.value ? 'actualizado' : 'creado'}`
    showSuccess.value = true
    await loadClients()
  } catch (err: any) {
    error.value = err?.message || 'Ocurrió un error al guardar el cliente'
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!selectedClient.value?.id) return
  await deleteClient(selectedClient.value.id)
  textSuccess.value = 'Cliente eliminado'
  showSuccess.value = true
  await loadClients()
}
</script>

<template>
  <VSheet border rounded>
    <ClientOnly>
      <VAlert v-if="error" type="error" class="mt-4" icon="mdi-database-off">
        Error de obtencion de datos: {{ error }}
      </VAlert>
      <VDataTable :headers="headersClients" :hide-default-footer="clients?.length < 11" :items="clients"
        :loading="loading" loading-text="Cargando clientes...">
        <template #top>
          <VToolbar flat>
            <VToolbarTitle>
              <VIcon color="medium-emphasis" icon="mdi-account-group" size="x-small" start />
              Clientes
            </VToolbarTitle>
            <VBtn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Añadir Cliente" border
              @click="openDialog(false)" />
          </VToolbar>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end">
            <VTooltip location="bottom">
              <template #activator="{ props: tooltipProps }">
                <VBtn v-bind="tooltipProps" icon="mdi-pencil" size="small" variant="text"
                  @click="openDialog(true, item)" />
              </template>
              <span>Editar</span>
            </VTooltip>
            <VTooltip location="bottom">
              <template #activator="{ props: tooltipProps }">
                <VBtn v-bind="tooltipProps" icon="mdi-delete" size="small" variant="text"
                  @click="openDeleteDialog(item)" />
              </template>
              <span>Eliminar</span>
            </VTooltip>
          </div>
        </template>
        <template #no-data>
          No se han encontrado registros.
        </template>
      </VDataTable>
      <DeleteModal ref="deleteDialog" tag="Cliente" :name="selectedClient?.person?.names ?? ''"
        @confirm="handleDelete" />
      <ClientModal v-model="dialogOpen" :is-edit="isEditMode" :client="selectedClient" @submit="handleSubmit" />
      <VSnackbar v-model="showSuccess">
        {{ textSuccess }}
      </VSnackbar>
    </ClientOnly>
  </VSheet>
</template>
