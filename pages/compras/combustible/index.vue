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
      <template #cell(detalles)="row">
        <NuxtLink :to="{ name: 'compras-combustible-id', params: { id: row.item.id } }">
          <b-button variant="outline-secondary" size="sm" title="Editar">
            <b-icon-pen/>
          </b-button>
        </NuxtLink>
      </template>
      <template #cell(observaciones)="row">
        <b-button v-if="row.item.observaciones && row.item.observaciones != ''" @click="onShowObservaciones(row.index)" variant="outline-primary" size="sm" title="Observaciones">
          <b-icon-eye/>
        </b-button>
      </template>
    </b-table>

    <b-pagination class="mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>
    <div class="text-center mb-3">
      <NuxtLink to="/compras">
        <b-button variant="primary">Volver</b-button>
      </NuxtLink>
    </div>

    <b-modal v-model="showCargarOrden" hide-footer :header-bg-variant="'success'" centered>
      <template #modal-header>
        <div class="confirmation-popup-header mx-auto">
          <b-icon-upload scale="2" variant="light" />
        </div>
      </template>
      <div class="confirmation-popup-body">
        <h3 class="text-success text-center"><b>Cargar orden de compra</b></h3>

        <!-- Mensaje de éxito -->
        <div v-if="successMessage" class="text-center">
          <b-icon-check-circle scale="2" variant="success"></b-icon-check-circle>
          <p class="text-success font-weight-bold mt-2">La Orden de compra fue cargada con éxito</p>
        </div>

        <div v-else>
          <p class="text-dark text-center">Ingresá los datos de la orden de compra</p>
          <div class="row mx-auto">
            <!-- Número de orden de compra -->
            <b-form-group label="Número de orden de compra" label-class="text-dark font-weight-bold" class="col-12">
              <div class="numero-orden-container">
                <b-form-input type="number" class="col-6" no-wheel v-model="nroOrden1"/>
                <span>/</span>
                <b-form-input type="number" class="col-2" no-wheel v-model="nroOrden2"/>
              </div>
            </b-form-group>

            <!-- Combustibles -->
            <b-form-group label="Montos asignados por tipo de combustible" label-class="text-dark font-weight-bold" class="col-12">
              <div v-for="(combustible, index) in orden.montos" :key="index" class="d-flex align-items-center mb-2">
                <b-form-input class="col-5" type="text" placeholder="Tipo de combustible" v-model="combustible.tipoCombustible" />
                <b-form-input class="col-5 ml-2" type="number" placeholder="Monto" no-wheel v-model="combustible.monto" />
                <b-button variant="danger" size="sm" class="ml-2" @click="removeCombustible(index)">X</b-button>
              </div>
              <b-button variant="primary" :disabled="this.orden.montos.length >= 4" size="sm" @click="addCombustible">+ Agregar otro combustible</b-button>
            </b-form-group>

            <!-- Proveedor -->
            <b-form-group label="Proveedor" label-class="text-dark font-weight-bold" class="col-12">
              <b-form-input class="col-8" type="text" v-model="orden.proveedor"/>
            </b-form-group>

            <!-- Área asignada -->
            <b-form-group label="Área asignada" label-class="text-dark font-weight-bold" class="col-12">
              <b-form-input class="col-8" type="text" v-model="orden.area"/>
            </b-form-group>
          </div>

          <div class="row justify-content-end">
            <!-- Botón de salir -->
            <div class="text-center mt-3 mx-2">
              <b-btn variant="secondary" @click="showCargarOrden=false">
                Cancelar
              </b-btn>
            </div>
            <!-- Botón de aceptar -->
            <div class="text-center mt-3 mx-2">
              <b-btn variant="success" :disabled="!nroOrden1 || !nroOrden2 || !orden.area || !orden.montos.length" @click="submitForm">
                Aceptar
              </b-btn>
            </div>
          </div>
        </div>
      </div>
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
      observaciones: '',
      showObservaciones: false,
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
        { key: 'detalles', label: 'Detalles' },
        { key: 'observaciones', label: 'Observaciones' },
      ]
    };
  },
  async fetch() {
    await this.$store.dispatch('combustible/getOrdenesCompra')
    this.items = this.ordenesCompra
  },
  computed: {
    adminCompras(){
      return this.$store.state.user.admin === "compras" || this.$store.state.user.admin === "master"
    },
    ordenesCompra() {
      return this.$store.state.combustible.all;
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
      this.isLoading = true;
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
        this.successMessage = true;

        // Esperar 2 segundos antes de cerrar el modal y refrescar la página
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.showCargarOrden = false;  // Cerrar modal
        this.successMessage = false,
        location.reload();  // Refrescar página
      } catch (error) {
        this.$bvToast.toast("Error al crear la orden", { variant: "danger" });
      } finally {
        this.isLoading = false;
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
