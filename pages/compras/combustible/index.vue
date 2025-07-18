<template>
  <div v-if="adminCompras" class="page main-background">
    <Banner title="Compras" subtitle="Combustible"/>
    <div class="row no-gutters justify-content-center" v-if="adminCompras">
        <b-button variant="success" class="text-center mt-3 mx-3" @click="showCargarOrden = true">Cargar Orden de Compra</b-button>
    </div>
    <b-table per-page="10" head-row-variant="success" class="col-md-10 white col-sm-8 mx-auto mt-4 shadow-card" :items="paginatedItems" :fields="fields">
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
            @click="onShowObservaciones(row.index)"
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
    <div class="text-center mb-3">
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

  </div>
</template>

<script>
export default {
  data() {
    return {
      inputNroOrden: "",
      nroOrden1: '', // Número de orden parte 1
      nroOrden2: '', // Número de orden parte 2
      showCargarOrden: false,
      isLoading: false,
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
      areas: [
        "Intendente Municipal",
        "Secretaría de Salud",
        "Secretaría de Hacienda",
        "Secretaría de Obras",
        "Dirección de Deportes",
        "Verificación en Playa",
        "Juzgado de Faltas",
        "Inspección General",
        "Dir. Coordinación",
        "Cementerio",
        "Dirección de Obras Particulares",
        "Seguridad en Playa",
        "Medio Ambiente",
        "Tránsito",
        "Turismo",
        "Sec. de Desarrollo de la Comunidad",
        "Corralón",
        "Corralón Sur",
        "Obras Sanitarias",
        "Obras Públicas",
        "Transporte"
      ]
    };
  },
  async fetch() {
    await this.$store.dispatch('combustible/getOrdenesCompra')
    this.items = this.ordenesCompra
    await this.$store.dispatch('combustible/getProveedores')
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
    onShowObservaciones(index){
      if(this.ordenesCompra[index].observaciones){
        this.observaciones = this.ordenesCompra[index].observaciones.split('**').join('<br>').split(',').join('')
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
  }
};
</script>

<style scoped>
/* Estilo general del modal */
.confirmation-popup-body {
  padding: 1.5rem;
}

/* Mejor organización de los inputs del número de orden */
.numero-orden-container {
  display: flex;
}

.icon-orange{
  padding-top: auto;
  color: #FF7A00;
}

.numero-orden-container input {
  width: 80px;
  text-align: center;
  font-size: 1rem;
  border: 1px solid #ced4da;
  border-radius: 5px;
  padding: 5px;
  transition: all 0.2s ease-in-out;
}

.numero-orden-container input:focus {
  border-color: #28a745;
  box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
}

.numero-orden-container span {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0 10px;
}

/* Mejor presentación de los otros inputs */
.b-form-group {
  margin-bottom: 1rem;
}

.b-form-input {
  font-size: 1rem;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  transition: border-color 0.2s ease-in-out;
}

.b-form-input:focus {
  border-color: #28a745;
  box-shadow: 0 0 5px rgba(40, 167, 69, 0.5);
}

/* Botón más estilizado */
.b-btn {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
}

.b-btn:hover {
  background-color: #218838;
  border-color: #1e7e34;
}
</style>
