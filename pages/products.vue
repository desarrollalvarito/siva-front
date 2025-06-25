<script lang="ts" setup>
import { onMounted, ref, shallowRef } from 'vue'

const config = useRuntimeConfig()

const DEFAULT_RECORD = { id: '', name: '', price: '' }

const record = ref(DEFAULT_RECORD)
const dialog = shallowRef(false)
const isEditing = shallowRef(false)
const userId = 1
const { products, loading, error, fetchProducts } = useProducts()
const { createProduct, updateProduct, deleteProduct } = useProduct()

onMounted(fetchProducts)

function add() {
  isEditing.value = false
  record.value = DEFAULT_RECORD
  dialog.value = true
}

function edit(id: number) {
  isEditing.value = true

  const found = products.value.find(item => item.id === id)

  record.value = {
    id: found.id,
    name: found.name,
    price: found.price,
  }

  dialog.value = true
}

async function remove(id: number) {
  const { status } = await useFetch(`${config.public.apiBase}/product/remove`, {
    server: false,
    method: 'DELETE',
    body: { id },
  })

  if (status.value !== 'success') {
    console.error('Error deleting product:', status.value)
  }
  else {
    const index = products.value.findIndex(item => item.id === id)

    products.value.splice(index, 1)
  }
}

async function save() {
  if (isEditing.value) {
    const index = products.value.findIndex(item => item.id === record.value.id)

    const { status } = await useFetch(`${config.public.apiBase}/product/modify`, {
      server: false,
      method: 'PUT',
      body: {
        id: record.value.id,
        name: record.value.name,
        price: record.value.price,
        userAt: userId,
      },
    })

    if (status.value !== 'success') {
      console.error('Error updating product:', status.value)
    }
    else {
      products.value[index] = record.value
      console.log('update')
    }
  }
  else {
    const { data: product } = await useFetch(`${config.public.apiBase}/product/add`, {
      server: false,
      method: 'POST',
      body: {
        name: record.value.name,
        price: record.value.price,
        userAt: userId,
      },
    })

    if (status.value !== 'success') {
      console.error('Error updating product:', status.value)
    }
    else {
      products.value.push(product.value)
      console.log('add')
    }
  }
  dialog.value = false
}

function reset() {
  dialog.value = false
  record.value = DEFAULT_RECORD
}
</script>

<template>
  <VSheet border rounded>
    <ClientOnly>
      <VAlert v-if="error" type="error" class="mt-4" icon="mdi-database-off">
        Error de obtencion de datos: {{ error }}
      </VAlert>
      <ProductsModal @submit="createProduct" v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props">Create Product</v-btn>
      </ProductsModal>
      <VDataTable :headers="headersProducts" :hide-default-footer="products?.length < 11" :items="products"
        :loading="loading" loading-text="'Cargando productos...'">
        <template #top>
          <VToolbar flat>
            <VToolbarTitle>
              <VIcon color="medium-emphasis" icon="mdi-food" size="x-small" start />
              Productos
            </VToolbarTitle>
            <VBtn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Añadir Producto" border @click="add" />
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
            <VIcon icon="mdi-pencil" size="small" @click="edit(item.id)" />

            <VIcon icon="mdi-delete" size="small" @click="remove(item.id)" />
          </div>
        </template>

        <template #no-data>
          No se han encontrado productos.
        </template>
      </VDataTable>
    </ClientOnly>
  </VSheet>

  <!--   <VDialog v-model="dialog" max-width="500">
    <VCard :subtitle="`${isEditing ? 'Actualizar' : 'Crear'} item`"
      :title="`${isEditing ? 'Modificar' : 'Añadir'} un producto`">
      <template #text>
        <VRow>
          <VCol cols="12">
            <VTextField v-model="record.name" label="Nombre del producto" />
          </VCol>

          <VCol cols="12" md="6">
            <VTextField v-model="record.price" label="Precio" />
          </VCol>
        </VRow>
      </template>

      <VDivider />

      <VCardActions class="bg-surface-light">
        <VBtn text="Cancel" variant="plain" @click="dialog = false" />
        <VSpacer />
        <VBtn text="Save" @click="save" />
      </VCardActions>
    </VCard>
  </VDialog> -->
</template>
