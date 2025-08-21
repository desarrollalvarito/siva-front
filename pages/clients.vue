<script lang="ts" setup>
import type { Client } from '@/types/model'

const { clients, loading, error, fetchClients, createClient, updateClient, deleteClient } = useClient()
const { error: errorPerson, createPerson, updatePerson } = usePerson()
const dialogOpen = ref(false)
const isEditMode = ref(false)
const selectedClient = ref<Client | null>(null)
const deleteDialog = ref()
const showSuccess = ref(false)
const successMessage = ref('')
const clientEmpty = <Client>{
  id: undefined,
  shippingAddress: '',
  billName: '',
  rut: '',
  personId: 0,
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

onMounted(fetchClients)

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
    if (isEditMode.value) {
      await updatePerson(client.person)
      await updateClient(client)
    }
    else {
      // Para nuevos Clientes, primero crear persona si es necesario
      if (client.personId === 0) {
        const newPerson = await createPerson(client.person)
        client.personId = newPerson.id
      }
      await createClient(client)
    }
    successMessage.value = `Cliente ${isEditMode.value ? 'actualizado' : 'creado'}`
    showSuccess.value = true
    fetchClients()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!selectedClient.value?.id) return
  await deleteClient(selectedClient.value.id)
  successMessage.value = 'Cliente eliminado'
  showSuccess.value = true
  fetchClients()
}
</script>

<template>
  <VSheet border rounded>
    <ClientOnly>
      <VAlert v-if="error" type="error" class="mt-4" icon="mdi-database-off">
        Error de obtencion de datos: {{ error }}
      </VAlert>
      <DeleteModal ref="deleteDialog" tag="Cliente" :name="selectedClient?.person?.names ?? ''"
        @confirm="handleDelete" />
      <ClientModal v-model="dialogOpen" :is-edit="isEditMode" :client="selectedClient" @submit="handleSubmit" />
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

        <template #item.title="{ value }">
          <VChip :text="value" border="thin opacity-25" prepend-icon="mdi-item" label>
            <template #prepend>
              <VIcon color="medium-emphasis" />
            </template>
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end">
            <VBtn icon="mdi-pencil" size="small" variant="text" @click="openDialog(true, item)" />
            <VBtn icon="mdi-delete" size="small" variant="text" @click="openDeleteDialog(item)" />
          </div>
        </template>
        <template #no-data>
          No se han encontrado registros.
        </template>
      </VDataTable>
      <VSnackbar v-model="showSuccess">
        {{ successMessage }}
      </VSnackbar>
    </ClientOnly>
  </VSheet>
</template>
