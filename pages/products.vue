<template>
  <v-sheet border rounded>
    <client-only>
      <div v-if="status == 'pending'">
        Cargando...
      </div>
      <div v-else>
        <v-data-table v-if="products?.length > 0" :headers="headers" :hide-default-footer="products?.length < 11"
          :items="products">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon color="medium-emphasis" icon="mdi-food" size="x-small" start></v-icon>
                Productos
              </v-toolbar-title>

              <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="Añadir Producto" border
                @click="add"></v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.title="{ value }">
            <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-item" label>
              <template v-slot:prepend>
                <v-icon color="medium-emphasis"></v-icon>
              </template>
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-2 justify-end">
              <v-icon icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>

              <v-icon icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
            </div>
          </template>

          <template v-slot:no-data>
            <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Reset data" variant="text" border
              @click="reset"></v-btn>
          </template>
        </v-data-table>
        <v-alert v-else type="error" class="mt-4">
          No se han encontrado productos.
        </v-alert>
      </div>
    </client-only>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500">
    <v-card :subtitle="`${isEditing ? 'Actualizar' : 'Crear'} item`"
      :title="`${isEditing ? 'Modificar' : 'Añadir'} un producto`">
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="record.name" label="Nombre del producto"></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="record.price" label="Precio"></v-text-field>
          </v-col>

        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Save" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref, shallowRef } from 'vue';
const config = useRuntimeConfig()

definePageMeta({
  auth: false
})

const DEFAULT_RECORD = { id: '', name: '', price: '' }

const record = ref(DEFAULT_RECORD)
const dialog = shallowRef(false)
const isEditing = shallowRef(false)
const userId = 1

const headers = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'Producto', key: 'name' },
  { title: 'Precio', key: 'price', align: 'end' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

const { status, data: products } = await useFetch(config.public.apiBase + '/product/list', {
  server: false,
  lazy: false
})

onMounted(() => {
  reset()
})

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
    price: found.price
  }

  dialog.value = true
}

async function remove(id: number) {
  const { status } = await useFetch(config.public.apiBase + '/product/remove', {
    server: false,
    method: 'DELETE',
    body: { id }
  })
  if (status.value !== "success") {
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
    const { status } = await useFetch(config.public.apiBase + '/product/modify', {
      server: false,
      method: 'PUT',
      body: {
        id: record.value.id,
        name: record.value.name,
        price: record.value.price,
        userAt: userId
      }
    })
    if (status.value !== "success") {
      console.error('Error updating product:', status.value)
    }
    else {
      products.value[index] = record.value
      console.log("update");
    }
  } else {
    const { data: product } = await useFetch(config.public.apiBase + '/product/add', {
      server: false,
      method: 'POST',
      body: {
        name: record.value.name,
        price: record.value.price,
        userAt: userId
      }
    })
    if (status.value !== "success") {
      console.error('Error updating product:', status.value)
    }
    else {
      products.value.push(product.value)
      console.log("add");
    }
  }
  dialog.value = false
}

function reset() {
  dialog.value = false
  record.value = DEFAULT_RECORD
}
</script>
