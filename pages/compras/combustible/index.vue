<template>
  <div v-if="adminCompras" class="page main-background">
    <Banner title="Compras" subtitle="Combustible"/>

    <!-- Botones de acción -->
    <div class="row no-gutters justify-content-center mt-4">
      <b-button variant="success" class="text-center mx-3" @click="showCargarOrden = true">
        <b-icon-plus-circle class="mr-2"></b-icon-plus-circle>
        Cargar Orden de Compra
      </b-button>
      <b-button variant="primary" class="text-center mx-3" @click="showCargarVehiculo = true">
        <b-icon-plus-circle class="mr-2"></b-icon-plus-circle>
        Cargar Vehículo
      </b-button>
    </div>

    <!-- Pestañas justo encima de las tablas -->
    <div class="col-md-10 mx-auto mt-4">
      <b-tabs content-class="mt-0" fill class="custom-tabs">
        <!-- Pestaña Órdenes de Compra -->
        <b-tab title="📋 Órdenes de Compra" active class="custom-tab">
          <b-table per-page="10" head-row-variant="success" class="white shadow-card" :items="paginatedItems" :fields="fields">
      <template #cell(monto)="row">
        {{ format(row.item.montos.reduce((acc, combustible) => acc + combustible.monto, 0)) }}
      </template>
      <template #cell(saldoRestante)="row">
        {{ format(row.item.saldos.reduce((acc, saldo) => acc + saldo.saldo, 0)) }}
      </template>
      <template #cell(acciones)="row">
        <b-button-group size="sm">
          <b-button
            variant="outline-secondary"
            :to="{ name: 'compras-combustible-id', params: { id: row.item.id } }"
            class="outline-secondary"
            title="Detalles"
          >
            <b-icon-pen class="icon-hover" />
          </b-button>


          <b-button
            v-if="row.item.observaciones && row.item.observaciones !== ''"
            @click="onShowObservaciones(row.item)"
            variant="outline-primary"
            title="Observaciones"
          >
            <b-icon-eye />
          </b-button>

          <b-button
            variant="outline-danger"
            title="Eliminar"
            @click="sendEliminarOrden(row.item)"
          >
            <b-icon-trash />
          </b-button>
        </b-button-group>
      </template>
          </b-table>

          <b-pagination class="mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>
        </b-tab>

        <!-- Pestaña Vehículos -->
        <b-tab title="🚗 Vehículos" class="custom-tab">
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
                <b-icon-x-circle class="mr-1" />
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
              <div class="text-center text-primary my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong> Cargando vehículos...</strong>
              </div>
            </template>
            <template #cell(acciones)="row">
              <b-button-group size="sm">
                <b-button
                  variant="outline-primary"
                  title="Editar"
                  @click="editarVehiculo(row.item)"
                >
                  <b-icon-pen class="icon-hover" />
                </b-button>
                <b-button
                  variant="outline-danger"
                  title="Eliminar"
                  @click="sendEliminarVehiculo(row.item)"
                >
                  <b-icon-trash />
                </b-button>
              </b-button-group>
            </template>
          </b-table>

          <b-pagination class="mt-4" :total-rows="filteredVehiculos.length" :per-page="perPageVehiculos" v-model="currentPageVehiculos" align="center" @input="onPageChangeVehiculos"></b-pagination>
        </b-tab>
      </b-tabs>
    </div>

    <!-- Botón Volver -->
    <div class="text-center mb-3 mt-4">
      <NuxtLink to="/compras">
        <b-button variant="primary">Volver</b-button>
      </NuxtLink>
    </div>

    <b-modal no-close-on-backdrop no-close-on-esc v-model="showCargarOrden" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-iconstack v-if="!successMessage" class="my-3">
            <b-icon-circle scale="2.7" variant="light"/>
            <b-icon-upload scale="1.5" variant="light" />
          </b-iconstack>
          <b-iconstack class="my-3" v-else>
            <b-icon-check-circle scale="2.5" variant="light"/>
          </b-iconstack>
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h3 class="landing-text text-center" v-if="!successMessage"><b>Cargar orden de compra</b></h3><hr v-if="!successMessage"/>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="text-center">
          <p class="h5 font-weight-bold text-dark mt-2" style="font-size: 1.15rem;">La orden de compra fue cargada con éxito</p>

          <!-- Botón de aceptar -->
          <div class="text-center mt-5">
            <b-btn style="border-radius: 0;" variant="success" @click="cerrarPopup()">
              Aceptar
            </b-btn>
          </div>
        </div>

        <div v-else>
          <div class="mx-auto">
            <!-- Número de orden de compra -->
            <div class="row mt-4 mx-1">
                <b-icon-caret-right-fill class="icon-orange ml-0"/>
              <h6 class="text-dark font-weight-500 ml-1">Número de Orden de Compra</h6>
            </div>
            <b-form-group class="col-12 ml-2">
              <div class="numero-orden-container">
                <b-form-input size="sm" style="border-radius: 0;" type="number" class="col-7" no-wheel v-model="nroOrden1"/>
                <span>/</span>
                <b-form-input size="sm" style="border-radius: 0;" type="number" class="col-3" no-wheel v-model="nroOrden2"/>
              </div>

            </b-form-group>

            <!-- Proveedor -->
            <div class="row mt-4 mx-1">
              <b-icon-caret-right-fill class="icon-orange ml-0"/>
              <h6 class="text-dark font-weight-500 ml-1">Proveedor</h6>
            </div>
            <b-form-group label-class="text-dark font-weight-bold" class="col-11  ml-2">
              <b-form-select style="border-radius: 0;" size="sm"
               :options="proveedores.map(p => ({value: p.nombre, text: p.nombre}))"
               v-model="orden.proveedor"/>
            </b-form-group>

            <!-- Área asignada -->
            <div class="row mt-4 mx-1">
              <b-icon-caret-right-fill class="icon-orange ml-0"/>
              <h6 class="text-dark font-weight-500 ml-1">Área asignada</h6>
            </div>
            <b-form-group label-class="text-dark font-weight-bold" class="col-11  ml-2">
              <b-form-select style="border-radius: 0;" size="sm" :options="areas" v-model="orden.area"/>
              <!-- <b-form-input style="border-radius: 0;" size="sm" class="col-8" type="text" v-model="orden.area"/> -->
            </b-form-group>
            <!-- Combustibles -->
            <div class="row mt-4 mx-1">
              <b-icon-caret-right-fill class="icon-orange ml-0"/>
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
                  <b-icon-trash-fill/>
                </b-button>
              </div>
              <b-button variant="primary" :disabled="this.orden.montos.length >= 4" size="sm" @click="addCombustible">+ Agregar combustible</b-button>
            </b-form-group>

            <hr/>

          </div>

          <div class="row justify-content-end">
            <!-- Botón de aceptar -->
            <div class="text-center mt-3 mx-2">
              <b-btn variant="success" :disabled="!nroOrden1 || !nroOrden2 || !orden.area || !orden.montos.length" @click="submitForm">
                Aceptar
              </b-btn>
            </div>
            <!-- Botón de salir -->
            <div class="text-center mt-3 mx-2">
              <b-btn variant="danger" @click="showCargarOrden=false">
                Cancelar
              </b-btn>
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="showEliminarOrden" hide-footer header-class="justify-content-center" :header-bg-variant="'danger'" centered>
      <template #modal-header>
        <b-iconstack class="my-3">
          <b-icon-circle scale="2.7" variant="light"/>
          <b-icon-trash-fill scale="1.5" variant="light" />
        </b-iconstack>
      </template>
      <!-- Mensaje de éxito -->
      <div v-if="eliminarSuccess" class="text-center">
          <p class="h5 font-weight-bold text-dark mt-2" style="font-size: 1.15rem;">La orden de compra fue eliminada con éxito</p>

          <!-- Botón de aceptar -->
          <div class="text-center mt-5">
            <b-btn style="border-radius: 0;" variant="success" @click="cerrarPopup()">
              Aceptar
            </b-btn>
          </div>
        </div>
      <div v-else>
        <p class="h5 text-center mt-3 mb-4 font-weight-500 text-dark">Estás a punto de eliminar la orden de compra.</p>
        <p class="h6 text-center mt-2 mb-3 font-weight-500 text-dark">¿Deseás continuar?</p>
        <hr class="row col-9 mx-auto"/>
        <div class="row no-gutters justify-content-center">
          <button class="btn btn-success mx-2" @click="sendEliminarOrden(tempElim)">Aceptar</button>
          <button class="btn btn-danger mx-2" @click="showEliminarOrden = false">Cancelar</button>
        </div>
      </div>

    </b-modal>

    <!-- Modal de carga -->
    <b-modal v-model="isLoading" hide-footer header-bg-variant="success" title-class="text-center text-light" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-spinner scale="2.5" class="my-3" variant="light"/>
        </div>
      </template>
      <p class="h5 text-center font-weight-bold text-dark mt-4 mb-4">Se está borrando la orden de compra</p>
      <p class="h6 text-center font-weight-400 text-dark mt-2 mb-5">Por favor, esperá un momento</p>
    </b-modal>

    <!-- Modal de carga (crear orden) -->
    <b-modal v-model="loadingCargar" hide-footer header-bg-variant="success" title-class="text-center text-light" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-spinner scale="2.5" class="my-3" variant="light"/>
        </div>
      </template>
      <p class="h5 text-center font-weight-bold text-dark mt-4 mb-4">Se está creando la orden de compra</p>
      <p class="h6 text-center font-weight-400 text-dark mt-2 mb-5">Por favor, esperá un momento</p>
    </b-modal>


    <b-modal size="lg" v-model="showObservaciones" header-bg-variant="primary" title="Observaciones" title-class="text-light" hide-footer centered>
      <p v-html="observaciones"></p>
    </b-modal>

    <!-- Modal para cargar vehículo -->
    <b-modal no-close-on-backdrop no-close-on-esc v-model="showCargarVehiculo" hide-footer :header-bg-variant="'primary'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-iconstack v-if="!successMessageVehiculo" class="my-3">
            <b-icon-circle scale="2.7" variant="light"/>
            <b-icon-plus scale="1.5" variant="light" />
          </b-iconstack>
          <b-iconstack class="my-3" v-else>
            <b-icon-check-circle scale="2.5" variant="light"/>
          </b-iconstack>
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h3 class="landing-text text-center" v-if="!successMessageVehiculo"><b>Cargar vehículo</b></h3><hr v-if="!successMessageVehiculo"/>

        <!-- Mensaje de éxito -->
        <div v-if="successMessageVehiculo" class="text-center">
          <p class="h5 font-weight-bold text-dark mt-2" style="font-size: 1.15rem;">El vehículo fue cargado con éxito</p>
          <div class="text-center mt-5">
            <b-btn style="border-radius: 0;" variant="primary" @click="cerrarPopupVehiculo()">
              Aceptar
            </b-btn>
          </div>
        </div>

        <div v-else>
          <div class="mx-auto">
             <!-- Patente -->
             <div class="row mt-4 mx-1">
               <b-icon-caret-right-fill class="icon-orange ml-0"/>
               <h6 class="text-dark font-weight-500 ml-1">Patente del Vehículo</h6>
             </div>
             <b-form-group class="col-12 ml-2">
               <b-form-input style="border-radius: 0;" size="sm" class="col-8" type="text" v-model="vehiculo.patente" placeholder="Ej: ABC123"/>
             </b-form-group>

             <!-- Área asignada -->
             <div class="row mt-4 mx-1">
               <b-icon-caret-right-fill class="icon-orange ml-0"/>
               <h6 class="text-dark font-weight-500 ml-1">Área asignada</h6>
             </div>
             <b-form-group label-class="text-dark font-weight-bold" class="col-11 ml-2">
               <b-form-select style="border-radius: 0;" size="sm" :options="areas" v-model="vehiculo.area"/>
             </b-form-group>

            <hr/>
          </div>

          <div class="row justify-content-end">
             <div class="text-center mt-3 mx-2">
               <b-btn variant="primary" :disabled="!vehiculo.patente || !vehiculo.area" @click="submitFormVehiculo">
                 Aceptar
               </b-btn>
             </div>
            <div class="text-center mt-3 mx-2">
              <b-btn variant="danger" @click="showCargarVehiculo=false">
                Cancelar
              </b-btn>
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <!-- Modal de carga para vehículos -->
    <b-modal v-model="loadingCargarVehiculo" hide-footer header-bg-variant="primary" title-class="text-center text-light" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-spinner scale="2.5" class="my-3" variant="light"/>
        </div>
      </template>
      <p class="h5 text-center font-weight-bold text-dark mt-4 mb-4">Se está creando el vehículo</p>
      <p class="h6 text-center font-weight-400 text-dark mt-2 mb-5">Por favor, esperá un momento</p>
    </b-modal>

    <!-- Modal para eliminar vehículo -->
    <b-modal v-model="showEliminarVehiculo" hide-footer header-class="justify-content-center" :header-bg-variant="'danger'" centered>
      <template #modal-header>
        <b-iconstack class="my-3">
          <b-icon-circle scale="2.7" variant="light"/>
          <b-icon-trash-fill scale="1.5" variant="light" />
        </b-iconstack>
      </template>
      <!-- Mensaje de éxito -->
      <div v-if="eliminarSuccessVehiculo" class="text-center">
          <p class="h5 font-weight-bold text-dark mt-2" style="font-size: 1.15rem;">El vehículo fue eliminado con éxito</p>
          <div class="text-center mt-5">
            <b-btn style="border-radius: 0;" variant="success" @click="cerrarPopupVehiculo()">
              Aceptar
            </b-btn>
          </div>
        </div>
      <div v-else>
        <p class="h5 text-center mt-3 mb-4 font-weight-500 text-dark">Estás a punto de eliminar el vehículo.</p>
        <p class="h6 text-center mt-2 mb-3 font-weight-500 text-dark">¿Deseás continuar?</p>
        <hr class="row col-9 mx-auto"/>
        <div class="row no-gutters justify-content-center">
          <button class="btn btn-success mx-2" @click="sendEliminarVehiculo(tempElimVehiculo)">Aceptar</button>
          <button class="btn btn-danger mx-2" @click="showEliminarVehiculo = false">Cancelar</button>
        </div>
      </div>
    </b-modal>

    <!-- Modal para editar vehículo -->
    <b-modal v-model="showEditarVehiculo" hide-footer header-class="justify-content-center" :header-bg-variant="'primary'" centered>
      <template #modal-header>
        <b-iconstack class="my-3">
          <b-icon-circle scale="2.7" variant="light"/>
          <b-icon-pencil-fill scale="1.5" variant="light" />
        </b-iconstack>
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
          <div class="row no-gutters justify-content-center">
            <button
              type="submit"
              class="btn btn-primary mx-2"
              :disabled="loadingEditarVehiculo"
            >
              <b-spinner v-if="loadingEditarVehiculo" small class="mr-2"></b-spinner>
              {{ loadingEditarVehiculo ? 'Actualizando...' : 'Actualizar' }}
            </button>
            <button
              type="button"
              class="btn btn-secondary mx-2"
              @click="cerrarModalEditar"
              :disabled="loadingEditarVehiculo"
            >
              Cancelar
            </button>
          </div>
        </b-form>
      </div>
    </b-modal>

  </div>
</template>

<script>
import areas from "@/plugins/areas.js";

export default {
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
        { key: 'saldoRestante', label: 'Saldo' },
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
    };
  },
  async fetch() {
    await this.$store.dispatch('combustible/getOrdenesCompra')
    this.items = this.ordenesCompra
    await this.$store.dispatch('combustible/getProveedores')

    // Cargar vehículos
    try {
      await this.$store.dispatch('vehiculos/getAll')
      this.vehiculos = this.$store.state.vehiculos ? this.$store.state.vehiculos.all : []
    } catch (error) {
      console.error('Error al cargar vehículos:', error)
      this.vehiculos = []
    }
  },
  computed: {
    adminCompras(){
      return this.$store.state.user.admin === "compras" || this.$store.state.user.admin === "master"
    },
    ordenesCompra() {
      return this.$store.state.combustible.all;
    },
    proveedores() {
      return this.$store.state.combustible.proveedores;
    },
    tiposCombustibleProveedor() {
      const proveedorSeleccionado = this.proveedores.find(p => p.nombre === this.orden.proveedor);
      return proveedorSeleccionado
        ? proveedorSeleccionado.tiposCombustible.map(tipo => ({ value: tipo, text: tipo }))
        : [];
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;

      // Mapear los datos para calcular los valores necesarios antes de mostrar en la tabla
      return this.filteredItems.slice(start, end).map(item => ({
        ...item,
        monto: (item.montoSuper || 0) + (item.montoVPower || 0),
        vales: item.vales,
        saldoRestante: (item.saldoSuper || 0) + (item.saldoVPower || 0)
      }));
    },
    filteredItems() {
      let items = this.items;

      if (this.inputNroOrden) {
        items = items.filter(item => item.nroOrden && String(item.nroOrden).includes(this.inputNroOrden));
      }

      return items;
    },
    // Computed properties para vehículos
    loadingVehiculos() {
      // Ya no tenemos loading state en el store simplificado
      return false
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
      // Usar las áreas importadas
      return this.areas.map(area => ({
        value: area,
        text: area
      }));
    },
    // Validaciones para editar vehículo
    patenteEditState() {
      return this.vehiculoEdit.patente.length > 0 ? null : false;
    },
    areaEditState() {
      return this.vehiculoEdit.area && this.vehiculoEdit.area.length > 0 ? null : false;
    }
  },
  methods: {
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
      this.loadingCargar = true;
      try {
        // const userToken = this.$store.state.user.token;

        // Concatenar nroOrden1 y nroOrden2 para formar nroOrden
        const nroOrden = `${this.nroOrden1}/${this.nroOrden2}`;

        await this.$store.dispatch('combustible/create', {
          orden: {
            nroOrden: nroOrden,
            proveedor: this.orden.proveedor,
            area: this.orden.area,
            montos: this.orden.montos.filter(m => m.tipoCombustible && m.monto > 0) // Evitar enviar montos vacíos
          },
        });

        // Registrar actividad de creación de orden de compra
        await this.$logUserActivity(
          this.$store.state.user.username,
          'Crear Orden de Compra',
          `Orden de compra ${nroOrden} creada para el área ${this.orden.area}`
        );

        // Mostrar mensaje de éxito
        // this.showCargarOrden = false
        this.successMessage = true

      } catch (error) {
        this.$bvToast.toast("Error al crear la orden", { variant: "danger" });
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
      const userToken = this.$store.state.user.token
      const success = await this.$store.dispatch('combustible/eliminarOrden',{
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
      this.$store.dispatch('vehiculos/getAll').then(() => {
        this.vehiculos = this.$store.state.vehiculos ? this.$store.state.vehiculos.all : [];
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
        const userToken = this.$store.state.user.token;

        await this.$store.dispatch('vehiculos/create', {
          vehiculo: this.vehiculo,
          userToken
        });

        this.successMessageVehiculo = true;
      } catch (error) {
        this.$bvToast.toast("Error al crear el vehículo", { variant: "danger" });
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
      const userToken = this.$store.state.user.token;

      const success = await this.$store.dispatch('vehiculos/delete', {
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
        const userToken = this.$store.state.user.token;

        const vehiculoData = {
          patente: this.vehiculoEdit.patente,
          area: this.vehiculoEdit.area
        };

        await this.$store.dispatch('vehiculos/update', {
          id: this.vehiculoEdit.id,
          vehiculo: vehiculoData,
          userToken
        });

        // Registrar actividad de modificación de vehículo
        // Verificar si el área cambió para registrar específicamente el cambio de área
        if (this.vehiculoEdit.areaOriginal !== this.vehiculoEdit.area) {
          await this.$logUserActivity(
            this.$store.state.user.username,
            'Modificar Vehículo - Cambio de Área',
            `Vehículo ${this.vehiculoEdit.patente}: área cambiada de ${this.vehiculoEdit.areaOriginal} a ${this.vehiculoEdit.area}`
          );
        } else {
          await this.$logUserActivity(
            this.$store.state.user.username,
            'Modificar Vehículo',
            `Vehículo ${this.vehiculoEdit.patente} actualizado en el área ${this.vehiculoEdit.area}`
          );
        }

        // Cerrar modal y mostrar mensaje de éxito
        this.cerrarModalEditar();
        this.$bvToast.toast('Vehículo actualizado correctamente', {
          title: 'Éxito',
          variant: 'success',
          solid: true
        });

        // Recargar vehículos
        await this.$store.dispatch('vehiculos/getAll');
        this.vehiculos = this.$store.state.vehiculos ? this.$store.state.vehiculos.all : [];

      } catch (error) {
        console.error('Error al actualizar vehículo:', error);
        this.$bvToast.toast('Error al actualizar el vehículo', {
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
</style>
