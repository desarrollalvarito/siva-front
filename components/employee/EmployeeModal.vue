<template>
  <VDialog max-width="600" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <VForm @submit.prevent="handleSubmit">
      <VCard :title="`${isEdit ? 'Modificar' : 'Nuevo'} empleado`">
        <VCardText>
          <VCard title="Datos Personales" class="mb-4" variant="outlined">
            <VCardText>
              <VRow>
                <VCol cols="12" md="9">
                  <VAutocomplete v-model="form.person.run" :items="peoople" label="Buscar por RUN" item-title="run"
                    item-value="id" placeholder="12345678-9" :disabled="editableRUN" clearable :hide-no-data="false"
                    :search="search" @update:search="onSearchUpdate" @update:model-value="onSelectedRun">
                    <template #item="{ props, item }">
                      <VListItem v-bind="props" :subtitle="`${item.raw.names} ${item.raw.lastName}`"
                        :title="item.raw.run" />
                    </template>
                    <template #no-data>
                      <VListItem>
                        <VListItemTitle style="cursor: pointer;" @click="registrarNuevoRUN">
                          No se encontró "<strong>{{ search }}</strong>" Registrar ➕.
                        </VListItemTitle>
                      </VListItem>
                    </template>
                  </VAutocomplete>
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField v-model="form.person.names" label="Nombres" placeholder="Juan" :disabled="editable" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="form.person.lastName" label="Apellidos" placeholder="Perez"
                    :disabled="editable" />
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12" md="6">
                  <VSelect v-model="form.person.gender" label="Genero" placeholder="Seleccione su genero"
                    :items="genderList" :disabled="editable" />
                </VCol>
                <VCol cols="12" md="6">
                  <VDateInput v-model="form.person.birthDate" label="Fecha de nacimiento" placeholder="01/01/1991"
                    prepend-icon="" :disabled="editable" />
                </VCol>
              </VRow>
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField v-model="form.person.address" label="Direccion" placeholder="Av. 18 N# 5"
                    :disabled="editable" />
                </VCol>
                <VCol cols="12" md="6">
                  <VTextField v-model="form.person.contact" label="Numero de Telefono" placeholder="+11578565411"
                    :disabled="editable" />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
          <VCard title="Datos Laborales" class="mb-4" variant="outlined">
            <VCardText>
              <VRow>
                <VCol cols="12" md="6">
                  <VSelect v-model="form.jobRole" label="Cargo" placeholder="Gerente" :items="jobRoles"
                    :disabled="editable" />
                </VCol>
                <VCol cols="12" md="6">
                  <VSelect v-model="form.workShift" label="Turno" placeholder="Mañana, Tarde, Noche" :items="workShifts"
                    :disabled="editable" />
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCardText>>

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

<script setup lang="ts">
import type { Employee } from '@/types/model';

const props = defineProps<{
  modelValue: boolean
  employee?: Employee | null
  isEdit?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', employee: Employee): void;
}>();

// Formulario reactivo
const form = ref<Employee>({
  workShift: '',
  jobRole: '',
  idPerson: 0,
  person: {
    run: '',
    names: '',
    lastName: '',
    gender: '',
    address: '',
    birthDate: '',
    contact: '',
  }
});

// Reglas de validación
const required = (v: string) => !!v || 'Campo requerido';
const positiveNumber = (v: number) => v > 0 || 'Debe ser mayor a 0';

// Sincronizar props al formulario
watch(() => props.employee, (newVal) => {
  if (newVal) form.value = { ...newVal };
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', form.value);
  emit('update:modelValue', false);
};
</script>
