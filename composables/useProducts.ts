import type { Product } from '@/types/product'

export const useProducts = () => {
  const baseURL = urlToApiBase('/product')
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Product[]>(`${baseURL}/list`)
      products.value = data
    }
    catch (err: any) {
      error.value = err.message || 'Fallo al obtener los productos'
    }
    finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
  }
}
