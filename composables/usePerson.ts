import type { ApiResponse } from '@/types/api'
import type { Person } from '@/types/model'

export const usePerson = () => {
  // Estado reactivo
  const baseURL = '/siva/v1/person'
  const { $api } = useNuxtApp()

  // Obtener lista de personas
  const fetchPeople = async (): Promise<Person[]> => {
    try {
      const response = await $api<ApiResponse<Person[]>>(`${baseURL}/list`)
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Error al obtener personas')
      }
    } catch (error: any) {
      throw createError({
        message: error.message,
        statusCode: error.statusCode || 500
      })
    }
  }

  // Crear persona
  const createPerson = async (payload: Person): Promise<Person> => {
    try {
      const response = await $api<ApiResponse<Person>>(`${baseURL}/add`, {
        method: 'POST',
        body: payload,
      })
      if (response.success && response.data) return response.data
      throw new Error(response.error || 'Error al crear persona')
    } catch (err: any) {
      throw createError({ message: err.message, statusCode: err.statusCode || 500 })
    }
  }

  // Actualizar persona
  const updatePerson = async (payload: Person): Promise<Person> => {
    try {
      const response = await $api<ApiResponse<Person>>(`${baseURL}/modify`, {
        method: 'PUT',
        body: payload,
      })
      if (response.success && response.data) return response.data
      throw new Error(response.error || 'Error al actualizar persona')
    } catch (err: any) {
      throw createError({ message: err.message, statusCode: err.statusCode || 500 })
    }
  }

  // Eliminar persona
  const deletePerson = async (id: number): Promise<void> => {
    try {
      const response = await $api<ApiResponse>(`${baseURL}/remove`, {
        method: 'DELETE',
        body: { id },
      })
      if (!response.success) throw new Error(response.error || 'Error al eliminar persona')
    } catch (err: any) {
      throw createError({ message: err.message, statusCode: err.statusCode || 500 })
    }
  }

  return {
    fetchPeople, // Nombre corregido
    createPerson,
    updatePerson,
    deletePerson,
  }
}
