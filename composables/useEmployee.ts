import type { ApiResponse } from '@/types/api'
import type { Employee } from '@/types/model'

export const useEmployee = () => {
  const baseURL = '/siva/v1/employee'
  const { $api } = useNuxtApp()

  const fetchEmployees = async (): Promise<Employee[]> => {
    try {
      const response = await $api<ApiResponse<Employee[]>>(`${baseURL}/list`)
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Error al obtener Employeees')
      }
    } catch (error: any) {
      throw createError({
        message: error.message,
        statusCode: error.statusCode || 500
      })
    }
  }

  const createEmployee = async (payload: Employee): Promise<Employee> => {
    try {
      const response = await $api<ApiResponse<Employee>>(`${baseURL}/add`, {
        method: 'POST',
        body: payload,
      })
      if (response.success && response.data) return response.data
      throw new Error(response.error || 'Error al crear Employeee')
    } catch (err: any) {
      throw createError({ message: err.message, statusCode: err.statusCode || 500 })
    }
  }

  const updateEmployee = async (payload: Employee): Promise<Employee> => {
    try {
      const response = await $api<ApiResponse<Employee>>(`${baseURL}/modify`, {
        method: 'PUT',
        body: payload,
      })
      console.log(response);
      if (response.success && response.data) return response.data
      throw new Error(response.error || 'Error al actualizar Employeee')
    } catch (err: any) {
      throw createError({ message: err.message, statusCode: err.statusCode || 500 })
    }
  }

  const deleteEmployee = async (id: number): Promise<void> => {
    try {
      const response = await $api<ApiResponse>(`${baseURL}/remove`, {
        method: 'DELETE',
        body: { id },
      })
      if (!response.success) throw new Error(response.error || 'Error al eliminar Employeee')
    } catch (err: any) {
      throw createError({ message: err.message, statusCode: err.statusCode || 500 })
    }
  }

  return {
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  }
}
