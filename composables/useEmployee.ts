import type { Employee } from '@/types/model'

export const useEmployee = () => {
  const baseURL = urlToApiBase('/employee')
  const employee = ref<Employee | null>(null)
  const employees = ref<Employee[]>([])
  const loading = ref(false)
  const error = ref<any | null>(null)

  const createEmployee = async (payload: Employee) => {
    return await $fetch<Employee>(`${baseURL}/add`, {
      method: 'POST',
      body: payload
    })
  }

  const updateEmployee = async (payload: Employee) => {
    return await $fetch<Employee>(`${baseURL}/modify`, {
      method: 'PUT',
      body: payload
    })
  }

  const deleteEmployee = async (id: number) => {
    return await $fetch<Employee>(`${baseURL}/remove`, {
      method: 'DELETE',
      body: { id },
    })
  }

  const fetchEmployees = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Employee[]>(`${baseURL}/list`)
      employees.value = data
    }
    catch (error: any) {
      error.value = error.message || 'Fallo al obtener los Empleados'
    }
    finally {
      loading.value = false
    }
  }

  return {
    employee,
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  }
}
