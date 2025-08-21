<script lang="ts" setup>
import type { Employee } from '@/types/model'

const { employees, loading, error, fetchEmployees, createEmployee, updateEmployee, deleteEmployee } = useEmployee()
const { error: errorPerson, createPerson, updatePerson } = usePerson()
const dialogOpen = ref(false)
const isEditMode = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const deleteDialog = ref()
const showSuccess = ref(false)
const successMessage = ref('')
const employeeEmpty = <Employee>{
  id: undefined,
  workShift: '',
  jobRole: '',
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

onMounted(fetchEmployees)

// Métodos CRUD
const openDialog = (edit: boolean, employee: Employee | null = null) => {
  isEditMode.value = edit
  selectedEmployee.value = employee ? { ...employee } : { ...employeeEmpty }
  dialogOpen.value = true
}

const openDeleteDialog = (Employee: Employee) => {
  selectedEmployee.value = Employee
  deleteDialog.value?.open()
}

const handleSubmit = async (employee: Employee) => {
  try {
    loading.value = true
    if (isEditMode.value) {
      await updatePerson(employee.person)
      await updateEmployee(employee)
    }
    else {
      // Para nuevos empleados, primero crear persona si es necesario
      if (employee.personId === 0) {
        const newPerson = await createPerson(employee.person)
        employee.personId = newPerson.id
      }
      await createEmployee(employee)
    }
    successMessage.value = `Empleado ${isEditMode.value ? 'actualizado' : 'creado'} satisfactoriamente`
    showSuccess.value = true
    fetchEmployees()
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!selectedEmployee.value?.id) return
  await deleteEmployee(selectedEmployee.value.id)
  successMessage.value = 'Empleado eliminado'
  showSuccess.value = true
  fetchEmployees()
}
</script>

<template>
  <VSheet border rounded>
    <ClientOnly>
      <VAlert v-if="error" type="error" class="mt-4" icon="mdi-database-off">
        Error de obtencion de datos: {{ error }}
      </VAlert>
      <DeleteModal ref="deleteDialog" tag="Empleado" :name="selectedEmployee?.person?.names ?? ''"
        @confirm="handleDelete" />
      <EmployeeModal v-model="dialogOpen" :is-edit="isEditMode" :employee="selectedEmployee" @submit="handleSubmit" />
      <VDataTable :headers="headersEmployees" :hide-default-footer="employees?.length < 11" :items="employees"
        :loading="loading" loading-text="Cargando empleados...">
        <template #top>
          <VToolbar flat>
            <VToolbarTitle>
              <VIcon color="medium-emphasis" icon="mdi-account-group" size="x-small" start />
              Empleados
            </VToolbarTitle>

            <VBtn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Añadir Empleado" border
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
