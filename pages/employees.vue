<template>
  <v-sheet border rounded>
    <client-only>
      <div v-if="status == 'pending'">
        Cargando...
      </div>
      <div v-else>
        <v-data-table v-if="employees?.length > 0" :headers="headers" :hide-default-footer="employees?.length < 11"
          :items="employees">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon color="medium-emphasis" icon="mdi-account-group" size="x-small" start></v-icon>
                Empleados
              </v-toolbar-title>

              <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Añadir empleado" border
                @click="add"></v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.title="{ value }">
            <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-item" label>
              <template v-slot:prepend>
                <v-icon color="medium-emphasis"></v-icon>
              </template>
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-2 justify-end">
              <v-icon icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>

              <v-icon icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
            </div>
          </template>
        </v-data-table>
        <v-alert v-else type="error" class="mt-4">
          No se han encontrado empleados.
        </v-alert>
      </div>
    </client-only>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500">
    <v-card :subtitle="`${isEditing ? 'Actualizar' : 'Crear'} item`"
      :title="`${isEditing ? 'Modificar' : 'Añadir'} un empleado`">
      <template v-slot:text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field v-model="record.name" label="Nombres"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="record.name" label="Apellidos"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="record.price" label="Precio"></v-text-field>
          </v-col>

        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Save" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref, shallowRef } from 'vue';
const config = useRuntimeConfig()

definePageMeta({
  auth: false
})

const DEFAULT_RECORD = { id: '', name: '', price: '' }

const record = ref(DEFAULT_RECORD)
const dialog = shallowRef(false)
const isEditing = shallowRef(false)
const userId = 1

const headers = [
  { title: 'RUN', key: 'person.run', align: 'start' },
  { title: 'Nombre', key: `fullName`, value: item => `${item.person.names} ${item.person.lastName}` },
  { title: 'Cargo', key: 'jobRole' },
  { title: 'Turno', key: 'workShift' },
  { title: 'Domicilio', key: 'person.address' },
  { title: 'Celular', key: 'person.contact' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

const { status, data: employees } = await useFetch(config.public.apiBase + '/employee/list', {
  server: false,
  lazy: false
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

  const found = employees.value.find(item => item.id === id)

  record.value = {
    id: found.id,
    name: found.name,
    price: found.price
  }

  dialog.value = true
}

async function remove(id: number) {
  const { status } = await useFetch(config.public.apiBase + '/employee/remove', {
    server: false,
    method: 'DELETE',
    body: { id }
  })
  if (status.value !== "success") {
    console.error('Error deleting employee:', status.value)
  }
  else {
    const index = employees.value.findIndex(item => item.id === id)
    employees.value.splice(index, 1)
  }
}

async function save() {
  if (isEditing.value) {
    const index = employees.value.findIndex(item => item.id === record.value.id)
    const { status } = await useFetch(config.public.apiBase + '/employee/modify', {
      server: false,
      method: 'PUT',
      body: {
        id: record.value.id,
        name: record.value.name,
        price: record.value.price,
        userAt: userId
      }
    })
    if (status.value !== "success") {
      console.error('Error updating employee:', status.value)
    }
    else {
      employees.value[index] = record.value
      console.log("update");
    }
  } else {
    const { data: employee } = await useFetch(config.public.apiBase + '/employee/add', {
      server: false,
      method: 'POST',
      body: {
        name: record.value.name,
        price: record.value.price,
        userAt: userId
      }
    })
    if (status.value !== "success") {
      console.error('Error updating employee:', status.value)
    }
    else {
      employees.value.push(employee.value)
      console.log("add");
    }
  }
  dialog.value = false
}

function reset() {
  dialog.value = false
  record.value = DEFAULT_RECORD
}
</script>
