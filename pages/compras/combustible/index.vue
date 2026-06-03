<template>
  <div v-if="!puedeVerPaginaCombustible" class="page main-background">
    <Banner title="Compras" subtitle="Combustible"/>
    <div class="col-md-8 col-sm-10 mx-auto mt-5 text-center">
      <p class="h5 text-muted mb-4">No tenés permisos para acceder al módulo de combustible.</p>
      <NuxtLink to="/compras">
        <b-button variant="primary" size="sm" class="page-btn-volver">Volver a Compras</b-button>
      </NuxtLink>
    </div>
  </div>
  <div v-else class="page main-background">
    <Banner title="Compras" subtitle="Combustible"/>

    <!-- Botones de acción: ocultos para quien solo ve el dashboard -->
    <div v-if="!soloDashboardCombustible" class="combustible-actions d-flex flex-wrap justify-content-center gap-2 mt-4 mb-2">
      <b-button variant="success" size="sm" @click="showCargarOrden = true">
        <i class="bi bi-plus-circle"></i>
        Cargar Orden de Compra
      </b-button>
      <b-button variant="primary" size="sm" @click="showCargarVehiculo = true">
        <i class="bi bi-plus-circle"></i>
        Cargar Vehículo
      </b-button>
    </div>

    <!-- Pestañas: Órdenes y Vehículos ocultas para quien solo ve dashboard (gustavociriaco) -->
    <div class="col-md-10 mx-auto mt-4">
      <b-tabs content-class="mt-0" fill class="custom-tabs">
        <!-- Pestaña Órdenes de Compra: oculta para quien solo ve dashboard -->
        <b-tab v-if="!soloDashboardCombustible" title="📋 Órdenes de Compra" active class="custom-tab">
          <b-table
            per-page="10"
            head-row-variant="success"
            class="white shadow-card"
            :items="paginatedItems"
            :fields="fields"
            :busy="loadingOrdenes"
          >
            <template #table-busy>
              <LoadingState text="Cargando..." variant="primary" />
            </template>
      <template #cell(monto)="row">
        {{ format(montoTotalOrden(row.item)) }}
      </template>
      <template #cell(area)="row">
        {{ row.item.area || '—' }}
      </template>
      <template #cell(acciones)="row">
        <b-button-group size="sm">
          <b-button
            variant="outline-secondary"
            :to="{ name: 'compras-combustible-id', params: { id: row.item.id } }"
            class="outline-secondary"
            title="Detalles"
          >
            <i class="bi bi-pen"></i>
          </b-button>


          <b-button
            v-if="row.item.observaciones && row.item.observaciones !== ''"
            @click="onShowObservaciones(row.item)"
            variant="outline-primary"
            title="Observaciones"
          >
            <i class="bi bi-eye"></i>
          </b-button>

          <b-button
            variant="outline-danger"
            title="Eliminar"
            @click="sendEliminarOrden(row.item)"
          >
            <i class="bi bi-trash"></i>
          </b-button>
        </b-button-group>
      </template>
          </b-table>

          <b-pagination class="mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>
        </b-tab>

        <!-- Pestaña Estadísticas: mismo dashboard para jefeCompras y gustavociriaco -->
        <b-tab v-if="jefeCompras || soloDashboardCombustible" title="📊 Estadísticas" :active="soloDashboardCombustible" class="custom-tab">
          <div class="dashboard-combustible">
            <!-- Estado de carga -->
            <LoadingState
              v-if="loadingEstadisticas"
              text="Cargando estadísticas de combustible..."
              size="lg"
              variant="primary"
            />

            <!-- Estado de error -->
            <b-alert
              v-else-if="errorEstadisticas"
              variant="danger"
              dismissible
              @dismissed="errorEstadisticas = null"
              class="mb-4"
            >
              <i class="bi bi-exclamation-triangle-fill mr-2"></i>
              <strong>Error:</strong> {{ errorEstadisticas }}
            </b-alert>

            <!-- Contenido del dashboard -->
            <template v-else>
              <!-- Análisis Detallado de Combustible -->
              <div class="row mb-4">
                <div class="col-12">
                  <EstadisticasDetalladas :modulos="{ combustible: datosCombustible }" :hide-compras-info="true" />
                </div>
              </div>

              <!-- Consumos por Área -->
              <div class="row mb-4">
                <div class="col-12">
                  <CombustiblePorArea :datos-combustible="datosCombustible || {}" />
                </div>
              </div>

              <!-- Consumos por Patente -->
              <div class="row mb-4">
                <div class="col-12">
                  <EstadisticasPorPatente :datos-combustible="datosCombustible || {}" :hide-compras-info="true" />
                </div>
              </div>
            </template>
          </div>
        </b-tab>

        <!-- Pestaña Vehículos: oculta para quien solo ve dashboard -->
        <b-tab v-if="!soloDashboardCombustible" title="🚗 Vehículos" class="custom-tab">
          <!-- Filtros -->
          <div class="row no-gutters filtro-section">
            <div class="col-md-3">
              <b-form-group label-class="text-dark font-weight-bold" label="Filtrar por área" label-for="filtro-area-vehiculos">
                <b-form-select
                  id="filtro-area-vehiculos"
                  v-model="filtroAreaVehiculos"
                  :options="opcionesAreasVehiculos"
                  placeholder="Todas las áreas"
                  @change="onFiltroAreaChange"
                  size="sm"
                >
                  <template #first>
                    <b-form-select-option value="">Todas las áreas</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </div>
            <div class="col-md-4 ml-3">
              <b-form-group label-class="text-dark font-weight-bold" label="Filtrar por patente" label-for="filtro-patente-vehiculos">
                <b-form-input
                  id="filtro-patente-vehiculos"
                  v-model="filtroPatenteVehiculos"
                  placeholder="Buscar por patente..."
                  size="sm"
                  @input="onFiltroPatenteChange"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-md-2 ml-3 d-flex align-items-end">
              <b-button
                variant="outline-secondary"
                size="sm"
                @click="limpiarFiltros"
                class="mb-3"
              >
                <i class="bi bi-x-circle"></i>
                Limpiar filtros
              </b-button>
            </div>
          </div>

          <b-table
            per-page="10"
            head-row-variant="primary"
            class="white shadow-card"
            :items="paginatedVehiculos"
            :fields="vehiculosFields"
            :busy="loadingVehiculos"
          >
            <template #table-busy>
              <LoadingState text="Cargando..." variant="primary" />
            </template>
            <template #cell(acciones)="row">
              <b-button-group size="sm">
                <b-button
                  variant="outline-primary"
                  title="Editar"
                  @click="editarVehiculo(row.item)"
                >
                  <i class="bi bi-pen"></i>
                </b-button>
                <b-button
                  variant="outline-danger"
                  title="Eliminar"
                  @click="sendEliminarVehiculo(row.item)"
                >
                  <i class="bi bi-trash"></i>
                </b-button>
              </b-button-group>
            </template>
          </b-table>

          <b-pagination class="mt-4" :total-rows="filteredVehiculos.length" :per-page="perPageVehiculos" v-model="currentPageVehiculos" align="center" @input="onPageChangeVehiculos"></b-pagination>
        </b-tab>
      </b-tabs>
    </div>

    <!-- Botón Volver -->
    <div class="page-btn-volver-wrap">
      <NuxtLink to="/compras">
        <b-button variant="primary" size="sm" class="page-btn-volver">Volver</b-button>
      </NuxtLink>
    </div>

    <BModal no-close-on-backdrop no-close-on-esc v-model="showCargarOrden" no-footer :header-bg-variant="'success'" centered>
      <template #header>
        <div v-if="!successMessage" class="confirmation-popup-header combustible-modal-icon">
          <i class="bi bi-circle text-light" aria-hidden="true"></i>
          <i class="bi bi-upload text-light" aria-hidden="true"></i>
        </div>
        <div v-else class="confirmation-popup-header">
          <i class="bi bi-check-circle text-light" aria-hidden="true"></i>
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h3 class="landing-text text-center" v-if="!successMessage"><b>Cargar orden de compra</b></h3><hr v-if="!successMessage"/>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="text-center">
          <p class="h5 font-weight-bold text-dark mt-2" style="font-size: 1.15rem;">La orden de compra fue cargada con éxito</p>

          <div class="modal-confirm-actions mt-4">
            <b-button variant="success" @click="cerrarPopup()">Aceptar</b-button>
          </div>
        </div>

        <div v-else>
          <div class="mx-auto">
            <!-- Número de orden de compra -->
            <div class="row mt-4 mx-1">
                <i class="bi bi-caret-right-fill"></i>
              <h6 class="text-dark font-weight-500 ml-1">Número de Orden de Compra</h6>
            </div>
            <b-form-group class="col-12 ml-2" :state="nroOrdenDuplicado ? false : null" invalid-feedback="Ya existe una orden de compra con este número.">
              <div class="numero-orden-container">
                <b-form-input size="sm" style="border-radius: 0;" type="number" class="col-7" no-wheel v-model="nroOrden1"/>
                <span>/</span>
                <b-form-input size="sm" style="border-radius: 0;" type="number" class="col-3" no-wheel v-model="nroOrden2"/>
              </div>
            </b-form-group>

            <!-- Proveedor -->
            <div class="row mt-4 mx-1">
              <i class="bi bi-caret-right-fill"></i>
              <h6 class="text-dark font-weight-500 ml-1">Proveedor</h6>
            </div>
            <b-form-group label-class="text-dark font-weight-bold" class="col-11  ml-2">
              <b-form-select style="border-radius: 0;" size="sm"
               :options="proveedores.map(p => ({value: p.nombre, text: p.nombre}))"
               v-model="orden.proveedor"/>
            </b-form-group>

            <!-- Área asignada -->
            <div class="row mt-4 mx-1">
              <i class="bi bi-caret-right-fill"></i>
              <h6 class="text-dark font-weight-500 ml-1">Área asignada</h6>
            </div>
            <b-form-group label-class="text-dark font-weight-bold" class="col-11  ml-2">
              <b-form-select style="border-radius: 0;" size="sm" :options="areas" v-model="orden.area"/>
              <!-- <b-form-input style="border-radius: 0;" size="sm" class="col-8" type="text" v-model="orden.area"/> -->
            </b-form-group>
            <!-- Combustibles -->
            <div class="row mt-4 mx-1">
              <i class="bi bi-caret-right-fill"></i>
              <h6 class="text-dark font-weight-500 ml-1">Montos asignados por tipo de combustible</h6>
            </div>
            <b-form-group class="col-12  ml-2" >
              <div v-for="(combustible, index) in orden.montos" :key="index" class="d-flex align-items-center mb-2">
                <b-form-select
                  style="border-radius: 0;"
                  size="sm"
                  class="col-5"
                  :options="tiposCombustibleProveedor"
                  v-model="combustible.tipoCombustible"
                  placeholder="Seleccione un tipo de combustible"
                />
                <h6 class="font-weight-500 text-dark ml-3 mr-1 mt-1">$ </h6>
                <b-form-input style="border-radius: 0;" size="sm" class="col-5" type="number" placeholder="Monto" no-wheel v-model="combustible.monto" />
                <b-button v-if="orden.montos.length > 1" variant="outline-danger" size="sm" class="ml-2" @click="removeCombustible(index)">
                  <i class="bi bi-trash-fill"></i>
                </b-button>
              </div>
              <b-button variant="primary" :disabled="this.orden.montos.length >= 4" size="sm" @click="addCombustible">+ Agregar combustible</b-button>
            </b-form-group>

            <hr/>

          </div>

          <div class="modal-confirm-actions">
            <b-button variant="success" :disabled="!nroOrden1 || !nroOrden2 || !orden.area || !orden.montos.length || nroOrdenDuplicado" @click="submitForm">
              Aceptar
            </b-button>
            <b-button variant="danger" @click="showCargarOrden = false">Cancelar</b-button>
          </div>
        </div>
      </div>
    </BModal>

    <BModal v-model="showEliminarOrden" no-footer header-class="justify-content-center" :header-bg-variant="'danger'" centered>
      <template #header>
        <div class="confirmation-popup-header combustible-modal-icon">
          <i class="bi bi-circle text-light" aria-hidden="true"></i>
          <i class="bi bi-trash-fill text-light" aria-hidden="true"></i>
        </div>
      </template>
      <!-- Mensaje de éxito -->
      <div v-if="eliminarSuccess" class="text-center">
          <p class="h5 font-weight-bold text-dark mt-2" style="font-size: 1.15rem;">La orden de compra fue eliminada con éxito</p>

          <div class="modal-confirm-actions mt-4">
            <b-button variant="success" @click="cerrarPopup()">Aceptar</b-button>
          </div>
        </div>
      <div v-else>
        <p class="h5 text-center mt-3 mb-2 font-weight-500 text-dark">Estás a punto de eliminar la orden de compra.</p>
        <p class="d-flex align-items-center justify-content-center mt-2 mb-2 px-3 py-2 rounded bg-light border border-warning">
          <i class="bi bi-exclamation-circle-fill"></i>
          <span class="text-dark font-weight-600" style="font-size: 0.95rem;">Se eliminarán también todos los vales asociados a esta orden.</span>
        </p>
        <p class="h6 text-center mt-2 mb-3 font-weight-500 text-dark">¿Deseás continuar?</p>
        <hr class="row col-9 mx-auto"/>
        <div class="modal-confirm-actions">
          <button type="button" class="btn btn-success" @click="sendEliminarOrden(tempElim)">Aceptar</button>
          <button type="button" class="btn btn-danger" @click="showEliminarOrden = false">Cancelar</button>
        </div>
      </div>

    </BModal>

    <!-- Modal de carga -->
    <BModal v-model="isLoading" no-footer header-bg-variant="success" title-class="text-center text-light" centered>
      <template #header>
        <div class="confirmation-popup-header mx-auto">
          <b-spinner scale="2.5" class="my-3" variant="light"/>
        </div>
      </template>
      <p class="h5 text-center font-weight-bold text-dark mt-4 mb-4">Se está borrando la orden de compra</p>
      <p class="h6 text-center font-weight-400 text-dark mt-2 mb-5">Por favor, esperá un momento</p>
    </BModal>

    <!-- Modal de carga (crear orden) -->
    <BModal v-model="loadingCargar" no-footer header-bg-variant="success" title-class="text-center text-light" centered>
      <template #header>
        <div class="confirmation-popup-header mx-auto">
          <b-spinner scale="2.5" class="my-3" variant="light"/>
        </div>
      </template>
      <p class="h5 text-center font-weight-bold text-dark mt-4 mb-4">Se está creando la orden de compra</p>
      <p class="h6 text-center font-weight-400 text-dark mt-2 mb-5">Por favor, esperá un momento</p>
    </BModal>


    <BModal size="lg" v-model="showObservaciones" header-bg-variant="primary" title="Observaciones" title-class="text-light" no-footer centered>
      <p v-html="observaciones"></p>
    </BModal>

    <!-- Modal para cargar vehículo -->
    <BModal no-close-on-backdrop no-close-on-esc v-model="showCargarVehiculo" no-footer :header-bg-variant="'primary'" centered>
      <template #header>
        <div v-if="!successMessageVehiculo" class="confirmation-popup-header combustible-modal-icon">
          <i class="bi bi-circle text-light" aria-hidden="true"></i>
          <i class="bi bi-plus text-light" aria-hidden="true"></i>
        </div>
        <div v-else class="confirmation-popup-header">
          <i class="bi bi-check-circle text-light" aria-hidden="true"></i>
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h3 class="landing-text text-center" v-if="!successMessageVehiculo"><b>Cargar vehículo</b></h3><hr v-if="!successMessageVehiculo"/>

        <!-- Mensaje de éxito -->
        <div v-if="successMessageVehiculo" class="text-center">
          <p class="h5 font-weight-bold text-dark mt-2" style="font-size: 1.15rem;">El vehículo fue cargado con éxito</p>
          <div class="modal-confirm-actions mt-4">
            <b-button variant="primary" @click="cerrarPopupVehiculo()">Aceptar</b-button>
          </div>
        </div>

        <div v-else>
          <div class="mx-auto">
             <!-- Patente -->
             <div class="row mt-4 mx-1">
               <i class="bi bi-caret-right-fill"></i>
               <h6 class="text-dark font-weight-500 ml-1">Patente del Vehículo</h6>
             </div>
             <b-form-group class="col-12 ml-2">
               <b-form-input style="border-radius: 0;" size="sm" class="col-8" type="text" v-model="vehiculo.patente" placeholder="Ej: ABC123"/>
             </b-form-group>

             <!-- Área asignada -->
             <div class="row mt-4 mx-1">
               <i class="bi bi-caret-right-fill"></i>
               <h6 class="text-dark font-weight-500 ml-1">Área asignada</h6>
             </div>
             <b-form-group label-class="text-dark font-weight-bold" class="col-11 ml-2">
               <b-form-select style="border-radius: 0;" size="sm" :options="areas" v-model="vehiculo.area"/>
             </b-form-group>

            <hr/>
          </div>

          <div class="modal-confirm-actions">
            <b-button variant="primary" :disabled="!vehiculo.patente || !vehiculo.area" @click="submitFormVehiculo">
              Aceptar
            </b-button>
            <b-button variant="danger" @click="showCargarVehiculo = false">Cancelar</b-button>
          </div>
        </div>
      </div>
    </BModal>

    <!-- Modal de carga para vehículos -->
    <BModal v-model="loadingCargarVehiculo" no-footer header-bg-variant="primary" title-class="text-center text-light" centered>
      <template #header>
        <div class="confirmation-popup-header mx-auto">
          <b-spinner scale="2.5" class="my-3" variant="light"/>
        </div>
      </template>
      <p class="h5 text-center font-weight-bold text-dark mt-4 mb-4">Se está creando el vehículo</p>
      <p class="h6 text-center font-weight-400 text-dark mt-2 mb-5">Por favor, esperá un momento</p>
    </BModal>

    <!-- Modal para eliminar vehículo -->
    <BModal v-model="showEliminarVehiculo" no-footer header-class="justify-content-center" :header-bg-variant="'danger'" centered>
      <template #header>
        <div class="confirmation-popup-header combustible-modal-icon">
          <i class="bi bi-circle text-light" aria-hidden="true"></i>
          <i class="bi bi-trash-fill text-light" aria-hidden="true"></i>
        </div>
      </template>
      <!-- Mensaje de éxito -->
      <div v-if="eliminarSuccessVehiculo" class="text-center">
          <p class="h5 font-weight-bold text-dark mt-2" style="font-size: 1.15rem;">El vehículo fue eliminado con éxito</p>
          <div class="modal-confirm-actions mt-4">
            <b-button variant="success" @click="cerrarPopupVehiculo()">Aceptar</b-button>
          </div>
        </div>
      <div v-else>
        <p class="h5 text-center mt-3 mb-4 font-weight-500 text-dark">Estás a punto de eliminar el vehículo.</p>
        <p class="h6 text-center mt-2 mb-3 font-weight-500 text-dark">¿Deseás continuar?</p>
        <hr class="row col-9 mx-auto"/>
        <div class="modal-confirm-actions">
          <button type="button" class="btn btn-success" @click="sendEliminarVehiculo(tempElimVehiculo)">Aceptar</button>
          <button type="button" class="btn btn-danger" @click="showEliminarVehiculo = false">Cancelar</button>
        </div>
      </div>
    </BModal>

    <!-- Modal para editar vehículo -->
    <BModal v-model="showEditarVehiculo" no-footer header-class="justify-content-center" :header-bg-variant="'primary'" centered>
      <template #header>
        <div class="confirmation-popup-header combustible-modal-icon">
          <i class="bi bi-circle text-light" aria-hidden="true"></i>
          <i class="bi bi-pencil-fill text-light" aria-hidden="true"></i>
        </div>
      </template>
      <div class="text-center">
        <h4 class="text-center mt-3 mb-4 font-weight-bold text-dark">Editar Vehículo</h4>

        <b-form @submit.prevent="actualizarVehiculo">
          <b-form-group label="Patente" label-for="patente-edit">
            <b-form-input
              id="patente-edit"
              v-model="vehiculoEdit.patente"
              type="text"
              placeholder="Ingresá la patente"
              required
              :state="patenteEditState"
            ></b-form-input>
            <b-form-invalid-feedback v-if="patenteEditState === false">
              La patente es requerida
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="Área" label-for="area-edit">
            <b-form-select
              id="area-edit"
              v-model="vehiculoEdit.area"
              :options="opcionesAreasVehiculos"
              placeholder="Seleccioná el área"
              required
              :state="areaEditState"
            >
              <template #first>
                <b-form-select-option :value="null">Seleccioná el área</b-form-select-option>
              </template>
            </b-form-select>
            <b-form-invalid-feedback v-if="areaEditState === false">
              El área es requerida
            </b-form-invalid-feedback>
          </b-form-group>

          <hr class="row col-9 mx-auto"/>
          <div class="modal-confirm-actions">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loadingEditarVehiculo"
            >
              <b-spinner v-if="loadingEditarVehiculo" small class="mr-2"></b-spinner>
              {{ loadingEditarVehiculo ? 'Actualizando...' : 'Actualizar' }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="cerrarModalEditar"
              :disabled="loadingEditarVehiculo"
            >
              Cancelar
            </button>
          </div>
        </b-form>
      </div>
    </BModal>

  </div>
</template>

<script>
import areas from '~/constants/areas.js'
import EstadisticasDetalladas from '~/components/dashboard/EstadisticasDetalladas.vue'
import CombustiblePorArea from '~/components/dashboard/CombustiblePorArea.vue'
import EstadisticasPorPatente from '~/components/dashboard/EstadisticasPorPatente.vue'

export default {
  setup(){ const { showToast } = useProjectToast(); return { showToast } },
  components: {
    EstadisticasDetalladas,
    CombustiblePorArea,
    EstadisticasPorPatente
  },
  data() {
    return {
      areas: areas, // Agregar las áreas importadas
      inputNroOrden: "",
      nroOrden1: '', // Número de orden parte 1
      nroOrden2: '', // Número de orden parte 2
      showCargarOrden: false,
      isLoading: false,
      loadingCargar: false,
      successMessage: false,
      eliminarSuccess: false,
      observaciones: '',
      showObservaciones: false,
      showEliminarOrden: false,
      tempElim: '',
      orden: {
        nroOrden: "",
        area: "",
        proveedor: '',
        montos: [{ tipoCombustible: "", monto: 0 }],
      },
      items: [],
      currentPage: 1,
      perPage: 10,
      fields: [
        { key: 'nroOrden', label: 'Nro. orden' },
        { key: 'monto', label: 'Importe' },
        { key: 'vales', label: 'Vales' },
        { key: 'area', label: 'Área asignada' },
        { key: 'acciones', label: 'Acciones'},
      ],
      // Datos para vehículos
      vehiculos: [],
      currentPageVehiculos: 1,
      perPageVehiculos: 10,
      showCargarVehiculo: false,
      filtroAreaVehiculos: '', // Filtro por área para vehículos
      filtroPatenteVehiculos: '', // Filtro por patente para vehículos
      successMessageVehiculo: false,
      loadingCargarVehiculo: false,
      showEliminarVehiculo: false,
      eliminarSuccessVehiculo: false,
      tempElimVehiculo: '',
      vehiculo: {
        patente: '',
        area: ''
      },
      // Variables para editar vehículo
      showEditarVehiculo: false,
      loadingEditarVehiculo: false,
      vehiculoEdit: {
        id: null,
        patente: '',
        area: '',
        areaOriginal: '' // Para guardar el área original antes de editar
      },
      vehiculosFields: [
        { key: 'patente', label: 'Patente', sortable: true },
        { key: 'area', label: 'Área Asignada', sortable: true },
        { key: 'acciones', label: 'Acciones', sortable: false },
      ],
      // areas: ahora se obtiene del plugin $areas
      loadingOrdenes: true,
      loadingVehiculos: true,
      loadingEstadisticas: false,
      errorEstadisticas: null
    };
  },
  async mounted() {
    await this.loadCombustiblePage()
  },
  computed: {
    adminCompras(){
      const admin = useUserStore().admin
      return admin === "compras" || admin === "master"
    },
    /** Puede entrar a la página combustible: admin compras o usuario con solo dashboard. */
    puedeVerPaginaCombustible() {
      return this.adminCompras || useUserStore().username === "gustavociriaco@gesell.gob.ar"
    },
    /** Solo ve el dashboard de combustible (sin órdenes ni vehículos). */
    soloDashboardCombustible() {
      return useUserStore().username === "gustavociriaco@gesell.gob.ar"
    },
    /** Solo martinjordan@gesell.gob.ar (o master) puede ver la pestaña Estadísticas dentro de la vista completa. */
    jefeCompras() {
      const userStore = useUserStore()
      return (userStore.admin === "compras" && userStore.username === "martinjordan@gesell.gob.ar") || userStore.admin === "master"
    },
    ordenesCompra() {
      return useCombustibleStore().all;
    },
    proveedores() {
      return useCombustibleStore().proveedores;
    },
    tiposCombustibleProveedor() {
      const proveedores = Array.isArray(this.proveedores) ? this.proveedores : []
      const proveedorSeleccionado = proveedores.find(p => p.nombre === this.orden.proveedor)
      const tipos = proveedorSeleccionado?.tiposCombustible
      return Array.isArray(tipos)
        ? tipos.map(tipo => ({ value: tipo, text: tipo }))
        : []
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredItems.slice(start, end);
    },
    filteredItems() {
      let items = this.items;

      if (this.inputNroOrden) {
        items = items.filter(item => item.nroOrden && String(item.nroOrden).includes(this.inputNroOrden));
      }

      return items;
    },
    paginatedVehiculos() {
      const start = (this.currentPageVehiculos - 1) * this.perPageVehiculos;
      const end = start + this.perPageVehiculos;
      return this.filteredVehiculos.slice(start, end);
    },
    filteredVehiculos() {
      let filtered = this.vehiculos;

      // Filtrar por área
      if (this.filtroAreaVehiculos) {
        filtered = filtered.filter(vehiculo =>
          vehiculo.area.toLowerCase().includes(this.filtroAreaVehiculos.toLowerCase())
        );
      }

      // Filtrar por patente
      if (this.filtroPatenteVehiculos) {
        filtered = filtered.filter(vehiculo =>
          vehiculo.patente.toLowerCase().includes(this.filtroPatenteVehiculos.toLowerCase())
        );
      }

      return filtered;
    },
    opcionesAreasVehiculos() {
      const list = Array.isArray(this.areas) ? this.areas : []
      return list.map(area => ({
        value: area,
        text: area,
      }))
    },
    // Validaciones para editar vehículo
    patenteEditState() {
      return this.vehiculoEdit.patente.length > 0 ? null : false;
    },
    areaEditState() {
      return this.vehiculoEdit.area && this.vehiculoEdit.area.length > 0 ? null : false;
    },
    /** true si el número de orden ya existe en la lista (no se puede crear). */
    nroOrdenDuplicado() {
      if (!this.nroOrden1 || !this.nroOrden2) return false;
      const nro = `${String(this.nroOrden1).trim()}/${String(this.nroOrden2).trim()}`;
      return this.items.some(item => item.nroOrden && String(item.nroOrden).trim() === nro);
    },
    // Computed property para obtener datos de combustible desde el store
    datosCombustible() {
      const datos = useEstadisticasStore().estadisticasModulos?.combustible
      return datos && typeof datos === 'object' && Object.keys(datos).length > 0 ? datos : null
    }
  },
  methods: {
    async loadCombustiblePage() {
      const soloDashboard = useUserStore().username === 'gustavociriaco@gesell.gob.ar'

      if (!soloDashboard) {
        this.loadingOrdenes = true
        this.loadingVehiculos = true
        try {
          await useCombustibleStore().getOrdenesCompra()
          this.items = this.ordenesCompra
          await useCombustibleStore().getProveedores()
        } catch (error) {
          console.error('Error al cargar órdenes de compra:', error)
          this.items = []
        } finally {
          this.loadingOrdenes = false
        }

        try {
          await useVehiculosStore().getAll()
          this.vehiculos = useVehiculosStore().all || []
        } catch (error) {
          console.error('Error al cargar vehículos:', error)
          this.vehiculos = []
        } finally {
          this.loadingVehiculos = false
        }
      } else {
        this.loadingOrdenes = false
        this.loadingVehiculos = false
      }

      const userStore = useUserStore()
      const puedeVerDashboard = userStore && (
        (userStore.admin === 'compras' && userStore.username === 'martinjordan@gesell.gob.ar') ||
        userStore.admin === 'master' ||
        userStore.username === 'gustavociriaco@gesell.gob.ar'
      )
      if (puedeVerDashboard) {
        try {
          this.loadingEstadisticas = true
          this.errorEstadisticas = null
          const startDate = new Date(2026, 0, 1)
          startDate.setHours(0, 0, 0, 0)
          const endDate = new Date()
          endDate.setHours(23, 59, 59, 999)
          await useEstadisticasStore().fetchEstadisticasCombustible({ startDate, endDate })
        } catch (error) {
          console.error('Error al cargar estadísticas de combustible:', error)
          this.errorEstadisticas = 'Error al cargar las estadísticas. Por favor, intenta recargar la página.'
        } finally {
          this.loadingEstadisticas = false
        }
      }
    },
    montoTotalOrden(item) {
      const montos = Array.isArray(item?.montos) ? item.montos : []
      return montos.reduce((acc, combustible) => acc + (Number(combustible?.monto) || 0), 0)
    },
    onPageChange(newPage) {
      this.currentPage = newPage;
    },
    cerrarPopup(){
      this.showCargarOrden = false;  // Cerrar modal
      this.successMessage = false,
      this.eliminarSuccess = false,
      this.showEliminarOrden = false,
      location.reload();  // Refrescar página
    },
    onShowObservaciones(item){
      if(item.observaciones){
        this.observaciones = item.observaciones.split('**').join('<br>').split(',').join('')
      }else{
        this.observaciones = "No hay observaciones para mostrar."
      }
      this.showObservaciones = true
    },
    addCombustible() {
      this.orden.montos.push({ tipoCombustible: "", monto: 0 });
    },
    removeCombustible(index) {
      if (this.orden.montos.length > 1) {
        this.orden.montos.splice(index, 1);
      }
    },
    async submitForm() {
      if (this.nroOrdenDuplicado) {
        this.showToast("Ya existe una orden de compra con ese número.", { variant: "warning" });
        return;
      }
      this.loadingCargar = true;
      try {
        // Concatenar nroOrden1 y nroOrden2 para formar nroOrden
        const nroOrden = `${this.nroOrden1}/${this.nroOrden2}`;

        await useCombustibleStore().create({
          orden: {
            nroOrden: nroOrden,
            proveedor: this.orden.proveedor,
            area: this.orden.area,
            montos: this.orden.montos.filter(m => m.tipoCombustible && m.monto > 0) // Evitar enviar montos vacíos
          },
        });

        // Registrar actividad de creación de orden de compra
        await this.$logUserActivity(
          useUserStore().username,
          'Crear Orden de Compra',
          `Orden de compra ${nroOrden} creada para el área ${this.orden.area}`
        );

        // Mostrar mensaje de éxito
        // this.showCargarOrden = false
        this.successMessage = true

      } catch (error) {
        this.showToast("Error al crear la orden", { variant: "danger" });
      } finally {
        this.loadingCargar = false;
      }
    },
    resetForm() {
      this.successMessage = false;
      this.orden = {
        nroOrden: "",
        area: "",
        montoSuper: null,
        montoVPower: null,
      };
    },
    sendEliminarOrden(item){
      if(!this.showEliminarOrden){
        this.showEliminarOrden = true
        this.tempElim = item
      }
      else{
        this.eliminarOrden(item)
      }
    },
    async eliminarOrden(item){
      this.isLoading = true
      this.showEliminarOrden = false
      const id = item.id
      const userToken = useUserStore().token
      const success = await useCombustibleStore().eliminarOrden({
        id,
        userToken
      })
      if(success){
        this.isLoading = false
        this.eliminarSuccess = true
        this.showEliminarOrden = true
      }
    },
    format(value) {
      if (!value) return "$0";
      return `$${value.toLocaleString('es-AR')}`;
    },
    // Métodos para vehículos
    onPageChangeVehiculos(newPage) {
      this.currentPageVehiculos = newPage;
    },
    onFiltroAreaChange() {
      // Resetear a la primera página cuando cambia el filtro
      this.currentPageVehiculos = 1;
    },
    onFiltroPatenteChange() {
      // Resetear a la primera página cuando cambia el filtro
      this.currentPageVehiculos = 1;
    },
    limpiarFiltros() {
      this.filtroAreaVehiculos = '';
      this.filtroPatenteVehiculos = '';
      this.currentPageVehiculos = 1;
    },
    cerrarPopupVehiculo() {
      this.showCargarVehiculo = false;
      this.successMessageVehiculo = false;
      this.eliminarSuccessVehiculo = false;
      this.showEliminarVehiculo = false;
      this.resetFormVehiculo();
      // Recargar vehículos
      useVehiculosStore().getAll().then(() => {
        this.vehiculos = useVehiculosStore().all || [];
      }).catch(() => {
        this.vehiculos = [];
      });
    },
    resetFormVehiculo() {
      this.vehiculo = {
        patente: '',
        area: ''
      };
    },
    async submitFormVehiculo() {
      this.loadingCargarVehiculo = true;
      try {
        const userToken = useUserStore().token;

        await useVehiculosStore().create({
          vehiculo: this.vehiculo,
          userToken
        });

        this.successMessageVehiculo = true;
      } catch (error) {
        this.showToast("Error al crear el vehículo", { variant: "danger" });
      } finally {
        this.loadingCargarVehiculo = false;
      }
    },
    sendEliminarVehiculo(item) {
      if (!this.showEliminarVehiculo) {
        this.showEliminarVehiculo = true;
        this.tempElimVehiculo = item;
      } else {
        this.eliminarVehiculo(item);
      }
    },
    async eliminarVehiculo(item) {
      this.isLoading = true;
      this.showEliminarVehiculo = false;
      const id = item.id;
      const userToken = useUserStore().token;

      const success = await useVehiculosStore().delete({
        id,
        userToken
      });

      if (success) {
        this.isLoading = false;
        this.eliminarSuccessVehiculo = true;
        this.showEliminarVehiculo = true;
      }
    },
    // Métodos para editar vehículo
    editarVehiculo(vehiculo) {
      this.vehiculoEdit = {
        id: vehiculo.id,
        patente: vehiculo.patente,
        area: vehiculo.area,
        areaOriginal: vehiculo.area // Guardar el área original
      };
      this.showEditarVehiculo = true;
    },
    cerrarModalEditar() {
      this.showEditarVehiculo = false;
      this.loadingEditarVehiculo = false;
      this.vehiculoEdit = {
        id: null,
        patente: '',
        area: '',
        areaOriginal: ''
      };
    },
    async actualizarVehiculo() {
      // Validar campos
      if (!this.vehiculoEdit.patente || !this.vehiculoEdit.area) {
        return;
      }

      this.loadingEditarVehiculo = true;

      try {
        const userToken = useUserStore().token;

        const vehiculoData = {
          patente: this.vehiculoEdit.patente,
          area: this.vehiculoEdit.area
        };

        await useVehiculosStore().update({
          id: this.vehiculoEdit.id,
          vehiculo: vehiculoData,
          userToken
        });

        // Registrar actividad de modificación de vehículo
        // Verificar si el área cambió para registrar específicamente el cambio de área
        if (this.vehiculoEdit.areaOriginal !== this.vehiculoEdit.area) {
          await this.$logUserActivity(
            useUserStore().username,
            'Modificar Vehículo - Cambio de Área',
            `Vehículo ${this.vehiculoEdit.patente}: área cambiada de ${this.vehiculoEdit.areaOriginal} a ${this.vehiculoEdit.area}`
          );
        } else {
          await this.$logUserActivity(
            useUserStore().username,
            'Modificar Vehículo',
            `Vehículo ${this.vehiculoEdit.patente} actualizado en el área ${this.vehiculoEdit.area}`
          );
        }

        // Cerrar modal y mostrar mensaje de éxito
        this.cerrarModalEditar();
        this.showToast('Vehículo actualizado correctamente', {
          title: 'Éxito',
          variant: 'success',
          solid: true
        });

        // Recargar vehículos
        await useVehiculosStore().getAll();
        this.vehiculos = useVehiculosStore().all || [];

      } catch (error) {
        console.error('Error al actualizar vehículo:', error);
        this.showToast('Error al actualizar el vehículo', {
          title: 'Error',
          variant: 'danger',
          solid: true
        });
      } finally {
        this.loadingEditarVehiculo = false;
      }
    }
  }
};
</script>

<style scoped>
/* Solo estilos que realmente se usan y funcionan */
.confirmation-popup-body {
  padding: 1.5rem;
}


/* Sección de filtros con color personalizado */
.filtro-section {
  background: #b4c0f3 !important; /* Azul claro suave */
  padding: 1rem 0.5rem 1rem 1rem !important;
  border-radius: 3px !important;
  border: 1px solid #c3cae5 !important;
  box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
}

/* Estilos para el dashboard de combustible */
.dashboard-combustible {
  padding: 1rem 0;
}

.combustible-actions .btn {
  width: auto;
  flex: 0 0 auto;
}
</style>
