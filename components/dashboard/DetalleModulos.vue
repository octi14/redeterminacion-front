<template>
  <div>
    <h4 class="section-title">
      <i class="bi bi-list-ul mr-2"></i>
      Detalle por Módulo
    </h4>

    <b-row>
      <b-col md="6" lg="4" class="mb-3">
        <b-card class="h-100 detail-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-shop-fill text-primary mr-2"></i>
              <strong>Comercio</strong>
            </div>
          </template>
          <div class="text-center">
            <h3 class="text-primary mb-2">{{ modulos?.comercio?.total || 0 }}</h3>
            <p class="mb-1">Total Trámites</p>
            <small class="text-muted">{{ modulos?.comercio?.pendientes || 0 }} pendientes</small>
          </div>
        </b-card>
      </b-col>

      <b-col md="6" lg="4" class="mb-3">
        <b-card class="h-100 detail-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-calendar-year-fill text-info mr-2"></i>
              <strong>Abierto Anual</strong>
            </div>
          </template>
          <div class="text-center">
            <h3 class="text-info mb-2">{{ modulos?.abiertoAnual?.total || 0 }}</h3>
            <p class="mb-1">Total Trámites</p>
            <small class="text-muted">{{ modulos?.abiertoAnual?.documentos?.conDocumentos || 0 }} con documentos</small>
          </div>
        </b-card>
      </b-col>

      <b-col md="6" lg="4" class="mb-3">
        <b-card class="h-100 detail-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-building-fill text-success mr-2"></i>
              <strong>Obras</strong>
            </div>
          </template>
          <div class="text-center">
            <h3 class="text-success mb-2">{{ modulos?.obras?.total || 0 }}</h3>
            <p class="mb-1">Total Obras</p>
            <small class="text-muted">{{ modulos?.obras?.enProgreso || 0 }} en progreso</small>
          </div>
        </b-card>
      </b-col>

      <b-col md="6" lg="4" class="mb-3">
        <b-card class="h-100 detail-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-calendar-check-fill text-info mr-2"></i>
              <strong>Turnos</strong>
            </div>
          </template>
          <div class="text-center">
            <h3 class="text-info mb-2">{{ modulos?.turnos?.total || 0 }}</h3>
            <p class="mb-1">Total Turnos</p>
            <small class="text-muted">{{ modulos?.turnos?.disponibles || 0 }} disponibles</small>
          </div>
        </b-card>
      </b-col>

      <b-col md="6" lg="4" class="mb-3">
        <b-card class="h-100 detail-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-cash-stack-fill text-warning mr-2"></i>
              <strong>Recaudaciones</strong>
            </div>
          </template>
          <div class="text-center">
            <h3 class="text-warning mb-2">{{ modulos?.recaudaciones?.total || 0 }}</h3>
            <p class="mb-1">Pagos Dobles</p>
            <small class="text-muted">{{ modulos?.recaudaciones?.documentos?.conDocumentos || 0 }} con documentos</small>
          </div>
        </b-card>
      </b-col>

      <b-col md="6" lg="4" class="mb-3">
        <b-card class="h-100 detail-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-images-fill text-dark mr-2"></i>
              <strong>Multimedia</strong>
            </div>
          </template>
          <div class="text-center">
            <h3 class="text-dark mb-2">{{ modulos?.multimedia?.total || 0 }}</h3>
            <p class="mb-1">Archivos Multimedia</p>
            <small class="text-muted">Tamaño: {{ modulos?.multimedia?.tamañoTotal || 'N/A' }}</small>
          </div>
        </b-card>
      </b-col>

      <b-col md="6" lg="4" class="mb-3">
        <b-card class="h-100 detail-card">
          <template #header>
            <div class="d-flex align-items-center">
              <i class="bi bi-fuel-pump-fill text-danger mr-2"></i>
              <strong>Combustible</strong>
            </div>
          </template>
          <div class="text-center">
            <h3 class="text-danger mb-2">{{ modulos?.combustible?.totalOrdenes || 0 }}</h3>
            <p class="mb-1">Total Órdenes</p>
            <small class="text-muted">{{ modulos?.combustible?.totalValesGenerados || 0 }} vales generados</small>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'DetalleModulos',
  props: {
    modulos: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped>
.detail-card {
  background: white;
  border-radius: 15px;
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.detail-card .card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 2px solid #dee2e6;
  border-radius: 15px 15px 0 0 !important;
  padding: 1rem 1.25rem;
}

.detail-card .card-header i {
  font-size: 1.1em;
}

.detail-card .card-body {
  padding: 1.25rem;
}

.detail-card .card-body h3 {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.detail-card .card-body p {
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.detail-card .card-body small {
  color: #adb5bd;
}
</style>
