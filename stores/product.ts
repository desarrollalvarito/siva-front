import type { Product } from '~/types/product'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Obtener lista
  const getProducts = async () => {
    try {
      loading.value = true
      const { data } = await useFetch<Product[]>('/products/list')
      products.value = data.value || []
    } catch (e) {
      error.value = 'No se pudieron cargar los productos'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // Agregar uno
  const addProduct = async (nuevo: Product) => {
    const res = await $fetch<Product>('/products/add', {
      method: 'POST',
      body: nuevo
    })
    products.value.push(res)
  }

  // Actualizar uno
  const modifyProduct = async (id: number, data: Product) => {
    const res = await $fetch<Product>(`/api/products/modify`, {
      method: 'PUT',
      body: data
    })
    const i = products.value.findIndex(p => p.id === id)
    if (i !== -1) products.value[i] = res
  }

  return {
    products,
    loading,
    error,
    getProducts,
    addProduct,
    modifyProduct
  }
})

