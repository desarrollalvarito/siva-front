<script setup lang="ts">
const props = defineProps<{
  kpis: {
    totalOrdenes: number,
    totalProductos: number,
    produccionProgramada: number,
    produccionEnProceso: number,
    productosDisponibles: number
  }
}>()
</script>

<template>
  <!-- SECCIÓN DE KPIS MEJORADA -->
  <VContainer class="mb-4">
    <VRow>
      <!-- PRIMER KPI: Total Órdenes + Productos -->
      <VCol cols="12" md="4">
        <VCard variant="flat" class="kpi-card gradient-primary" elevation="4">
          <VCardText class="text-center text-white">
            <div class="kpi-icon">
              <VIcon size="40" color="white">mdi-clipboard-list-outline</VIcon>
            </div>

            <!-- Total de Órdenes -->
            <div class="text-h2 font-weight-bold text-white mb-1">
              {{ kpis.totalOrdenes }}
            </div>
            <div class="text-body-1 text-white mb-3">
              Órdenes del Día
            </div>

            <VDivider color="white" class="opacity-50 my-3" />

            <!-- Total de Productos -->
            <div class="d-flex align-center justify-center">
              <VIcon size="24" color="white" class="mr-2">mdi-package-variant</VIcon>
              <div class="text-h5 font-weight-bold text-white">
                {{ kpis.totalProductos }}
              </div>
            </div>
            <div class="text-caption text-white opacity-80">
              Total Productos
            </div>

            <!-- Badge de estado -->
            <VChip size="small" color="info" text-color="primary" class="mt-3">
              <VIcon size="16" class="mr-1">
                {{ kpis.totalOrdenes > 0 ? 'mdi-trending-up' : 'mdi-trending-neutral' }}
              </VIcon>
              {{ kpis.totalOrdenes > 0 ? 'Activo' : 'Sin actividad' }}
            </VChip>
          </VCardText>
        </VCard>
      </VCol>

      <!-- SEGUNDO KPI: Producción Programada -->
      <VCol cols="12" md="4">
        <VCard variant="flat" class="kpi-card gradient-warning" elevation="4">
          <VCardText class="text-center text-white">
            <div class="kpi-icon">
              <VIcon size="40" color="white">mdi-calendar-clock</VIcon>
            </div>

            <div class="text-h2 font-weight-bold text-white mb-1">
              {{ kpis.produccionProgramada }}
            </div>
            <div class="text-body-1 text-white mb-3">
              Programadas
            </div>

            <VDivider color="white" class="opacity-50 my-3" />

            <!-- Progress Circular -->
            <div class="progress-circular-container">
              <VProgressCircular :model-value="kpis.totalProductos > 0 ?
                (kpis.produccionProgramada / kpis.totalProductos) * 100 : 0" :size="60" :width="4" color="white"
                class="mb-2">
                <span class="text-white text-caption font-weight-bold">
                  {{ kpis.totalProductos > 0 ?
                    Math.round((kpis.produccionProgramada / kpis.totalProductos) * 100) : 0 }}%
                </span>
              </VProgressCircular>
            </div>

            <div class="text-caption text-white opacity-80 mt-2">
              de productos programados
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- TERCER KPI: Producción en Proceso -->
      <VCol cols="12" md="4">
        <VCard variant="flat" class="kpi-card gradient-success" elevation="4">
          <VCardText class="text-center text-white">
            <div class="kpi-icon">
              <VIcon size="40" color="white">mdi-chef-hat</VIcon>
            </div>

            <div class="text-h2 font-weight-bold text-white mb-1">
              {{ kpis.produccionEnProceso }}
            </div>
            <div class="text-body-1 text-white mb-3">
              En Producción
            </div>

            <VDivider color="white" class="opacity-50 my-3" />

            <!-- Stats de eficiencia -->
            <div class="efficiency-stats">
              <div class="stat-item">
                <div class="text-h6 text-white font-weight-bold">
                  {{ kpis.produccionProgramada > 0 ?
                    Math.round((kpis.produccionEnProceso / kpis.produccionProgramada) * 100) : 0 }}%
                </div>
                <div class="text-caption text-white opacity-80">
                  Avance
                </div>
              </div>
              <VDivider vertical color="white" class="opacity-50 mx-3" />
              <div class="stat-item">
                <div class="text-h6 text-white font-weight-bold">
                  {{ kpis.produccionEnProceso > 0 ? '🎯' : '⏸️' }}
                </div>
                <div class="text-caption text-white opacity-80">
                  Estado
                </div>
              </div>
            </div>

            <!-- Mini progress bar -->
            <VProgressLinear :model-value="kpis.produccionProgramada > 0 ?
              (kpis.produccionEnProceso / kpis.produccionProgramada) * 100 : 0" color="white" height="6" rounded
              class="mt-3" />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- ALERTA DE PRODUCTOS PENDIENTES -->
    <VRow class="mt-4">
      <VCol cols="12">
        <VAlert variant="tonal" color="info" border="start" elevation="2">
          <template #prepend>
            <VIcon size="30" color="info">mdi-alert-circle-outline</VIcon>
          </template>
          <VAlertTitle class="text-h6">
            📦 Productos Pendientes de Programación
          </VAlertTitle>
          <div class="alert-content">
            <div class="d-flex align-center justify-space-between">
              <div>
                <span class="text-h4 font-weight-bold info--text">
                  {{ kpis.productosDisponibles }}
                </span>
                <span class="text-body-2 text-medium-emphasis ml-2">
                  / {{ kpis.totalProductos }} productos totales
                </span>
              </div>
              <VChip :color="kpis.productosDisponibles > 0 ? 'warning' : 'success'" size="small">
                <VIcon size="16" class="mr-1">
                  {{ kpis.productosDisponibles > 0 ? 'mdi-alert' : 'mdi-check' }}
                </VIcon>
                {{ kpis.productosDisponibles > 0 ? 'Pendiente' : 'Al día' }}
              </VChip>
            </div>
            <VProgressLinear :model-value="kpis.totalProductos > 0 ?
              ((kpis.totalProductos - kpis.productosDisponibles) / kpis.totalProductos) * 100 : 100" color="info"
              height="12" rounded class="mt-3">
              <strong>{{ kpis.totalProductos > 0 ?
                Math.round(((kpis.totalProductos - kpis.productosDisponibles) / kpis.totalProductos) * 100) : 100
                }}%</strong>
            </VProgressLinear>
          </div>
        </VAlert>
      </VCol>
    </VRow>
  </VContainer>
</template>
<style scoped>
/* Gradientes modernos */
.gradient-primary {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, #3b82f6 100%);
}

.gradient-warning {
  background: linear-gradient(135deg, rgb(var(--v-theme-warning)) 0%, #f59e0b 100%);
}

.gradient-success {
  background: linear-gradient(135deg, rgb(var(--v-theme-success)) 0%, #10b981 100%);
}

.kpi-card {
  overflow: hidden;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.kpi-card:hover {
  box-shadow: 0 12px 30px rgba(0, 0, 0, 20%);
  transform: translateY(-4px);
}

.kpi-icon {
  margin-block-end: 16px;
}

.progress-circular-container {
  display: flex;
  justify-content: center;
  margin-block: 12px;
  margin-inline: 0;
}

.efficiency-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-block: 12px;
  margin-inline: 0;
}

.stat-item {
  text-align: center;
}

.alert-content {
  inline-size: 100%;
}

.production-section {
  overflow: hidden;
  border-radius: 12px;
}

/* Animaciones suaves */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mejoras de responsive */
@media (max-width: 960px) {
  .kpi-card {
    margin-block-end: 16px;
  }

  .efficiency-stats {
    flex-direction: column;
    gap: 8px;
  }

  .stat-item {
    margin-block-end: 8px;
  }
}

/* Efectos de profundidad */
.elevation-4 {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 10%) !important;
}

.elevation-4:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 15%) !important;
}

/* Mejoras de tipografía */
.text-h2 {
  font-size: 2.5rem !important;
  line-height: 1.2;
}

.text-h6 {
  font-weight: 600 !important;
}

/* Transiciones suaves */
.v-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-btn {
  transition: all 0.2s ease;
}

/* Mejoras de scroll */
.assignment-list::-webkit-scrollbar {
  inline-size: 4px;
}

.assignment-list::-webkit-scrollbar-track {
  border-radius: 2px;
  background: rgba(0, 0, 0, 5%);
}

.assignment-list::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: rgba(0, 0, 0, 20%);
}

.assignment-list::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 30%);
}
</style>
