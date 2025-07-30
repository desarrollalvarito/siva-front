<template>
  <template>
    <div class="d-flex justify-center">
      <VCard class="pa-4" width="900">
        <v-date-input v-model="model" max-width="368"></v-date-input>
      </VCard>
    </div>
  </template>
</template>

<script setup>
import { shallowRef } from 'vue'
import { useDate } from 'vuetify'
import { VDateInput } from 'vuetify/labs/components'


const adapter = useDate()
const model = shallowRef(adapter.parseISO('2025-02-25'))

function format(date) {
  return adapter.toISO(date)
}
</script>
