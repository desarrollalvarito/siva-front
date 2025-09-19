<script lang="ts" setup>
import type { Product } from '@/types/model'

const { fetchProducts, createProduct, updateProduct, deleteProduct } = useProduct()
const dialogOpen = ref(false)
const isEditMode = ref(false)
const selectedProduct = ref<Product | null>(null)
const deleteDialog = ref()
const showSuccess = ref(false)
const textSuccess = ref('')
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string>('')
const { data: sessionData } = useAuth()

// Cargar productos inicialmente
await loadProducts()

async function loadProducts(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    products.value = await fetchProducts()
    await new Promise(resolve => setTimeout(resolve, 2000))
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Métodos CRUD
const openDialog = (edit: boolean, product: Product | null = null) => {
  isEditMode.value = edit
  if (product) {
    // Si es edición, asignar el producto seleccionado
    selectedProduct.value = { ...product } // Clonar para evitar mutaciones directas
  }
  else {
    // Si es creación, reiniciar el formulario
    selectedProduct.value = null
  }
  dialogOpen.value = true
}

const openDeleteDialog = (product: Product) => {
  selectedProduct.value = product
  deleteDialog.value?.open()
}

const handleSubmit = async (product: Product) => {
  product.userAt = sessionData.value?.id || 1
  if (isEditMode.value && product.id !== 0) {
    // Actualizar
    await updateProduct(product)
    textSuccess.value = 'Producto modificado Satisfactoriamente'
    showSuccess.value = true
  }
  else {
    // Crear (simula ID autoincremental)
    await createProduct(product)
    textSuccess.value = 'Producto creado Satisfactoriamente'
    showSuccess.value = true
  }
  await loadProducts()
}

const handleDelete = async () => {
  if (!selectedProduct.value) return

  const payload = { ...selectedProduct.value, userAt: sessionData.value?.id || 1 }
  await deleteProduct(payload)
  textSuccess.value = 'Producto eliminado satisfactoriamente'
  showSuccess.value = true
  await loadProducts()
}
</script>

<template>
  <VSheet border rounded>
    <ClientOnly>
      <VAlert v-if="error" type="error" class="mt-4" icon="mdi-database-off">
        Error de obtencion de datos: {{ error }}
      </VAlert>
      <VDataTable :headers="headersProducts" :hide-default-footer="products?.length < 11" :items="products"
        :loading="loading" loading-text="Cargando productos...">
        <template #top>
          <VToolbar flat>
            <VToolbarTitle>
              <VIcon color="medium-emphasis" icon="mdi-food" size="x-small" start />
              Productos
            </VToolbarTitle>
            <VBtn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Añadir Producto" border
              @click="openDialog(false, null)" />
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
            <VTooltip location="bottom">
              <template #activator="{ props: tooltipProps }">
                <VBtn v-bind="tooltipProps" icon="mdi-pencil" size="small" variant="text"
                  @click="openDialog(true, item)" />
              </template>
              <span>Editar</span>
            </VTooltip>
            <VTooltip location="bottom">
              <template #activator="{ props: tooltipProps }">
                <VBtn v-bind="tooltipProps" icon="mdi-delete" size="small" variant="text"
                  @click="openDeleteDialog(item)" />
              </template>
              <span>Eliminar</span>
            </VTooltip>
          </div>
        </template>
        <template #no-data>
          No se han encontrado registros.
        </template>
      </VDataTable>
      <DeleteModal ref="deleteDialog" tag="Producto" :name="selectedProduct?.name ?? ''" @confirm="handleDelete" />
      <ProductModal v-model="dialogOpen" :is-edit="isEditMode" :product="selectedProduct" @submit="handleSubmit" />
      <VSnackbar v-model="showSuccess">
        {{ textSuccess }}
      </VSnackbar>
    </ClientOnly>
  </VSheet>
</template>
