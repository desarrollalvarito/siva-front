import type { Product } from '@/types/product'

export const useProduct = () => {
  const baseURL = urlToApiBase('/product')
  const product = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProduct = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useFetch<Product>(`/api/products/${id}`, {
        server: false,
        lazy: false
      })
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
    console.log(payload);
    return await $fetch<Product>(`${baseURL}/add`, {
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
    return await $fetch<Product>(`${baseURL}/remove`, {
      method: 'DELETE',
      body: { id },
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
