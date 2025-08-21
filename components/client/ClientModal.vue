<script setup lang="ts">
import type { Client } from '@/types/model';
import { useDate } from 'vuetify';
import { VDateInput } from 'vuetify/labs/components';

const adapter = useDate()

const props = defineProps<{
  modelValue: boolean
  client?: Client | null
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', client: Client): void
}>()


const { people, fetchPeople } = usePerson()
const search = ref('')
const autocompleteOpen = ref(false)
const isEditing = computed(() => props.isEdit && props.client?.id)
const isNewPerson = ref(false)

// Formulario reactivo
const form = ref<Client>({
  shippingAddress: '',
  billName: '',
  rut: '',
  personId: 0,
  person: {
    id: 0,
    run: '',
    names: '',
    lastName: '',
    gender: '',
    address: '',
    birthdate: null,
    contact: '',
  },
})

// Reglas de validación
const required = (v: string) => !!v || 'Campo requerido'
const positiveNumber = (v: number) => v > 0 || 'Debe ser mayor a 0'
const validateRun = (v: string) => /^\d{7,8}-[kK\d]$/.test(v) || 'RUN inválido'

const resetForm = () => {
  form.value = {
    shippingAddress: '',
    billName: '',
    rut: '',
    personId: 0,
    person: {
      id: 0,
      run: '',
      names: '',
      lastName: '',
      gender: '',
      address: '',
      birthdate: null,
      contact: '',
    },
  }
  search.value = ''
  isNewPerson.value = false
}

// Sincronizar props al formulario
watch(() => props.client, newVal => {
  if (newVal) {
    form.value = { ...newVal }
    form.value.person.birthdate = newVal.person.birthdate ? adapter.date(new Date(newVal.person.birthdate).toISOString().split('T')[0]) : null
    isNewPerson.value = false
    search.value = newVal.person.run
  }
  else {
    resetForm()
  }
}, { immediate: true })

// Método para habilitar campos
const fieldsEnabled = computed(() => {
  return isEditing.value || isNewPerson.value || form.value.personId > 0 ? true : false
})

const handleRunSelect = (personId: number) => {
  if (personId === 0) {
    // Caso para nuevo RUN
    isNewPerson.value = true
    form.value.personId = 0
    form.value.person.run = search.value
    return
  }

  const selected = people.value.find(p => p.id === personId)
  if (selected) {
    form.value.person = { ...selected }
    form.value.personId = selected.id
    isNewPerson.value = false
    search.value = selected.run
  }
}

const registerNewRun = () => {
  isNewPerson.value = true
  form.value.personId = 0
  form.value.person.run = search.value
  autocompleteOpen.value = false
  nextTick(() => {
    // Forzar actualización de UI si es necesario
  })
}

const submitForm = () => {
  emit('submit', form.value)
  emit('update:modelValue', false)
}

const cancel = () => {
  resetForm()
  emit('update:modelValue', false)
}

onMounted(fetchPeople)
</script>

<template>
  <VDialog max-width="600" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <VForm @submit.prevent="submitForm">
      <VCard :title="`${isEdit ? 'Modificar' : 'Nuevo'} cliente`">
        <VCardText>
          <VCard title="Datos Personales" class="mb-4" variant="outlined">
            <VCardText>
              <VRow>
                <VCol cols="12" md="9">
                  <VAutocomplete v-model="form.person.run" :items="people" label="Buscar por RUN" item-title="run"
                    item-value="id" placeholder="12345678-9" clearable :hide-no-data="false" :search="search"
                    @update:search="val => search = val" @update:model-value="handleRunSelect" :rules="[required]"
                    :disabled="fieldsEnabled">
                    <template #item="{ props, item }">
                      <VListItem v-bind="props" :subtitle="`${item.raw.names} ${item.raw.lastName}`"
                        :title="item.raw.run" />
                    </template>
                    <template #no-data>
                      <VListItem>
                        <VListItemTitle style="cursor: pointer;" @click="registerNewRun">
                          No se encontró "<strong>{{ search }}</strong>" Registrar ➕.
                        </VListItemTitle>
                      </VListItem>
                    </template>
                  </VAutocomplete>
                </VCol>
              </VRow>
              <VAlert v-if="isNewPerson" type="info" class="mb-4">
                Estás registrando un nuevo RUN: {{ form.person.run }} .
              </VAlert>
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField v-model="form.person.names" label="Nombres" placeholder="Juan" :disabled="!fieldsEnabled"
                    :rules="[required]" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="form.person.lastName" label="Apellidos" placeholder="Perez"
                    :disabled="!fieldsEnabled" :rules="[required]" />
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12" md="6">
                  <VSelect v-model="form.person.gender" label="Genero" placeholder="Seleccione su genero"
                    :items="genderList" :disabled="!fieldsEnabled" />
                </VCol>
                <VCol cols="12" md="6">
                  <VDateInput v-model="form.person.birthdate" label="Fecha de nacimiento" placeholder="01/01/1991"
                    prepend-icon="" :disabled="!fieldsEnabled" />
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField v-model="form.person.address" label="Direccion" placeholder="Av. 18 N# 5"
                    :disabled="!fieldsEnabled" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="form.person.contact" label="Numero de Telefono" placeholder="+11578565411"
                    :disabled="!fieldsEnabled" :rules="[required]" />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
          <VCard title="RUT" class="mb-4" variant="outlined">
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField v-model="form.rut" label="RUT" placeholder="12345678-9" :disabled="!fieldsEnabled"
                    :rules="[required]" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="form.billName" label="Razon Social" placeholder="SIVA S.A."
                    :disabled="!fieldsEnabled" :rules="[required]" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="form.shippingAddress" label="Direccion de entrega" placeholder="Av. 18 N# 5"
                    :disabled="!fieldsEnabled" :rules="[required]" />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCardText>

        <VDivider />

        <VCardActions class="bg-surface-light">
          <VBtn text="Cancelar" variant="plain" @click="cancel" />
          <VSpacer />
          <VBtn type="submit">
            {{ isEdit ? 'Actualizar' : 'Crear' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VForm>
  </VDialog>
</template>
