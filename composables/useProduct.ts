import type { Product } from '@/types/product'

export const useProduct = () => {
  const product = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProduct = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useFetch<Product>(`/api/products/${id}`)
      if (fetchError.value)
        throw fetchError.value
      product.value = data.value || null
    }
    catch (err: any) {
      error.value = err.message || 'Failed to fetch product'
    }
    finally {
      loading.value = false
    }
  }

  const createProduct = async (payload: Product) => {
    return await $fetch<Product>('/api/products', {
      method: 'POST',
      body: payload,
    })
  }

  const updateProduct = async (id: number, payload: Product) => {
    return await $fetch<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: payload,
    })
  }

  const deleteProduct = async (id: number) => {
    return await $fetch(`/api/products/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    product,
    loading,
    error,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  }
}
