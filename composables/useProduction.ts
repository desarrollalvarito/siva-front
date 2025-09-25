import type { ApiResponse } from '@/types/api'
import type { Kpis, Production } from '@/types/model'

export const useProduction = () => {
  const baseURL = '/siva/v1/production'
  const { $api } = useNuxtApp()
  const kpis = ref({
    totalOrdenes: 0,
    totalProductos: 0,
    produccionProgramada: 0,
    produccionEnProceso: 0,
    productosDisponibles: 0
  })
  const ordersProductions = ref<Array<{ id: number; name: string; productions: number; orders: number; }>>([])

  const fetchProductions = async (dateOrder: string): Promise<Production[]> => {
    try {
      const response = await $api<ApiResponse<Production[]>>(`${baseURL}/list`, {
        method: 'POST',
        body: { date: dateOrder }
      })
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Error al obtener la produccion')
      }
    } catch (error: any) {
      throw createError({
        message: error.message,
        statusCode: error.statusCode || 500
      })
    }
  }

  const fetchMetrics = async (dateOrder: string): Promise<Kpis> => {
    try {
      const response = await $api<ApiResponse<Kpis>>(`${baseURL}/productionmetrics`, {
        method: 'POST',
        body: { date: dateOrder }
      })
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Error al obtener la kpis')
      }
    } catch (error: any) {
      throw createError({
        message: error.message,
        statusCode: error.statusCode || 500
      })
    }
  }

  const fetchOrdersProductions = async (dateOrder: string): Promise<typeof ordersProductions.value> => {
    try {
      const response = await $api<ApiResponse<typeof ordersProductions.value>>(`${baseURL}/ordersproductions`, {
        method: 'POST',
        body: { date: dateOrder }
      })
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'Error al obtener la toal de ordenes y producciones')
      }
    } catch (error: any) {
      throw createError({
        message: error.message,
        statusCode: error.statusCode || 500
      })
    }
  }

  const createProduction = async (payload: Production): Promise<Production> => {
    try {
      const response = await $api<ApiResponse<Production>>(`${baseURL}/add`, {
        method: 'POST',
        body: payload
      })
      if (response.success && response.data) return response.data
      throw new Error(response.error || 'Error al crear la produccion')
    } catch (error: any) {
      throw createError({ message: error.message, statusCode: error.statusCode || 500 })
    }
  }

  const updateProduction = async (payload: Production): Promise<Production> => {
    try {
      const response = await $api<ApiResponse<Production>>(`${baseURL}/modify`, {
        method: 'PUT',
        body: payload
      })
      if (response.success && response.data) return response.data
      throw new Error(response.error || 'Error al modificar la produccion')
    } catch (error: any) {
      throw createError({ message: error.message, statusCode: error.statusCode || 500 })
    }
  }

  const deleteProduction = async (id: number): Promise<void> => {
    try {
      const response = await $api<ApiResponse<Production>>(`${baseURL}/remove`, {
        method: 'DELETE',
        body: { id }
      })
      if (!response.success) throw new Error(response.error || 'Error al eliminar la produccion')
    } catch (error: any) {
      throw createError({ message: error.message, statusCode: error.statusCode || 500 })
    }
  }

  return {
    fetchProductions,
    createProduction,
    updateProduction,
    deleteProduction,
    fetchMetrics,
    fetchOrdersProductions
  }
}
