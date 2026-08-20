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
            <div v-if="!modulos || modulos.comercio === undefined" class="tab-loading py-5 text-center">
              <b-spinner variant="primary" label="Cargando..."></b-spinner>
              <p class="mt-2 text-muted mb-0">Cargando estadísticas de Comercio...</p>
            </div>
            <template v-else>
              <div class="row mb-4">
                <div class="col-12">
                  <EstadisticasDetalladas :modulos="{ comercio: modulos.comercio }" />
                </div>
              </div>
              <div class="row mb-4">
                <div class="col-12">
                  <GraficosComercio :estadisticas-comercio="modulos.comercio || {}" />
                </div>
              </div>
            </template>
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
            <div v-if="!modulos || modulos.abiertoAnual === undefined" class="tab-loading py-5 text-center">
              <b-spinner variant="info" label="Cargando..."></b-spinner>
              <p class="mt-2 text-muted mb-0">Cargando estadísticas de Abierto Anual...</p>
            </div>
            <template v-else>
              <div class="row mb-4">
                <div class="col-12">
                  <EstadisticasDetalladas :modulos="{ abiertoAnual: modulos.abiertoAnual }" />
                </div>
              </div>
              <div class="row mb-4">
                <div class="col-12">
                  <GraficosAbiertoAnual :estadisticas-abierto-anual="modulos.abiertoAnual || {}" />
                </div>
              </div>
            </template>
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
            <div v-if="!modulos || modulos.obras === undefined" class="tab-loading py-5 text-center">
              <b-spinner variant="success" label="Cargando..."></b-spinner>
              <p class="mt-2 text-muted mb-0">Cargando estadísticas de Obras...</p>
            </div>
            <template v-else>
              <div class="row mb-4">
                <div class="col-12">
                  <EstadisticasDetalladas :modulos="{ obras: modulos.obras }" />
                </div>
              </div>
              <div class="row mb-4">
                <div class="col-12">
                  <GraficoIndices :evolucion-indices="modulos?.indices?.evolucionTemporal || {}" />
                </div>
              </div>
            </template>
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
            <div v-if="!modulos || modulos.recaudaciones === undefined" class="tab-loading py-5 text-center">
              <b-spinner variant="warning" label="Cargando..."></b-spinner>
              <p class="mt-2 text-muted mb-0">Cargando estadísticas de Recaudaciones...</p>
            </div>
            <template v-else>
              <div class="row mb-4">
                <div class="col-12">
                  <EstadisticasDetalladas :modulos="{ recaudaciones: modulos.recaudaciones }" />
                </div>
              </div>
            </template>
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
            <div v-if="!modulos || modulos.combustible === undefined" class="tab-loading py-5 text-center">
              <b-spinner variant="danger" label="Cargando..."></b-spinner>
              <p class="mt-2 text-muted mb-0">Cargando estadísticas de Combustible...</p>
            </div>
            <template v-else>
              <div class="row mb-4">
                <div class="col-12">
                  <EstadisticasDetalladas :modulos="{ combustible: modulos.combustible }" />
                </div>
              </div>
              <div class="row mb-4">
                <div class="col-12">
                  <CombustiblePorArea :datos-combustible="modulos.combustible || {}" />
                </div>
              </div>
              <div class="row mb-4">
                <div class="col-12">
                  <EstadisticasPorPatente :datos-combustible="modulos.combustible || {}" />
                </div>
              </div>
            </template>
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
            <div v-if="!modulos || modulos.turnos === undefined" class="tab-loading py-5 text-center">
              <b-spinner variant="info" label="Cargando..."></b-spinner>
              <p class="mt-2 text-muted mb-0">Cargando estadísticas de Turnos...</p>
            </div>
            <template v-else>
              <div class="row mb-4">
                <div class="col-12">
                  <EstadisticasDetalladas :modulos="{ turnos: modulos.turnos }" />
                </div>
              </div>
            </template>
          </div>
        </b-tab>


        <!-- Pestaña Vehículos -->
        <b-tab title-link-class="tab-link-vehiculos">
          <template #title>
            <i class="bi bi-car-front-fill mr-2"></i>
            <span class="d-none d-md-inline">Vehículos</span>
            <b-badge v-if="vehiculos?.length" variant="secondary" class="ml-2">
              {{ vehiculos.length }}
            </b-badge>
          </template>

          <div class="tab-content-vehiculos">
            <!-- Lista de Vehículos por Área -->
            <div class="row">
              <div class="col-12">
                <ListaVehiculosPorArea :vehiculos="vehiculos || []" />
              </div>
            </div>
          </div>
        </b-tab>

        <!-- Pestaña Informes Solicitados -->
        <b-tab title-link-class="tab-link-informes">
          <template #title>
            <i class="bi bi-graph-up-arrow mr-2"></i>
            <span class="d-none d-md-inline">Informes Solicitados</span>
            <b-badge v-if="habilitaciones?.length" variant="warning" class="ml-2">
              <i class="bi bi-chart-line mr-1"></i>
              Gráficos
            </b-badge>
          </template>

          <div class="tab-content-informes">
            <!-- Gráfico Comparativo 2024 vs 2025 -->
            <div class="row mb-4">
              <div class="col-12">
                <GraficoComparativo2024vs2025 :habilitaciones="habilitaciones || []" />
              </div>
            </div>

            <!-- Tabla de Trámites Comerciales 2025 -->
            <div class="row mb-4">
              <div class="col-12">
                <TablaTramitesComerciales2025 :habilitaciones="habilitaciones || []" :anio="2025" />
              </div>
            </div>

            <!-- Tabla de Trámites Comerciales 2024 -->
            <div class="row mb-4">
              <div class="col-12">
                <TablaTramitesComerciales2025 :habilitaciones="habilitaciones || []" :anio="2024" />
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
import EstadisticasDetalladas from '~/components/dashboard/EstadisticasDetalladas.vue'
import GraficosComercio from '~/components/dashboard/GraficosComercio.vue'
import GraficosAbiertoAnual from '~/components/dashboard/GraficosAbiertoAnual.vue'
import GraficoIndices from '~/components/dashboard/GraficoIndices.vue'
import CombustiblePorArea from '~/components/dashboard/CombustiblePorArea.vue'
import EstadisticasPorPatente from '~/components/dashboard/EstadisticasPorPatente.vue'
import ListaVehiculosPorArea from '~/components/dashboard/ListaVehiculosPorArea.vue'
import TablaTramitesComerciales2025 from '~/components/dashboard/TablaTramitesComerciales2025.vue'
import GraficoComparativo2024vs2025 from '~/components/dashboard/GraficoComparativo2024vs2025.vue'

export default {
  name: 'DashboardTabs',
  components: {
    EstadisticasDetalladas,
    GraficosComercio,
    GraficosAbiertoAnual,
    GraficoIndices,
    CombustiblePorArea,
    EstadisticasPorPatente,
    ListaVehiculosPorArea,
    TablaTramitesComerciales2025,
    GraficoComparativo2024vs2025
  },
  props: {
    modulos: {
      type: Object,
      default: () => ({})
    },
    estadisticasUsuarios: {
      type: Object,
      default: () => ({})
    },
    vehiculos: {
      type: Array,
      default: () => []
    },
    habilitaciones: {
      type: Array,
      default: () => []
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
  background: var(--color-white);
  border-radius: 15px;
  box-shadow: 0 5px 20px var(--shadow-soft);
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
  background: var(--gray-bs-100);
  color: var(--gray-bs-600);
}

.dashboard-tabs .nav-pills .nav-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px var(--shadow-mid);
  background: var(--gray-bs-200);
}

.dashboard-tabs .nav-pills .nav-link.active {
  background: #28a745;
  color: var(--color-white);
  border-color: #28a745;
  box-shadow: 0 5px 15px var(--green-glow);
}

/* Estilos específicos por pestaña */
.tab-link-abierto-anual.active {
  background: #17a2b8 !important;
  border-color: #17a2b8 !important;
  box-shadow: 0 5px 15px var(--info-glow) !important;
}

.tab-link-obras.active {
  background: #28a745 !important;
  border-color: #28a745 !important;
  box-shadow: 0 5px 15px var(--green-glow) !important;
}

.tab-link-recaudaciones.active {
  background: #e27910 !important;
  border-color: #e27910 !important;
  box-shadow: 0 5px 15px var(--shadow-hover) !important;
}



.tab-link-turnos.active {
  background: #17a2b8 !important;
  border-color: #17a2b8 !important;
  box-shadow: 0 5px 15px var(--info-glow) !important;
}


.tab-link-informes.active {
  background: #e27910 !important;
  border-color: #e27910 !important;
  box-shadow: 0 5px 15px var(--shadow-hover) !important;
}



/* Contenido de las pestañas */
.tab-content-comercio,
.tab-content-abierto-anual,
.tab-content-obras,
.tab-content-recaudaciones,
.tab-content-combustible,
.tab-content-turnos,
.tab-content-vehiculos,
.tab-content-informes,
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

