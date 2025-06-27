import type { Person } from '@/types/model'

export const usePerson = () => {
  const baseURL = urlToApiBase('/person')
  const person = ref<Person | null>(null)
  const persons = ref<Person[]>([])
  const loading = ref(false)
  const error = ref<any | null>(null)

  const createPerson = async (payload: Person) => {
    return await $fetch<Person>(`${baseURL}/add`, {
      method: 'POST',
      body: payload
    })
  }

  const updatePerson = async (payload: Person) => {
    return await $fetch<Person>(`${baseURL}/modify`, {
      method: 'PUT',
      body: payload
    })
  }

  const deletePerson = async (id: number) => {
    return await $fetch<Person>(`${baseURL}/remove`, {
      method: 'DELETE',
      body: { id },
    })
  }

  const fetchPeoople = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Person[]>(`${baseURL}/list`)
      persons.value = data
    }
    catch (error: any) {
      error.value = error.message || 'Fallo al obtener las Personas'
    }
    finally {
      loading.value = false
    }
  }

  return {
    person,
    persons,
    loading,
    error,
    fetchPeoople,
    createPerson,
    updatePerson,
    deletePerson,
  }
}
