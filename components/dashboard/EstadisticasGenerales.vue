<template>
  <div>
    <h4 class="section-title">
      <i class="bi bi-bar-chart-fill mr-2"></i>
      Estadísticas Generales del Sistema
    </h4>

    <b-row>
      <b-col md="3" sm="6" class="mb-3">
        <EstadisticaCard
          titulo="Total Usuarios"
          :valor="estadisticas?.totalUsuarios || 0"
          descripcion="Usuarios registrados"
          icono="bi bi-people-fill"
          variant="primary"
        />
      </b-col>

      <b-col md="3" sm="6" class="mb-3">
        <EstadisticaCard
          titulo="Total Trámites"
          :valor="estadisticas?.totalTramites || 0"
          descripcion="Trámites procesados"
          icono="bi bi-file-earmark-text-fill"
          variant="success"
        />
      </b-col>

      <b-col md="3" sm="6" class="mb-3">
        <EstadisticaCard
          titulo="Documentos S3"
          :valor="estadisticas?.totalDocumentos || 0"
          descripcion="Archivos en bucket"
          icono="bi bi-cloud-fill"
          variant="info"
        />
      </b-col>

      <b-col md="3" sm="6" class="mb-3">
        <EstadisticaCard
          titulo="Espacio Usado"
          :valor="estadisticas?.espacioUsado || '0 MB'"
          descripcion="En Amazon S3"
          icono="bi bi-hdd-fill"
          variant="warning"
        />
      </b-col>
    </b-row>

  </div>
</template>

<script>
import EstadisticaCard from './EstadisticaCard.vue'

export default {
  name: 'EstadisticasGenerales',
  components: {
    EstadisticaCard
  },
  props: {
    estadisticas: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
