<template>
  <div>
    <h4 class="section-title">
      <i class="bi bi-grid-3x3-gap-fill mr-2"></i>
      Estadísticas por Módulo
    </h4>

    <b-row>
      <b-col md="4" sm="6" class="mb-3">
        <EstadisticaCard
          titulo="Comercio"
          :valor="modulos?.comercio?.total || 0"
          descripcion="Trámites comerciales"
          icono="bi bi-shop-fill"
          variant="primary"
          :footer="`${modulos?.comercio?.pendientes || 0} en revisión`"
        />
      </b-col>

      <b-col md="4" sm="6" class="mb-3">
        <EstadisticaCard
          titulo="Abierto Anual"
          :valor="modulos?.abiertoAnual?.total || 0"
          descripcion="Trámites abierto anual"
          icono="bi bi-calendar-year-fill"
          variant="info"
          :footer="`${modulos?.abiertoAnual?.documentos?.conDocumentos || 0} con documentos`"
        />
      </b-col>

      <b-col md="4" sm="6" class="mb-3">
        <EstadisticaCard
          titulo="Obras"
          :valor="modulos?.obras?.total || 0"
          descripcion="Obras registradas"
          icono="bi bi-building-fill"
          variant="success"
          :footer="`${modulos?.obras?.enProgreso || 0} en progreso`"
        />
      </b-col>

      <b-col md="4" sm="6" class="mb-3">
        <EstadisticaCard
          titulo="Recaudaciones"
          :valor="modulos?.recaudaciones?.total || 0"
          descripcion="Pagos procesados"
          icono="bi bi-cash-stack-fill"
          variant="info"
          :footer="`${modulos?.recaudaciones?.documentos?.conDocumentos || 0} con documentos`"
        />
      </b-col>

      <b-col md="4" sm="6" class="mb-3">
        <EstadisticaCard
          titulo="Turnos"
          :valor="modulos?.turnos?.total || 0"
          descripcion="Turnos asignados"
          icono="bi bi-calendar-check-fill"
          variant="warning"
          :footer="`${modulos?.turnos?.ultimos30Dias || 0} últimos 30 días`"
        />
      </b-col>

      <b-col md="4" sm="6" class="mb-3">
        <EstadisticaCard
          titulo="Índices"
          :valor="modulos?.indices?.total || 0"
          descripcion="Índices creados"
          icono="bi bi-graph-up-arrow-fill"
          variant="secondary"
        />
      </b-col>

      <b-col md="4" sm="6" class="mb-3">
        <EstadisticaCard
          titulo="Combustible"
          :valor="modulos?.combustible?.totalOrdenes || 0"
          descripcion="Órdenes de compra"
          icono="bi bi-fuel-pump-fill"
          variant="danger"
          :footer="`$${modulos?.combustible?.valorPromedioVale?.toFixed(0) || 0} promedio vale`"
        />
      </b-col>

      <b-col md="4" sm="6" class="mb-3">
        <EstadisticaCard
          titulo="Multimedia"
          :valor="modulos?.multimedia?.total || 0"
          descripcion="Archivos multimedia"
          icono="bi bi-images-fill"
          variant="dark"
          :footer="`${modulos?.multimedia?.tamañoTotal || '0 MB'}`"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import EstadisticaCard from './EstadisticaCard.vue'

export default {
  name: 'EstadisticasModulos',
  components: {
    EstadisticaCard
  },
  props: {
    modulos: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
