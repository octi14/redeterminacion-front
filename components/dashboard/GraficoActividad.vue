<template>
  <b-card title="Gráfico de Actividad" class="mb-4">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <h5 class="mb-0">
          <i class="bi bi-graph-up mr-2"></i>
          Actividad por Día
        </h5>
        <b-button-group size="sm">
          <b-button
            v-for="periodo in periodos"
            :key="periodo.value"
            :variant="periodoActivo === periodo.value ? 'primary' : 'outline-primary'"
            @click="cambiarPeriodo(periodo.value)"
          >
            {{ periodo.label }}
          </b-button>
        </b-button-group>
      </div>
    </template>

    <div class="text-center py-4">
      <div class="mb-3">
        <i class="bi bi-bar-chart-fill text-primary" style="font-size: 3rem;"></i>
      </div>
      <h6 class="text-muted">Gráfico de Actividad</h6>
      <p class="text-muted mb-0">
        Este componente está preparado para integrar librerías de gráficos como Chart.js o D3.js
      </p>
      <small class="text-muted">
        Datos disponibles: {{ datosActividad.length }} puntos
      </small>
    </div>
  </b-card>
</template>

<script>
export default {
  name: 'GraficoActividad',
  props: {
    datosActividad: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      periodoActivo: 'semana',
      periodos: [
        { label: '7 días', value: 'semana' },
        { label: '30 días', value: 'mes' },
        { label: '90 días', value: 'trimestre' }
      ]
    }
  },
  methods: {
    cambiarPeriodo(periodo) {
      this.periodoActivo = periodo
      this.$emit('cambiar-periodo', periodo)
    }
  }
}
</script>

<style scoped>
.card {
  min-height: 300px;
}
</style>
