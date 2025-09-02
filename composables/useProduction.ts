import type { Production } from '@/types/model'

export const useProduction = () => {
  const baseURL = urlToApiBase('/Production')
  const production = ref<Production | null>(null)
  const productions = ref<Production[]>([])
  const loading = ref(false)
  const error = ref<any | null>(null)
  const date = ref('')

  const createProduction = async (payload: Production) => {
    return await $fetch<Production>(`${baseURL}/add`, {
      method: 'POST',
      body: payload
    })
  }

  const updateProduction = async (payload: Production) => {
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

  return {
    production,
    productions,
    loading,
    error,
    date,
    fetchProductions,
    createProduction,
    updateProduction,
    deleteProduction
  }
}
