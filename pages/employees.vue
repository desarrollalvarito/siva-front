<script lang="ts" setup>
import type { Employee, Person } from '@/types/model'

const { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } = useEmployee()
const { createPerson, updatePerson } = usePerson()
const dialogOpen = ref(false)
const isEditMode = ref(false)
const selectedEmployee = ref<Employee | null>(null)
const deleteDialog = ref()
const showSuccess = ref(false)
const textSuccess = ref('')
const employees = ref<Employee[]>([])
const loading = ref(false)
const error = ref<string>('')
const employeeEmpty = <Employee>{
  id: 0,
  workShift: '',
  jobRole: '',
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

await loadEmployees()

async function loadEmployees(): Promise<void> {
  loading.value = true
  error.value = ''

  try {
    employees.value = await fetchEmployees()
    await new Promise(resolve => setTimeout(resolve, 2000))
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

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
      if (employee.person.id === 0) {
        const newPerson: Person = await createPerson(employee.person)
        if (newPerson?.id) (employee as any).personId = newPerson.id
      }
      await createEmployee(employee)
    }
    textSuccess.value = `Empleado ${isEditMode.value ? 'actualizado' : 'creado'} satisfactoriamente`
    showSuccess.value = true
    await loadEmployees()
  } catch (err: any) {
    error.value = err?.message || 'Ocurrió un error al guardar el cliente'
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!selectedEmployee.value?.id) return
  await deleteEmployee(selectedEmployee.value.id)
  textSuccess.value = 'Empleado eliminado'
  showSuccess.value = true
  await loadEmployees()
}

const formatValue = (value: string) => {
  return jobRoles.find(role => role.value === value)?.title || value
}
</script>

<template>
  <VSheet border rounded>
    <ClientOnly>
      <VAlert v-if="error" type="error" class="mt-4" icon="mdi-database-off">
        Error de obtencion de datos: {{ error }}
      </VAlert>
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

        <template #item.jobRole="{ value }">
          {{ formatValue(value) }}
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
      <DeleteModal ref="deleteDialog" tag="Empleado" :name="selectedEmployee?.person?.names ?? ''"
        @confirm="handleDelete" />
      <EmployeeModal v-model="dialogOpen" :is-edit="isEditMode" :employee="selectedEmployee" @submit="handleSubmit" />
      <VSnackbar v-model="showSuccess">
        {{ textSuccess }}
      </VSnackbar>
    </ClientOnly>
  </VSheet>
</template>
