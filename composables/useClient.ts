import type { Client } from '@/types/model'

export const useClient = () => {
  const baseURL = urlToApiBase('/client')
  const client = ref<Client | null>(null)
  const clients = ref<Client[]>([])
  const loading = ref(false)
  const error = ref<any | null>(null)

  const createClient = async (payload: Client) => {
    return await $fetch<Client>(`${baseURL}/add`, {
      method: 'POST',
      body: payload
    })
  }

  const updateClient = async (payload: Client) => {
    return await $fetch<Client>(`${baseURL}/modify`, {
      method: 'PUT',
      body: payload,

    })
  }

  const deleteClient = async (id: number) => {
    return await $fetch<Client>(`${baseURL}/remove`, {
      method: 'DELETE',
      body: { id },
    })
  }

  const fetchClients = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Client[]>(`${baseURL}/list`)
      clients.value = data
    }
    catch (error: any) {
      error.value = error.message || 'Fallo al obtener los Empleados'
    }
    finally {
      loading.value = false
    }
  }

  return {
    client,
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
  }
}
