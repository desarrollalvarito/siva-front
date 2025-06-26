<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { Product } from '~/types/product'

const userId = 1
const { products, loading, error, fetchProducts } = useProducts()
const { createProduct: create, updateProduct: update, deleteProduct: remove } = useProduct()
const isEdit = ref(false)
const modelValue = ref<Product | null>({
  id: 0,
  name: '',
  price: 0,
})

onMounted(fetchProducts)

const createProduct = async (data: Product) => {
  console.log(data);
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

<template>
  <VSheet border rounded>
    <ClientOnly>
      <VAlert v-if="error" type="error" class="mt-4" icon="mdi-database-off">
        Error de obtencion de datos: {{ error }}
      </VAlert>
      <VDataTable :headers="headersProducts" :hide-default-footer="products?.length < 11" :items="products"
        :loading="loading" loading-text="'Cargando productos...'">
        <template #top>
          <VToolbar flat>
            <VToolbarTitle>
              <VIcon color="medium-emphasis" icon="mdi-food" size="x-small" start />
              Productos
            </VToolbarTitle>
            <VBtn class="me-2" prepend-icon="mdi-plus" rounded="lg" @submit="createProduct" text="Añadir Producto"
              border />
            <Parent :is-edit="false" />
          </VToolbar>
        </template>

        <template #item.title="{ value }">
          <VChip :text="value" border="thin opacity-25" prepend-icon="mdi-item" label>
            <template #prepend>
              <VIcon color="medium-emphasis" />
            </template>
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end">
            <div>
              <VBtn icon="mdi-pencil" size="small" variant="text" />
              <Parent :is-edit="true" :model-value="item" @submit="(data) => updateProduct(item.id, data)" />
            </div>
            <div>
              <VBtn icon="mdi-delete" size="small" variant="text" @click="deleteProduct(item.id)" />
            </div>
          </div>
        </template>

        <template #no-data>
          No se han encontrado productos.
        </template>
      </VDataTable>
    </ClientOnly>
  </VSheet>
</template>
