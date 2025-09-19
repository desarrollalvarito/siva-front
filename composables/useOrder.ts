import type { ApiResponse } from '@/types/api'
import type { Order } from '@/types/model'

export const useOrder = () => {
  const baseURL = '/siva/v1/order'
  const { $api } = useNuxtApp()

  const fetchOrders = async (dateOrder: string): Promise<Order[]> => {
    try {
      const response = await $api<ApiResponse<Order[]>>(`${baseURL}/list`, {
        method: 'POST', body: { date: dateOrder }
      })
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

  const createOrder = async (payload: Order): Promise<Order> => {
    try {
      const response = await $api<ApiResponse<Order>>(`${baseURL}/add`, {
        method: 'POST',
        body: payload
      })
      if (response.success && response.data) return response.data
      throw new Error(response.error || 'Error al crear pedido')
    } catch (err: any) {
      throw createError({ message: err.message, statusCode: err.statusCode || 500 })
    }
  }

  const updateOrder = async (payload: Order): Promise<Order> => {
    try {
      const response = await $api<ApiResponse<Order>>(`${baseURL}/modify`, {
        method: 'PUT',
        body: payload
      })
      if (response.success && response.data) return response.data
      throw new Error(response.error || 'Error al crear pedido')
    } catch (err: any) {
      throw createError({ message: err.message, statusCode: err.statusCode || 500 })
    }
  }

  const deleteOrder = async (id: number): Promise<void> => {
    try {
      const response = await $api<ApiResponse<Order>>(`${baseURL}/remove`, {
        method: 'DELETE',
        body: { id }
      })
      if (!response.success) throw new Error(response.error || 'Error al eliminar pedido')
    } catch (err: any) {
      throw createError({ message: err.message, statusCode: err.statusCode || 500 })
    }
  }

  const totalOrders = async (date: string) => {
    return await $fetch<Order>(`${baseURL}/total`, {
      method: 'POST',
      body: { date },
    })
  }

  return {
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    totalOrders
  }
}
