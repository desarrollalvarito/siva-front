<script setup lang="ts">
import type { Employee } from '@/types/model';
import { VDateInput } from 'vuetify/labs/components';

const props = defineProps<{
  modelValue: boolean
  employee?: Employee | null
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', employee: Employee): void
}>()


const { peoople, fetchPeoople } = usePerson()
const search = ref('')
const autocompleteOpen = ref(false)
const isEditing = computed(() => props.isEdit && props.employee?.id)
const isNewPerson = ref(false)

// Formulario reactivo
const form = ref<Employee>({
  workShift: '',
  jobRole: '',
  idPerson: 0,
  person: {
    id: 0,
    run: '',
    names: '',
    lastName: '',
    gender: '',
    address: '',
    birthDate: '',
    contact: '',
  },
})

// Reglas de validación
const required = (v: string) => !!v || 'Campo requerido'
const positiveNumber = (v: number) => v > 0 || 'Debe ser mayor a 0'
const validateRun = (v: string) => /^\d{7,8}-[kK\d]$/.test(v) || 'RUN inválido'

const resetForm = () => {
  form.value = {
    workShift: '',
    jobRole: '',
    idPerson: 0,
    person: {
      id: 0,
      run: '',
      names: '',
      lastName: '',
      gender: '',
      address: '',
      birthDate: '',
      contact: '',
    },
  }
  search.value = ''
  isNewPerson.value = false
}

// Sincronizar props al formulario
watch(() => props.employee, newVal => {
  if (newVal) {
    form.value = JSON.parse(JSON.stringify(newVal))
    isNewPerson.value = false
    search.value = newVal.person.run
  }
  else {
    resetForm()
  }
}, { immediate: true })

// Método para habilitar campos
const fieldsEnabled = computed(() => {
  return isEditing.value || isNewPerson.value || form.value.idPerson > 0
})

const handleRunSelect = (personId: number) => {
  if (personId === 0) {
    // Caso para nuevo RUN
    isNewPerson.value = true
    form.value.idPerson = 0
    form.value.person.run = search.value
    return
  }

  const selected = peoople.value.find(p => p.id === personId)
  if (selected) {
    form.value.person = { ...selected }
    form.value.idPerson = selected.id
    isNewPerson.value = false
    search.value = selected.run
  }
}

const registerNewRun = () => {
  isNewPerson.value = true
  form.value.idPerson = 0
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

onMounted(fetchPeoople)
</script>

<template>
  <VDialog max-width="600" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <VForm @submit.prevent="submitForm">
      <VCard :title="`${isEdit ? 'Modificar' : 'Nuevo'} empleado`">
        <VCardText>
          <VCard title="Datos Personales" class="mb-4" variant="outlined">
            <VCardText>
              <VRow>
                <VCol cols="12" md="9">
                  <VAutocomplete v-if="!isEditing" v-model="form.idPerson" :items="peoople" label="Buscar por RUN"
                    item-title="run" item-value="id" placeholder="12345678-9" clearable :hide-no-data="false"
                    :search="search" @update:search="val => search = val" @update:model-value="handleRunSelect"
                    :rules="[required]" :open="autocompleteOpen" :menu-props="{ closeOnContentClick: true }">
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
                  <VTextField v-else v-model="form.person.run" label="RUN" readonly />
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
                  <VDateInput v-model="form.person.birthDate" label="Fecha de nacimiento" placeholder="01/01/1991"
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
          <VCard title="Datos Laborales" class="mb-4" variant="outlined">
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <VSelect v-model="form.jobRole" label="Cargo" placeholder="Gerente" :items="jobRoles"
                    :disabled="!fieldsEnabled" :rules="[required]" />
                </VCol>
                <VCol cols="12" md="6">
                  <VSelect v-model="form.workShift" label="Turno" placeholder="Mañana, Tarde, Noche" :items="workShifts"
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
