import type { ApiResponse } from '@/types/api'
import type { Client } from '@/types/model'

export const useClient = () => {
  const baseURL = '/siva/v1/client'
  const { $api } = useNuxtApp()

  const fetchClients = async (): Promise<Client[]> => {
    try {
      const response = await $api<ApiResponse<Client[]>>(`${baseURL}/list`)
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Error al obtener clientes')
      }
    } catch (error: any) {
      throw createError({
        message: error.message,
        statusCode: error.statusCode || 500
      })
    }
  }

  const createClient = async (payload: Client): Promise<Client> => {
    try {
      const response = await $api<ApiResponse<Client>>(`${baseURL}/add`, {
        method: 'POST',
        body: payload,
      })
      if (response.success && response.data) return response.data
      throw new Error(response.error || 'Error al crear cliente')
    } catch (err: any) {
      throw createError({ message: err.message, statusCode: err.statusCode || 500 })
    }
  }

  const updateClient = async (payload: Client): Promise<Client> => {
    try {
      const response = await $api<ApiResponse<Client>>(`${baseURL}/modify`, {
        method: 'PUT',
        body: payload,
      })
      console.log(response);
      if (response.success && response.data) return response.data
      throw new Error(response.error || 'Error al actualizar cliente')
    } catch (err: any) {
      throw createError({ message: err.message, statusCode: err.statusCode || 500 })
    }
  }

  const deleteClient = async (id: number): Promise<void> => {
    try {
      const response = await $api<ApiResponse>(`${baseURL}/remove`, {
        method: 'DELETE',
        body: { id },
      })
      if (!response.success) throw new Error(response.error || 'Error al eliminar cliente')
    } catch (err: any) {
      throw createError({ message: err.message, statusCode: err.statusCode || 500 })
    }
  }

  return {
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  }
}
