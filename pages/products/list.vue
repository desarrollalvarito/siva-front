<template>
  <v-sheet border rounded>
    <client-only>
      <div v-if="status == 'pending'">
        Cargando...
      </div>
      <div v-else>
        <v-data-table :headers="headers" :hide-default-footer="products?.length < 11" :items="products">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon color="medium-emphasis" icon="mdi-cart" size="x-small" start></v-icon>
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
              <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>

              <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
            </div>
          </template>

          <template v-slot:no-data>
            <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Reset data" variant="text" border
              @click="reset"></v-btn>
          </template>
        </v-data-table>
      </div>
    </client-only>
  </v-sheet>

  <v-dialog v-model="dialog" max-width="500">
    <v-card :subtitle="`${isEditing ? 'Actualiza' : 'Crea'} el item`"
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

const headers = [
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'Producto', key: 'name' },
  { title: 'Precio', key: 'price', align: 'end' },
  { title: 'Opciones', key: 'actions', align: 'end', sortable: false },
]

const { status, data: products } = await useFetch(config.public.apiBase + '/product/list', {
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

function edit(id) {
  isEditing.value = true

  const found = products.value.find(item => item.id === id)

  record.value = {
    id: found.id,
    name: found.name,
    price: found.price
  }

  dialog.value = true
}

function remove(id) {
  const index = products.value.findIndex(item => item.id === id)
  products.value.splice(index, 1)
}

function save() {
  if (isEditing.value) {
    const index = products.value.findIndex(item => item.id === record.value.id)
    products.value[index] = record.value
  } else {
    record.value.id = products.value.length + 1
    products.value.push(record.value)
  }

  dialog.value = false
}

function reset() {
  dialog.value = false
  record.value = DEFAULT_RECORD
}
</script>
