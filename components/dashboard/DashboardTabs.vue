<template>
  <div>
    <!-- Pestañas de navegación -->
    <b-card class="mb-4">
      <b-tabs
        v-model="tabIndex"
        card
        class="dashboard-tabs"
        nav-class="nav-pills"
        content-class="mt-4"
      >
        <!-- Pestaña General -->
        <b-tab title-link-class="tab-link-general">
          <template #title>
            <i class="bi bi-speedometer2 mr-2"></i>
            <span class="d-none d-md-inline">General</span>
          </template>

          <div class="tab-content-general">
            <!-- Estadísticas Generales -->
            <div class="row mb-4">
              <div class="col-12">
                <EstadisticasGenerales :estadisticas="estadisticasGenerales" />
              </div>
            </div>

            <!-- Estadísticas por Módulo -->
            <div class="row mb-4">
              <div class="col-12">
                <EstadisticasModulos :modulos="modulos" />
              </div>
            </div>
          </div>
        </b-tab>

        <!-- Pestaña Comercio -->
        <b-tab title-link-class="tab-link-comercio">
          <template #title>
            <i class="bi bi-shop-fill mr-2"></i>
            <span class="d-none d-md-inline">Comercio</span>
            <b-badge v-if="modulos?.comercio?.total" variant="primary" class="ml-2">
              {{ modulos.comercio.total }}
            </b-badge>
          </template>

          <div class="tab-content-comercio">
            <!-- Análisis Detallado de Comercio -->
            <div class="row mb-4">
              <div class="col-12">
                <EstadisticasDetalladas :modulos="{ comercio: modulos?.comercio }" />
              </div>
            </div>

            <!-- Gráficos de Comercio -->
            <div class="row mb-4">
              <div class="col-12">
                <GraficosComercio :estadisticas-comercio="modulos?.comercio || {}" />
              </div>
            </div>
          </div>
        </b-tab>

        <!-- Pestaña Abierto Anual -->
        <b-tab title-link-class="tab-link-abierto-anual">
          <template #title>
            <i class="bi bi-calendar-year-fill mr-2"></i>
            <span class="d-none d-md-inline">Abierto Anual</span>
            <b-badge v-if="modulos?.abiertoAnual?.total" variant="info" class="ml-2">
              {{ modulos.abiertoAnual.total }}
            </b-badge>
          </template>

          <div class="tab-content-abierto-anual">
            <!-- Análisis Detallado de Abierto Anual -->
            <div class="row mb-4">
              <div class="col-12">
                <EstadisticasDetalladas :modulos="{ abiertoAnual: modulos?.abiertoAnual }" />
              </div>
            </div>

            <!-- Gráficos de Abierto Anual -->
            <div class="row mb-4">
              <div class="col-12">
                <GraficosAbiertoAnual :estadisticas-abierto-anual="modulos?.abiertoAnual || {}" />
              </div>
            </div>
          </div>
        </b-tab>

        <!-- Pestaña Obras -->
        <b-tab title-link-class="tab-link-obras">
          <template #title>
            <i class="bi bi-building-fill mr-2"></i>
            <span class="d-none d-md-inline">Obras</span>
            <b-badge v-if="modulos?.obras?.total" variant="success" class="ml-2">
              {{ modulos.obras.total }}
            </b-badge>
          </template>

          <div class="tab-content-obras">
            <!-- Análisis Detallado de Obras -->
            <div class="row mb-4">
              <div class="col-12">
                <EstadisticasDetalladas :modulos="{ obras: modulos?.obras }" />
              </div>
            </div>

            <!-- Gráfico de Índices -->
            <div class="row mb-4">
              <div class="col-12">
                <GraficoIndices :evolucion-indices="modulos?.indices?.evolucionTemporal || {}" />
              </div>
            </div>
          </div>
        </b-tab>

        <!-- Pestaña Recaudaciones -->
        <b-tab title-link-class="tab-link-recaudaciones">
          <template #title>
            <i class="bi bi-cash-stack-fill mr-2"></i>
            <span class="d-none d-md-inline">Recaudaciones</span>
            <b-badge v-if="modulos?.recaudaciones?.total" variant="warning" class="ml-2">
              {{ modulos.recaudaciones.total }}
            </b-badge>
          </template>

          <div class="tab-content-recaudaciones">
            <!-- Análisis Detallado de Recaudaciones -->
            <div class="row mb-4">
              <div class="col-12">
                <EstadisticasDetalladas :modulos="{ recaudaciones: modulos?.recaudaciones }" />
              </div>
            </div>
          </div>
        </b-tab>

        <!-- Pestaña Combustible -->
        <b-tab title-link-class="tab-link-combustible">
          <template #title>
            <i class="bi bi-fuel-pump-fill mr-2"></i>
            <span class="d-none d-md-inline">Combustible</span>
            <b-badge v-if="modulos?.combustible?.total" variant="danger" class="ml-2">
              {{ modulos.combustible.total }}
            </b-badge>
          </template>

          <div class="tab-content-combustible">
            <!-- Análisis Detallado de Combustible -->
            <div class="row mb-4">
              <div class="col-12">
                <EstadisticasDetalladas :modulos="{ combustible: modulos?.combustible }" />
              </div>
            </div>
          </div>
        </b-tab>

        <!-- Pestaña Turnos -->
        <b-tab title-link-class="tab-link-turnos">
          <template #title>
            <i class="bi bi-calendar-check-fill mr-2"></i>
            <span class="d-none d-md-inline">Turnos</span>
            <b-badge v-if="modulos?.turnos?.total" variant="info" class="ml-2">
              {{ modulos.turnos.total }}
            </b-badge>
          </template>

          <div class="tab-content-turnos">
            <!-- Análisis Detallado de Turnos -->
            <div class="row mb-4">
              <div class="col-12">
                <EstadisticasDetalladas :modulos="{ turnos: modulos?.turnos }" />
              </div>
            </div>
          </div>
        </b-tab>


        <!-- Pestaña Usuarios -->
        <b-tab title-link-class="tab-link-usuarios">
          <template #title>
            <i class="bi bi-people-fill mr-2"></i>
            <span class="d-none d-md-inline">Usuarios</span>
            <b-badge v-if="estadisticasUsuarios?.total" variant="dark" class="ml-2">
              {{ estadisticasUsuarios.total }}
            </b-badge>
          </template>

          <div class="tab-content-usuarios">
            <!-- Estadísticas de Usuarios -->
            <div class="row mb-4">
              <div class="col-12">
                <b-card class="mb-4">
                  <template #header>
                    <div class="d-flex align-items-center">
                      <i class="bi bi-people-fill text-primary mr-2"></i>
                      <strong>Estadísticas de Usuarios</strong>
                      <span class="ml-auto h4 text-primary font-weight-bold">{{ estadisticasUsuarios?.total || 0 }}</span>
                    </div>
                  </template>

                  <b-row>
                    <b-col md="3" class="mb-3">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="font-weight-bold text-dark">Master:</span>
                        <span class="h5 text-danger font-weight-bold">{{ estadisticasUsuarios?.porRol?.master || 0 }}</span>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="font-weight-bold text-dark">Hacienda:</span>
                        <span class="h5 text-info font-weight-bold">{{ estadisticasUsuarios?.porRol?.hacienda || 0 }}</span>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="font-weight-bold text-dark">Comercio:</span>
                        <span class="h5 text-warning font-weight-bold">{{ estadisticasUsuarios?.porRol?.comercio || 0 }}</span>
                      </div>
                    </b-col>

                    <b-col md="3" class="mb-3">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="font-weight-bold text-dark">Arvige:</span>
                        <span class="h5 text-secondary font-weight-bold">{{ estadisticasUsuarios?.porRol?.arvige || 0 }}</span>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="font-weight-bold text-dark">Inspección:</span>
                        <span class="h5 text-dark font-weight-bold">{{ estadisticasUsuarios?.porRol?.inspeccion || 0 }}</span>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="font-weight-bold text-dark">Recaudaciones:</span>
                        <span class="h5 text-success font-weight-bold">{{ estadisticasUsuarios?.porRol?.recaudaciones || 0 }}</span>
                      </div>
                    </b-col>

                    <b-col md="3" class="mb-3">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="font-weight-bold text-dark">Modernización:</span>
                        <span class="h5 text-primary font-weight-bold">{{ estadisticasUsuarios?.porRol?.modernizacion || 0 }}</span>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="font-weight-bold text-dark">Compras:</span>
                        <span class="h5 text-info font-weight-bold">{{ estadisticasUsuarios?.porRol?.compras || 0 }}</span>
                      </div>
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="font-weight-bold text-dark">Cultura:</span>
                        <span class="h5 text-warning font-weight-bold">{{ estadisticasUsuarios?.porRol?.cultura || 0 }}</span>
                      </div>
                    </b-col>

                    <b-col md="3" class="mb-3">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="font-weight-bold text-dark">Otros:</span>
                        <span class="h5 text-muted font-weight-bold">{{ estadisticasUsuarios?.porRol?.otros || 0 }}</span>
                      </div>
                    </b-col>
                  </b-row>
                </b-card>
              </div>
            </div>

            <!-- Usuarios por Año -->
            <div class="row mb-4">
              <div class="col-12">
                <b-card class="mb-4">
                  <template #header>
                    <div class="d-flex align-items-center">
                      <i class="bi bi-calendar3 text-success mr-2"></i>
                      <strong>Usuarios por Año de Creación</strong>
                    </div>
                  </template>

                  <b-row>
                    <b-col md="4" class="mb-3">
                      <div class="text-center p-3 border rounded bg-light">
                        <div class="h2 text-primary font-weight-bold mb-1">{{ estadisticasUsuarios?.porAño?.año2023 || 0 }}</div>
                        <div class="text-muted font-weight-bold">2023</div>
                      </div>
                    </b-col>
                    <b-col md="4" class="mb-3">
                      <div class="text-center p-3 border rounded bg-light">
                        <div class="h2 text-info font-weight-bold mb-1">{{ estadisticasUsuarios?.porAño?.año2024 || 0 }}</div>
                        <div class="text-muted font-weight-bold">2024</div>
                      </div>
                    </b-col>
                    <b-col md="4" class="mb-3">
                      <div class="text-center p-3 border rounded bg-light">
                        <div class="h2 text-success font-weight-bold mb-1">{{ estadisticasUsuarios?.porAño?.año2025 || 0 }}</div>
                        <div class="text-muted font-weight-bold">2025</div>
                      </div>
                    </b-col>
                  </b-row>
                </b-card>
              </div>
            </div>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import EstadisticasGenerales from '~/components/dashboard/EstadisticasGenerales.vue'
import EstadisticasModulos from '~/components/dashboard/EstadisticasModulos.vue'
import EstadisticasDetalladas from '~/components/dashboard/EstadisticasDetalladas.vue'
import GraficosComercio from '~/components/dashboard/GraficosComercio.vue'
import GraficosAbiertoAnual from '~/components/dashboard/GraficosAbiertoAnual.vue'
import GraficoIndices from '~/components/dashboard/GraficoIndices.vue'

export default {
  name: 'DashboardTabs',
  components: {
    EstadisticasGenerales,
    EstadisticasModulos,
    EstadisticasDetalladas,
    GraficosComercio,
    GraficosAbiertoAnual,
    GraficoIndices
  },
  props: {
    modulos: {
      type: Object,
      default: () => ({})
    },
    estadisticasGenerales: {
      type: Object,
      default: () => ({})
    },
    estadisticasUsuarios: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tabIndex: 0
    }
  }
}
</script>

<style scoped>
.dashboard-tabs {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  border: none;
}

.dashboard-tabs .nav-pills .nav-link {
  border-radius: 25px;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  color: #6c757d;
}

.dashboard-tabs .nav-pills .nav-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
}

.dashboard-tabs .nav-pills .nav-link.active {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-color: #28a745;
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

/* Estilos específicos por pestaña */
.tab-link-general.active {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important;
  border-color: #007bff !important;
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.3) !important;
}

.tab-link-comercio.active {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%) !important;
  border-color: #ffc107 !important;
  box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3) !important;
}

.tab-link-abierto-anual.active {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%) !important;
  border-color: #17a2b8 !important;
  box-shadow: 0 5px 15px rgba(23, 162, 184, 0.3) !important;
}

.tab-link-obras.active {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
  border-color: #28a745 !important;
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3) !important;
}

.tab-link-recaudaciones.active {
  background: linear-gradient(135deg, #fd7e14 0%, #e55a00 100%) !important;
  border-color: #fd7e14 !important;
  box-shadow: 0 5px 15px rgba(253, 126, 20, 0.3) !important;
}

.tab-link-combustible.active {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%) !important;
  border-color: #dc3545 !important;
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3) !important;
}

.tab-link-turnos.active {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%) !important;
  border-color: #17a2b8 !important;
  box-shadow: 0 5px 15px rgba(23, 162, 184, 0.3) !important;
}


.tab-link-usuarios.active {
  background: linear-gradient(135deg, #343a40 0%, #23272b 100%) !important;
  border-color: #343a40 !important;
  box-shadow: 0 5px 15px rgba(52, 58, 64, 0.3) !important;
}

/* Contenido de las pestañas */
.tab-content-general,
.tab-content-comercio,
.tab-content-abierto-anual,
.tab-content-obras,
.tab-content-recaudaciones,
.tab-content-combustible,
.tab-content-turnos,
.tab-content-usuarios {
  animation: fadeInTab 0.3s ease-in;
}

@keyframes fadeInTab {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-tabs .nav-pills .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
  }

  .dashboard-tabs .nav-pills .nav-link i {
    font-size: 1rem;
  }
}

/* Badges en las pestañas */
.dashboard-tabs .nav-pills .nav-link .badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
}
</style>
