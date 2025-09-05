<!-- components/ProductionCard.vue -->
<template>
  <VCard class="production-card" :class="`status-${production.status.toLowerCase()}`" elevation="2" hover>
    <VCardItem>
      <div class="d-flex align-start justify-space-between mb-2">
        <VCardTitle class="text-truncate pa-0">
          {{ production.cook?.person?.names }} {{ production.cook?.person?.lastName }}
        </VCardTitle>

        <VChip :color="getStatusColor(production.status)" size="small" variant="flat">
          {{ formatStatus(production.status) }}
        </VChip>
      </div>

      <VCardSubtitle class="pa-0">
        <div class="d-flex align-center mb-1">
          <VIcon size="16" color="grey" class="mr-1">mdi-card-account-details</VIcon>
          <span class="text-caption">RUN: {{ production.cook?.person?.run || 'N/A' }}</span>
        </div>
        <div class="d-flex align-center">
          <VIcon size="16" color="grey" class="mr-1">mdi-clock</VIcon>
          <span class="text-caption">Turno: {{ production.cook?.workShift || 'N/A' }}</span>
        </div>
      </VCardSubtitle>
    </VCardItem>

    <VCardText class="card-content">
      <VListSubheader class="px-0">📦 Asignaciones</VListSubheader>
      <VList density="compact" class="assignment-list">
        <VListItem v-for="pp in production.productionProduct"
          v-if="production.productionProduct && production.productionProduct.length > 0" :key="pp.id" class="px-0">
          <template #prepend>
            <VIcon size="small" color="primary">mdi-circle-small</VIcon>
          </template>
          <span class="text-truncate">{{ pp.product?.name }}</span>
          <template #append>
            <VChip size="x-small" variant="flat" color="primary">
              {{ pp.quantity }}
            </VChip>
          </template>
        </VListItem>
        <VListItem v-else class="px-0">
          <VIcon size="small" color="grey">mdi-information</VIcon>
          <span class="text-caption text-grey">Sin asignaciones</span>
        </VListItem>
      </VList>
    </VCardText>

    <VCardActions class="card-actions">
      <VSpacer />
      <div v-if="production.status === 'PENDING'">
        <VTooltip location="top">
          <template #activator="{ props: tooltipProps }">
            <VBtn v-bind="tooltipProps" icon="mdi-pencil" size="small" variant="text" color="primary"
              @click="$emit('edit', production)" />
          </template>
          <span>Editar</span>
        </VTooltip>
        <VTooltip location="top">
          <template #activator="{ props: tooltipProps }">
            <VBtn v-bind="tooltipProps" icon="mdi-close" size="small" variant="text" color="error"
              @click="$emit('delete', production)" />
          </template>
          <span>Cancelar</span>
        </VTooltip>
      </div>
      <div v-else-if="production.status === 'CANCELLED'">
        <VTooltip location="top">
          <template #activator="{ props: tooltipProps }">
            <VBtn v-bind="tooltipProps" icon="mdi-restore" size="small" variant="text" color="success"
              @click="$emit('recover', production)" />
          </template>
          <span>Recuperar</span>
        </VTooltip>
      </div>
      <div v-else-if="production.status === 'IN_PROGRESS'">
        <VTooltip location="top">
          <template #activator="{ props: tooltipProps }">
            <VBtn v-bind="tooltipProps" icon="mdi-check" size="small" variant="flat" color="success"
              @click="$emit('complete', production)" />
          </template>
          <span>Completar</span>
        </VTooltip>
      </div>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import type { Production } from '@/types/model';

defineProps<{
  production: Production
}>()

defineEmits<{
  (e: 'edit', production: any): void
  (e: 'delete', production: any): void
  (e: 'recover', production: any): void
  (e: 'complete', production: any): void
}>()

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'warning'
    case 'COMPLETED': return 'success'
    case 'CANCELLED': return 'error'
    case 'IN_PROGRESS': return 'info'
    default: return 'secondary'
  }
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'PENDING': 'Pendiente',
    'COMPLETED': 'Completado',
    'CANCELLED': 'Cancelado',
    'IN_PROGRESS': 'En Proceso'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.production-card {
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
  block-size: 20rem;
  transition: all 0.3s ease;
}

.production-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 15%);
  transform: translateY(-4px);
}

.card-content {
  flex: 1;
  overflow-y: auto;
  padding-block-end: 0;
}

.assignment-list {
  max-block-size: 120px;
}

.card-actions {
  border-block-start: 1px solid rgba(0, 0, 0, 10%);
  padding-block: 12px;
  padding-inline: 16px;
}

.status-pending {
  border-inline-start: 4px solid rgb(var(--v-theme-warning));
}

.status-completed {
  border-inline-start: 4px solid rgb(var(--v-theme-success));
}

.status-cancelled {
  border-inline-start: 4px solid rgb(var(--v-theme-error));
}

.status-in_progress {
  border-inline-start: 4px solid rgb(var(--v-theme-info));
}
</style>
