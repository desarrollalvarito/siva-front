import type { Product } from '@/types/model'

export const useProduct = () => {
  const baseURL = urlToApiBase('/product')
  const product = ref<Product | null>(null)
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<any | null>(null)

  const createProduct = async (payload: Product) => {
    return await $fetch<Product>(`${baseURL}/add`, {
      method: 'POST',
      body: payload
    })
  }

  const updateProduct = async (payload: Product) => {
    return await $fetch<Product>(`${baseURL}/modify`, {
      method: 'PUT',
      body: payload
    })
  }

  const deleteProduct = async (id: number) => {
    return await $fetch<Product>(`${baseURL}/remove`, {
      method: 'DELETE',
      body: { id },
    })
  }

  const fetchProducts = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Product[]>(`${baseURL}/list`)
      products.value = data
    }
    catch (error: any) {
      error.value = error.message || 'Fallo al obtener los productos'
    }
    finally {
      loading.value = false
    }
  }

  return {
    product,
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
