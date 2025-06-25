<script lang="ts" setup>
import { onMounted, ref, shallowRef } from 'vue'

const config = useRuntimeConfig()

const DEFAULT_RECORD = { id: '', name: '', price: '' }

const record = ref(DEFAULT_RECORD)
const dialog = shallowRef(false)
const isEditing = shallowRef(false)
const userId = 1

const headers = [
  { title: 'RUT', key: 'rut', align: 'start' },
  { title: 'RUN', key: 'person.run' },
  { title: 'Nombre del RUT', key: 'billName' },
  { title: 'Nombre', key: 'fullName', value: item => `${item.person.names} ${item.person.lastName}` },
  { title: 'Direccion de entrega', key: 'shippingAddress' },
  { title: 'Domicilio', key: 'person.address' },
  { title: 'Celular', key: 'person.contact' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

const { status, data: clients } = await useFetch(`${config.public.apiBase}/client/list`, {
  server: false,
  lazy: false,
})

onMounted(() => {
  reset()
})

function add() {
  isEditing.value = false
  record.value = DEFAULT_RECORD
  dialog.value = true
}

function edit(id: number) {
  isEditing.value = true

  const found = clients.value.find(item => item.id === id)

  record.value = {
    id: found.id,
    name: found.name,
    price: found.price,
  }

  dialog.value = true
}

async function remove(id: number) {
  const { status } = await useFetch(`${config.public.apiBase}/client/remove`, {
    server: false,
    method: 'DELETE',
    body: { id },
  })

  if (status.value !== 'success') {
    console.error('Error deleting client:', status.value)
  }
  else {
    const index = clients.value.findIndex(item => item.id === id)

    clients.value.splice(index, 1)
  }
}

async function save() {
  if (isEditing.value) {
    const index = clients.value.findIndex(item => item.id === record.value.id)

    const { status } = await useFetch(`${config.public.apiBase}/client/modify`, {
      server: false,
      method: 'PUT',
      body: {
        id: record.value.id,
        name: record.value.name,
        price: record.value.price,
        userAt: userId,
      },
    })

    if (status.value !== 'success') {
      console.error('Error updating client:', status.value)
    }
    else {
      clients.value[index] = record.value
      console.log('update')
    }
  }
  else {
    const { data: client } = await useFetch(`${config.public.apiBase}/client/add`, {
      server: false,
      method: 'POST',
      body: {
        name: record.value.name,
        price: record.value.price,
        userAt: userId,
      },
    })

    if (status.value !== 'success') {
      console.error('Error updating client:', status.value)
    }
    else {
      clients.value.push(client.value)
      console.log('add')
    }
  }
  dialog.value = false
}

function reset() {
  dialog.value = false
  record.value = DEFAULT_RECORD
}
</script>

<template>
  <VSheet
    border
    rounded
  >
    <ClientOnly>
      <div v-if="status == 'pending'">
        Cargando...
      </div>
      <div v-else>
        <VDataTable
          v-if="clients?.length > 0"
          :headers="headers"
          :hide-default-footer="clients?.length < 11"
          :items="clients"
        >
          <template #top>
            <VToolbar flat>
              <VToolbarTitle>
                <VIcon
                  color="medium-emphasis"
                  icon="mdi-account-group"
                  size="x-small"
start
                />
                Clientes
              </VToolbarTitle>

              <VBtn
                class="me-2"
                prepend-icon="mdi-plus"
                rounded="lg"
                text="Añadir cliente"
border
                @click="add"
              />
            </VToolbar>
          </template>

          <template #item.title="{ value }">
            <VChip
              :text="value"
              border="thin opacity-25"
              prepend-icon="mdi-item"
              label
            >
              <template #prepend>
                <VIcon color="medium-emphasis" />
              </template>
            </VChip>
          </template>

          <template #item.actions="{ item }">
            <div class="d-flex ga-2 justify-end">
              <VIcon
                icon="mdi-pencil"
                size="small"
                @click="edit(item.id)"
              />

              <VIcon
                icon="mdi-delete"
                size="small"
                @click="remove(item.id)"
              />
            </div>
          </template>
        </VDataTable>
        <VAlert
          v-else
          type="error"
          class="mt-4"
        >
          No se han encontrado clientes.
        </VAlert>
      </div>
    </ClientOnly>
  </VSheet>

  <VDialog
    v-model="dialog"
    max-width="500"
  >
    <VCard
      :subtitle="`${isEditing ? 'Actualizar' : 'Crear'} item`"
      :title="`${isEditing ? 'Modificar' : 'Añadir'} un cliente`"
    >
      <template #text>
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="record.name"
              label="Nombre del empleado"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              v-model="record.price"
              label="Precio"
            />
          </VCol>
        </VRow>
      </template>

      <VDivider />

      <VCardActions class="bg-surface-light">
        <VBtn
          text="Cancel"
          variant="plain"
          @click="dialog = false"
        />

        <VSpacer />

        <VBtn
          text="Save"
          @click="save"
        />
      </VCardActions>
    </VCard>
  </VDialog>
</template>
