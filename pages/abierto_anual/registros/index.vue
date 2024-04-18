<template>
    <div class="page main-background">
      <Banner title="Comercio Abierto anual" subtitle="Uso interno" />
      <div class="col-8 mx-auto" v-if="adminComercio">
          <b-form-group class="col-5 mx-6 mx-auto mt-4" label-class="text-success h6">
            <label for="inputCUIT" class="bv-no-focus-ring col-form-label pt-0 text-success h6">
              <b-icon-search></b-icon-search> Buscar por CUIT
            </label>
            <b-form-input
              id="inputCUIT"
              v-model="inputCUIT"
              placeholder="Ingresá un CUIT"
              @input="filtrarPorCUIT"
            />
        </b-form-group>
        <b-form-checkbox class="text-center" v-model="hideFinalizados">Ocultar incompletos</b-form-checkbox>
        <!-- <b-form-group class="col-4 mx-auto mt-4" horizontal label-class="text-success h6" label="Filtrar por DNI">
          <b-icon-funnel-fill variant="success" />
          <b-form-input v-model="selectedDocumento" @keypress="onSearchByDocumento">
          </b-form-input>
        </b-form-group> -->
      </div>

      <b-table per-page="10" head-row-variant="warning" class="col-md-10 white col-sm-8 mx-auto mt-4 shadow-card" :items="paginatedItems" :fields="fields">
        <!-- Plantilla personalizada para la columna "detalles" -->
        <template #cell(status)="row">
          <div>
            <!-- Itera sobre cada estado en el array de status -->
            <span v-for="(estado, index) in row.item.status" class="mx-1" :key="index" :style="{ color: estadoColor(estado) }">
              <b-iconstack :title="estado">
                <b-icon-circle variant="dark"></b-icon-circle>
                <b-icon icon="circle-fill"></b-icon>
              </b-iconstack>
            </span>
          </div>
        </template>
        <template #cell(detalles)="row">
          <NuxtLink :to="{ name: 'abierto_anual-registros-id', params: { id: row.item.id } }">
            <b-button variant="outline-secondary" size="sm" title="Editar">
              <b-icon-pen/>
            </b-button>
          </NuxtLink>
        </template>
        <template #cell(observaciones)="row">
          <b-button v-if="row.item.observaciones && row.item.observaciones != ''" @click="onShowObservaciones(row.item.id)" variant="outline-primary" size="sm" title="Observaciones">
            <b-icon-eye/>
          </b-button>
        </template>
      </b-table>
      <b-pagination class="mt-4" :total-rows="items.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>

      <b-modal v-model="observacionesModal" header-bg-variant="primary" title="Observaciones" title-class="text-light" hide-footer centered>
        <p v-html="singleContent"></p>
      </b-modal>
    </div>
  </template>

  <script>
  export default{
    data() {
      return {
        hideFinalizados: false,
        lastLength: false,
        items: [],
        selectedEstado: '',
        observacionesModal: false,
        singleContent: '',
        currentPage: 1,
        perPage: 10,
        fields: [
          {
            key: 'cuit',
            label: 'CUIT'
          },
          {
            key: 'nroLegajo',
            label: 'Legajo comercial',
          },
          {
            key: 'status',
            label: 'Facturas enviadas',
            estadoColor: '' // Agrega la propiedad para almacenar la clase
          },
          {
            key: 'detalles',
          },
          {
            key: 'observaciones'
          }
        ],
        estadosArchivo: ['Incompleto','En revisión', 'Incorrecto', 'Correcto']
  }
    },
    async fetch() {
      await this.$store.dispatch('abiertoAnual/getAll')
      this.items = this.tramites
      this.$store.commit('abiertoAnual/ordenar')

      const perPage = 10;
    },
    computed: {
      tramites(){
        return this.$store.state.abiertoAnual.all
      },
      paginatedItems() {
        const startIndex = (this.currentPage - 1) * this.perPage;
        const endIndex = startIndex + this.perPage;

        return this.items.filter((item) => {
          const estadoCondition = !this.selectedEstado || item.status === this.selectedEstado;
          const tipoCondition = !this.selectedTipo || item.tipoSolicitud === this.selectedTipo;
          const finalizadosCondition = !this.hideFinalizados || !["Rechazada", "Finalizada"].includes(item.status);

          return estadoCondition && tipoCondition && finalizadosCondition;
        }).slice(startIndex, endIndex);
      },
      filteredItems() {
        const startIndex = (this.currentPage - 1) * this.perPage;
        const endIndex = startIndex + this.perPage;

        return this.items.filter((item) => {
          item.cuit === this.inputCUIT
        }).slice(startIndex, endIndex);
      },
      totalPages() {
        return Math.ceil(this.filteredItems.length / this.perPage);
      },
      adminComercio() {
        return this.$store.state.user.admin === "comercio" || this.$store.state.user.admin == "master"
      }
    },
    methods: {
      filtrarPorCUIT() {
        if (this.inputCUIT) {
          this.filteredItems = this.items.filter(item => item.cuit.includes(this.inputCUIT));
        } else {
          this.filteredItems = this.items; // Si no hay CUIT, muestra todos los ítems.
        }
      },
      onPageChange(newPage) {
        this.currentPage = newPage;
      },
      async onShowObservaciones(id) {
        const tramite = this.$store.state.abiertoAnual.all.find(tramite => tramite.id === id);

        // Dividir el texto en líneas en función del guión medio "-" y unirlo con etiquetas <br>
        const observacionesDivididas = tramite.observaciones.split('-').join('<br>');

        this.singleContent = observacionesDivididas;
        this.observacionesModal = true;
      },
      estadoColor(estado) {
        switch (estado) {
          case 'Incorrecto':
            return 'red'; // Rojo para Incorrecto
          case 'Correcto':
            return 'green'; // Verde para Correcto
          case 'En revisión':
          return '#dfe305'; // Verde para Correcto
          default:
            return 'grey'; // Gris para Incompleto o sin datos
        }
      },
    },
  }
  </script>
