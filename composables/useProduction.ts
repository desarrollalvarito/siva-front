import type { Production } from '@/types/model'

export const useProduction = () => {
  const baseURL = urlToApiBase('/Production')
  const production = ref<Production | null>(null)
  const productions = ref<Production[]>([])
  const loading = ref(false)
  const error = ref<any | null>(null)
  const date = ref('')
  const kpis = ref({
    totalOrdenes: 0,
    totalProductos: 0,
    produccionProgramada: 0,
    produccionEnProceso: 0,
    productosDisponibles: 0
  })
  const ordersProductions = ref<Array<{ id: number; name: string; productions: number; orders: number; }>>([])

  const createProduction = async (payload: Production) => {
    return await $fetch<Production>(`${baseURL}/add`, {
      method: 'POST',
      body: payload
    })
  }

  const updateProduction = async (payload: Production) => {
    console.log(payload);
    return await $fetch<Production>(`${baseURL}/modify`, {
      method: 'PUT',
      body: payload
    })
  }

  const deleteProduction = async (id: number) => {
    return await $fetch<Production>(`${baseURL}/remove`, {
      method: 'DELETE',
      body: { id },
    })
  }

  const fetchProductions = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Production[]>(`${baseURL}/list`, {
        method: 'POST',
        body: { date: date.value }
      })
      productions.value = data
    }
    catch (error: any) {
      error.value = error.message || 'Fallo al obtener las Ordenes'
    }
    finally {
      loading.value = false
    }
  }

  const fetchMetrics = async () => {
    try {
      const metrics = await $fetch<typeof kpis.value>(`${baseURL}/productionmetrics`, {
        method: 'POST',
        body: { date: date.value }
      })
      kpis.value = metrics
      return metrics
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message
      return null
    }
  }

  const fetchOrdersProductions = async () => {
    try {
      ordersProductions.value = await $fetch<typeof ordersProductions.value>(`${baseURL}/ordersproductions`, {
        method: 'POST',
        body: { date: date.value }
      })
      return ordersProductions
    } catch (err: any) {
      error.value = err.data?.statusMessage || err.message
      return null
    }
  }

  return {
    production,
    productions,
    ordersProductions,
    loading,
    error,
    date,
    kpis,
    fetchProductions,
    createProduction,
    updateProduction,
    deleteProduction,
    fetchMetrics,
    fetchOrdersProductions
  }
}
