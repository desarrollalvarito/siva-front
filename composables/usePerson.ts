import type { Person } from '@/types/model'

export const usePerson = () => {
  // Estado reactivo
  const baseURL = urlToApiBase('/person')
  const person = ref<Person | null>(null)
  const people = ref<Person[]>([]) // Corregido el typo 'peoople'
  const loading = ref(false)
  const error = ref<string | null>(null) // Mejor tipado

  // Helper para manejar errores
  const handleApiError = (err: unknown) => {
    error.value = err instanceof Error ? err.message : 'Error desconocido'
    throw error.value
  }

  // Crear persona
  const createPerson = async (payload: Person) => {
    try {
      const data = await $fetch<Person>(`${baseURL}/add`, {
        method: 'POST',
        body: payload,
      })
      person.value = data // Actualizar estado
      people.value.push(data) // Añadir a la lista
      return data
    } catch (err) {
      return handleApiError(err)
    }
  }

  // Actualizar persona
  const updatePerson = async (payload: Person) => {
    try {
      const data = await $fetch<Person>(`${baseURL}/modify`, {
        method: 'PUT',
        body: payload,
      })
      person.value = data
      // Actualizar en la lista
      const index = people.value.findIndex(p => p.id === payload.id)
      if (index !== -1) people.value[index] = data
      return data
    } catch (err) {
      return handleApiError(err)
    }
  }

  // Eliminar persona
  const deletePerson = async (id: number) => {
    try {
      const data = await $fetch<Person>(`${baseURL}/remove`, {
        method: 'DELETE',
        body: { id },
      })
      // Eliminar de la lista
      people.value = people.value.filter(p => p.id !== id)
      return data
    } catch (err) {
      return handleApiError(err)
    }
  }

  // Obtener lista de personas
  const fetchPeople = async () => { // Nombre corregido
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Person[]>(`${baseURL}/list`)
      people.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener personas'
    } finally {
      loading.value = false
    }
  }

  return {
    person,
    people, // Nombre corregido
    loading,
    error,
    fetchPeople, // Nombre corregido
    createPerson,
    updatePerson,
    deletePerson,
  }
}
