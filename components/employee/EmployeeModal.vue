<script setup lang="ts">
import type { Employee, Person } from '@/types/model';
import { useDate } from 'vuetify';
import { VDateInput } from 'vuetify/labs/components';

const adapter = useDate()

const props = defineProps<{
  modelValue: boolean
  employee?: Employee | null
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', employee: Employee): void
}>()


const { fetchPeople } = usePerson()
const search = ref('')
const autocompleteOpen = ref(false)
const isEditing = computed(() => props.isEdit && props.employee?.id)
const isNewPerson = ref(false)
const people = ref<Person[]>([])
const formRef = ref()
const loading = ref(false)
const error = ref<string>('')
// Fechas mínima y máxima
const minDate = new Date(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
const maxDate = new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

// Formulario reactivo
const form = ref<Employee>({
  id: 0,
  workShift: '',
  jobRole: '',
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
const formEmpty = JSON.parse(JSON.stringify(form.value))

await loadPeople()

async function loadPeople(): Promise<void> {
  loading.value = true
  error.value = ''
  try {
    people.value = await fetchPeople()
    await new Promise(resolve => setTimeout(resolve, 2000))
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Reglas de validación
const required = (v: string) => !!v || 'Campo requerido'
const validateRun = (v: string) => /^\d{4,8}-?[kK\d]$/.test(v) || 'RUN inválido'

const resetForm = () => {
  form.value = JSON.parse(JSON.stringify(formEmpty))
  search.value = ''
  isNewPerson.value = false
}

// Sincronizar props al formulario
watch(() => props.employee, newVal => {
  if (newVal) {
    form.value = JSON.parse(JSON.stringify(newVal))
    form.value.person.birthdate = newVal.person.birthdate ? adapter.date(new Date(newVal.person.birthdate).toISOString().split('T')[0]) : null
    isNewPerson.value = false
    search.value = newVal.person.run ?? ''
  }
  else {
    resetForm()
  }
}, { immediate: true })

// Método para habilitar campos
const fieldsEnabled = computed(() => {
  return isEditing.value || isNewPerson.value || form.value.person.id > 0 ? true : false
})

const handleRunSelect = (personId: number) => {
  if (personId === 0) {
    // Caso para nuevo RUN
    isNewPerson.value = true
    form.value.person.id = 0
    if (form.value.person) {
      form.value.person.run = search.value
    }
    return
  }

  const selected = people.value.find(p => p.id === personId)
  if (selected) {
    form.value.person = { ...selected }
    isNewPerson.value = false
    search.value = selected.run
  }
}

const registerNewRun = () => {
  isNewPerson.value = true
  form.value.person.id = 0
  form.value.person.run = search.value
  autocompleteOpen.value = false
}

const handleSubmit = async () => {
  // Validar el formulario antes de enviar
  const { valid } = await formRef.value.validate()
  console.log(valid);
  if (valid) {
    submitForm()
  }
}

const submitForm = () => {
  emit('submit', form.value)
  emit('update:modelValue', false)
}
</script>

<template>
  <VDialog max-width="600" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <VForm @submit.prevent="handleSubmit" ref="formRef">
      <VCard :title="`${isEdit ? 'Modificar' : 'Nuevo'} empleado`">
        <VCardText>
          <VCard title="Datos Personales" class="mb-4" variant="outlined">
            <VCardText>
              <VRow>
                <VCol cols="12" md="9">
                  <VAutocomplete v-model="form.person.run" :items="people" label="Buscar por RUN" item-title="run"
                    item-value="id" placeholder="12345678-9" clearable :hide-no-data="false" :search="search"
                    @update:search="val => search = val" @update:model-value="handleRunSelect"
                    :rules="[required, validateRun]" :disabled="fieldsEnabled">
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
                    :items="genderList" :disabled="!fieldsEnabled" :rules="[required]" />
                </VCol>
                <VCol cols="12" md="6">
                  <VDateInput v-model="form.person.birthdate" label="Fecha de nacimiento" placeholder="01/01/1991"
                    prepend-icon="" :disabled="!fieldsEnabled" :min="minDate" :max="maxDate" :rules="[required]" />
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
          <VBtn text="Cancelar" variant="plain" @click="$emit('update:modelValue', false)" />
          <VSpacer />
          <VBtn type="submit">
            {{ isEdit ? 'Actualizar' : 'Crear' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VForm>
  </VDialog>
</template>
