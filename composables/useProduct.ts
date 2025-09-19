import type { ApiResponse } from '@/types/api'
import type { Product } from '@/types/model'

export const useProduct = () => {
  const baseURL = '/siva/v1/product'
  const { $api } = useNuxtApp()

  const fetchProducts = async (): Promise<Product[]> => {
    try {
      const response = await $api<ApiResponse<Product[]>>(`${baseURL}/list`)

      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.error || 'Error al obtener productos')
    } catch (error: any) {
      throw createError({
        message: error.message,
        statusCode: error.statusCode || 500
      })
    }
  }

  const createProduct = async (productData: Product): Promise<Product> => {
    try {
      const response = await $api<ApiResponse<Product>>(`${baseURL}/add`, {
        method: 'POST',
        body: productData
      })

      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.error || 'Error al crear producto')
    } catch (error: any) {
      console.log(error);
      throw createError({
        message: error.message,
        statusCode: error.statusCode || 500
      })
    }
  }

  const updateProduct = async (productData: Product): Promise<Product> => {
    try {
      const response = await $api<ApiResponse<Product>>(`${baseURL}/modify`, {
        method: 'PUT',
        body: productData
      })

      if (response.success && response.data) {
        return response.data
      }
      throw new Error(response.error || 'Error al actualizar producto')
    } catch (error: any) {
      throw createError({
        message: error.message,
        statusCode: error.statusCode || 500
      })
    }
  }

  const deleteProduct = async (productData: Product): Promise<void> => {
    try {
      const response = await $api<ApiResponse>(`${baseURL}/remove`, {
        method: 'DELETE',
        body: { id: productData.id, userAt: productData.userAt }
      })

      if (!response.success) {
        throw new Error(response.error || 'Error al eliminar producto')
      }
    } catch (error: any) {
      throw createError({
        message: error.message,
        statusCode: error.statusCode || 500
      })
    }
  }

  return {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
