import type { Order } from '@/types/model'

export const useOrder = () => {
  const baseURL = urlToApiBase('/Order')
  const order = ref<Order | null>(null)
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const error = ref<any | null>(null)

  const createOrder = async (payload: Order) => {
    return await $fetch<Order>(`${baseURL}/add`, {
      method: 'POST',
      body: payload
    })
  }

  const updateOrder = async (payload: Order) => {
    return await $fetch<Order>(`${baseURL}/modify`, {
      method: 'PUT',
      body: payload
    })
  }

  const deleteOrder = async (id: number) => {
    return await $fetch<Order>(`${baseURL}/remove`, {
      method: 'DELETE',
      body: { id },
    })
  }

  const fetchOrders = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Order[]>(`${baseURL}/list`)
      orders.value = data
    }
    catch (error: any) {
      error.value = error.message || 'Fallo al obtener las Ordenes'
    }
    finally {
      loading.value = false
    }
  }

  return {
    order,
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder
  }
}
