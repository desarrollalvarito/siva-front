<template>
  <v-col cols="12" md="6">
    <v-btn prepend-icon="mdi-picture-in-picture-bottom-right" width="204">
      Parent Activator
      <Parent :is-edit="true" :model-value="productTrial" />
    </v-btn>
  </v-col>
</template>

<script setup lang="ts">
import type { Product } from '@/types/product'

const { products, loading, error, fetchProducts } = useProducts()
const { createProduct: create, updateProduct: update, deleteProduct: remove } = useProduct()
const dialog = ref(false)

onMounted(fetchProducts)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Price', key: 'price' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const productTrial = <Product>{
  id: 0,
  name: 'xxxx',
  price: 0
}

const createProduct = async (data: Product) => {
  await create(data)
  await fetchProducts()
}

const updateProduct = async (id: number, data: Product) => {
  await update(id, data)
  await fetchProducts()
}

const deleteProduct = async (id: number) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await remove(id)
    await fetchProducts()
  }
}
</script>
