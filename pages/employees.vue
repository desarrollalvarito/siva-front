<script lang="ts" setup>
import { onMounted, ref, shallowRef } from 'vue'
import { VDateInput } from 'vuetify/labs/components'

interface EmployeeRecord {
  id: number | null
  idPerson: number | null
  run: string | null
  names: string | null
  lastName: string | null
  address: string | null
  contact: string | null
  jobRole: string | null
  workShift: string | null
  gender: string | null
  birthDate: string | null
}

const config = useRuntimeConfig()

const record = ref<EmployeeRecord>({
  id: null,
  idPerson: null,
  run: null,
  names: null,
  lastName: null,
  address: null,
  contact: null,
  jobRole: null,
  workShift: null,
  gender: null,
  birthDate: null,
})

const dialog = shallowRef(false)
const isEditing = shallowRef(false)
const userId = 1
const editable = shallowRef(true)
const editableRUN = shallowRef(false)
const search = ref<string>('')

const vaciarRecord = () => {
  record.value = {
    id: null,
    idPerson: null,
    run: null,
    names: null,
    lastName: null,
    address: null,
    contact: null,
    jobRole: null,
    workShift: null,
  }
}

const { data: peoople } = await useFetch(`${config.public.apiBase}/person/list`, {
  server: false,
  lazy: false,
})

const { error, status, data: employees } = await useFetch<EmployeeRecord[]>(`${config.public.apiBase}/employee/list`, {
  server: false,
  lazy: false,
})

const onSelectedRun = (id: number) => {
  const found = peoople.value.find(item => item.id === id)

  if (found) {
    record.value.idPerson = found.id
    record.value.run = found.run
    record.value.names = found.names
    record.value.lastName = found.lastName
    record.value.gender = found.gender
    record.value.birthDate = found.birthDate
    record.value.address = found.address
    record.value.contact = found.contact
    editable.value = false
    editableRUN.value = true
  }
}

const onSearchUpdate = (value: string) => {
  search.value = value
}

const registrarNuevoRUN = () => {
  editable.value = false
  vaciarRecord()
  record.value.run = search.value
  editableRUN.value = true
}

onMounted(() => {
  reset()
})

const add = () => {
  isEditing.value = false
  vaciarRecord()
  dialog.value = true
  editable.value = true
  editableRUN.value = false
  search.value = ''
}

const edit = (id: number) => {
  isEditing.value = true
  editable.value = false
  editableRUN.value = false

  const found = employees.value.find(item => item.id === id)

  record.value = {
    id: found.id,
    workShift: found.workShift,
    jobRole: found.jobRole,
    idPerson: found.person.id,
    run: found.person.run,
    names: found.person.names,
    lastName: found.person.lastName,
    address: found.person.address,
    contact: found.person.contact,
    gender: found.person.gender,
    birthDate: found.person.birthDate,
  }

  dialog.value = true
}

async function remove(id: number) {
  const { status: removeStatus } = await useFetch(`${config.public.apiBase}/employee/remove`, {
    server: false,
    method: 'DELETE',
    body: { id },
  })

  if (removeStatus.value !== 'success') {
    console.error('Error deleting employee:', removeStatus.value)
  }
  else {
    const index = employees.value.findIndex(item => item.id === id)

    employees.value.splice(index, 1)
  }
}

async function save() {
  if (isEditing.value) {
    const index = employees.value.findIndex(item => item.id === record.value.id)

    const { status: modifyStatus } = await useFetch(`${config.public.apiBase}/employee/modify`, {
      server: false,
      method: 'PUT',
      body: {
        id: record.value.id,
        names: record.value.names,
        lastName: record.value.lastName,
        address: record.value.address,
        contact: record.value.contact,
        jobRole: record.value.jobRole,
        workShift: record.value.workShift,
        gender: record.value.gender,
        birthDate: record.value.birthDate,
        userAt: userId,
      },
    })

    if (modifyStatus.value !== 'success') {
      console.error('Error updating employee:', modifyStatus.value)
    }
    else {
      employees.value[index] = record.value
      console.log('update')
    }
  }
  else {
    const { data: employee } = await useFetch(`${config.public.apiBase}/employee/add`, {
      server: false,
      method: 'POST',
      body: {
        name: record.value.name,
        price: record.value.price,
        userAt: userId,
      },
    })

    if (status.value !== 'success') {
      console.error('Error updating employee:', status.value)
    }
    else {
      employees.value.push(employee.value)
      console.log('add')
    }
  }
  dialog.value = false
}

function reset() {
  dialog.value = false
  vaciarRecord()
}
</script>

<template>
  <ClientOnly>
    <VAlert v-if="status === 'pending'" title="Cargando datos..." type="info">
      <VProgressLinear indeterminate :size="20" :width="10" />
    </VAlert>
    <VAlert v-if="error" type="error" class="mt-4" icon="mdi-database-off">
      Error de obtencion de datos code: {{ error.statusCode }} cause: {{ error.cause.message }}
    </VAlert>
    <VSheet border rounded>
      <VDataTable v-if="employees?.length > 0" :headers="headersEmployees" :hide-default-footer="employees?.length < 11"
        :items="employees">
        <template #top>
          <VToolbar flat>
            <VToolbarTitle>
              <VIcon color="medium-emphasis" icon="mdi-account-group" size="x-small" start />
              Empleados
            </VToolbarTitle>

            <VBtn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Añadir empleado" border @click="add" />
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
            <VIcon icon="mdi-pencil" size="small" @click="edit(item.id)" />

            <VIcon icon="mdi-delete" size="small" @click="remove(item.id)" />
          </div>
        </template>
        <template #no-data>
          <VListItem>
            <VListItemTitle>No existen registros</VListItemTitle>
          </VListItem>
        </template>
      </VDataTable>
    </VSheet>

    <VDialog v-model="dialog" max-width="700">
      <VCard :title="`${isEditing ? 'Modificar' : 'Añadir'} un empleado`">
        <template #text>
          <VCard title="Datos Personales" class="mb-4" variant="outlined">
            <VCardText>
              <VRow>
                <VCol cols="12" md="9">
                  <VAutocomplete v-model="record.run" :items="peoople" label="Buscar por RUN" item-title="run"
                    item-value="id" placeholder="12345678-9" :disabled="editableRUN" clearable :hide-no-data="false"
                    :search="search" @update:search="onSearchUpdate" @update:model-value="onSelectedRun">
                    <template #item="{ props, item }">
                      <VListItem v-bind="props" :subtitle="`${item.raw.names} ${item.raw.lastName}`"
                        :title="item.raw.run" />
                    </template>
                    <template #no-data>
                      <VListItem>
                        <VListItemTitle style="cursor: pointer;" @click="registrarNuevoRUN">
                          No se encontró "<strong>{{ search }}</strong>" Registrar ➕.
                        </VListItemTitle>
                      </VListItem>
                    </template>
                  </VAutocomplete>
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField v-model="record.names" label="Nombres" placeholder="Juan" :disabled="editable" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="record.lastName" label="Apellidos" placeholder="Perez" :disabled="editable" />
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12" md="6">
                  <VSelect v-model="record.gender" label="Genero" placeholder="Seleccione su genero" :items="genderList"
                    :disabled="editable" />
                </VCol>
                <VCol cols="12" md="6">
                  <VDateInput v-model="record.birthDate" label="Fecha de nacimiento" placeholder="01/01/1991"
                    prepend-icon="" :disabled="editable" />
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField v-model="record.address" label="Direccion" placeholder="Av. 18 N# 5"
                    :disabled="editable" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="record.contact" label="Numero de Telefono" placeholder="+11578565411"
                    :disabled="editable" />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
          <VCard title="Datos Laborales" class="mb-4" variant="outlined">
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <VSelect v-model="record.jobRole" label="Cargo" placeholder="Gerente" :items="jobRoles"
                    :disabled="editable" />
                </VCol>
                <VCol cols="12" md="6">
                  <VSelect v-model="record.workShift" label="Turno" placeholder="Mañana, Tarde, Noche"
                    :items="workShifts" :disabled="editable" />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </template>
        <VDivider />
        <VCardActions class="bg-surface-light">
          <VBtn text="Cancelar" variant="plain" @click="dialog = false" />
          <VSpacer />
          <VBtn text="Guardar" @click="save" />
        </VCardActions>
      </VCard>
    </VDialog>
  </ClientOnly>
</template>
