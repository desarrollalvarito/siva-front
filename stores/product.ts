import { defineStore } from 'pinia'
import type { Product } from '~/types/product'

const config = useRuntimeConfig()

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async () => {
    try {
      loading.value = true

      const { data } = await useFetch<Product[]>(`${config.public.apiBase}/product/list`)

      products.value = data.value || []
    }
    catch (e) {
      error.value = 'Fallo al cargar los productos.'
    }
    finally {
      loading.value = false
    }
  }

  const createProduct = async (product: Product) => {
    const newProduct = await $fetch<Product>(`${config.public.apiBase}/product/add`, {
      method: 'POST',
      body: product,
    })

    products.value.push(newProduct)
  }

  const updateProduct = async (id: number, product: Product) => {
    const updated = await $fetch<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: product,
    })

    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1)
      products.value[index] = updated
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
  }
})

// This store manages product data, including fetching, creating, and updating products.
