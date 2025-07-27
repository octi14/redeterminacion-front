<template>
  <div class="page main-background">
    <Banner title="Reclamos de pago doble" subtitle="Uso interno" />
    <div class="col-10 mx-auto" v-if="adminComercio">
      <!-- Filtrar por estado -->
      <b-row>
        <b-form-group class="col-4 mx-6 mx-auto mt-4" label-class="text-success h6">
          <label for="inputCUIT" class="bv-no-focus-ring col-form-label pt-0 text-success h6">
            <b-icon-search></b-icon-search> Buscar por CUIT
          </label>
          <b-form-input
            id="inputCUIT"
            v-model="inputCUIT"
            placeholder="Ingresá el CUIT"
            @input="filtrarPorCuit"
            type="text"
          />
        </b-form-group>
        <b-form-group class="col-4 mx-6 mx-auto mt-4" label-class="text-success h6">
          <label for="selectedEstado" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><b-icon-funnel-fill></b-icon-funnel-fill> Filtrar por Estado</label>
          <b-form-select plain v-model="selectedEstado">
            <option value="">Todos</option>
            <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
          </b-form-select>
        </b-form-group>
      </b-row>
      <b-form-checkbox class="text-center" v-model="hideFinalizados">Ocultar Finalizados/Rechazados</b-form-checkbox>
      <!-- <div class="row no-gutters justify-content-center">
        <b-button variant="success" class="text-center mt-3" v-if="adminMaster" @click="generarExcelTramitesNoFinalizados"> Exportar a Excel</b-button>
      </div> -->
    </div>

    <b-table per-page="10" head-row-variant="warning" class="col-md-10 white col-sm-8 mx-auto mt-4 shadow-card" :items="paginatedItems" :fields="fields">
      <!-- Plantilla personalizada para la columna "detalles" -->
      <template #cell(status)="row">
        <div :class="row.item.estadoColor"><b>{{ row.value }}</b></div>
      </template>
      <template #cell(detalles)="row">
        <NuxtLink :to="{ name: 'recaudaciones-pagos_dobles-solicitudes-id', params: { id: row.item.id } }" @click.native="registrarActividad('Abrir Trámite', 'Trámite nro: ' + row.item.nroTramite)">
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
    <b-pagination class="mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>

    <b-modal v-model="observacionesModal" header-bg-variant="primary" title="Observaciones" title-class="text-light" hide-footer centered>
      <p v-html="singleContent"></p>
    </b-modal>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

export default{
  data() {
    return {
      hideFinalizados: false,
      lastLength: false,
      inputCUIT: "",
      items: [],
      selectedEstado: '',
      observacionesModal: false,
      singleContent: 'asdasd',
      currentPage: 1,
      perPage: 10,
      fields: [
        {
          key: 'createdAt',
          label: 'Fecha de solicitud',
        },
        {
          key: 'cuit',
          label: 'CUIT',
        },
        {
          key: 'nroCuenta',
          label: 'N° de cuenta',
        },
        {
          key: 'mail',
          label: 'Mail',
        },
        {
          key: 'status',
          label: 'Estado',
          estadoColor: '' // Agrega la propiedad para almacenar la clase
        },
        {
          key: 'detalles',
        },
        {
          key: 'observaciones'
        }
      ],
      estados: ['Rechazada','En revisión', 'Aprobada']
    };
  },
  async fetch() {
    await this.$store.dispatch('pagosDobles/getAll')
    this.items = this.pagosDobles
    console.log(this.items)
    // Asignar el color adecuado según el estado
    this.items?.forEach(item => {
      switch (item.status) {
        case 'En revisión':
          item.estadoColor = 'text-primary';
          break;
        case 'Rechazada':
          item.estadoColor = 'text-danger';
          break;
        case 'Aprobada':
          item.estadoColor = 'text-darkgreen';
          break;
        default:
          item.estadoColor = 'text-secondary';
      }
    });
    this.$store.commit('pagosDobles/ordenarPagos')

    const perPage = 10;
  },
  computed: {
    pagosDobles(){
      return this.$store.state.pagosDobles.all
    },
    paginatedItems() {
      if (!this.filteredItems || this.filteredItems.length === 0) {
        return [];
      }

      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredItems.slice(start, end);
    },
    filteredItems() {
      let items = this.items;

      // Filtrar los finalizados
      if (this.hideFinalizados) {
        items = items.filter(item => !["Rechazada", "Finalizada"].includes(item.status));
      }

      // Filtrar por CUIT
      if (this.inputCUIT) {
        items = items.filter(item => {
          return item.cuit && String(item.cuit).includes(this.inputCUIT);
        });
      }

      // Filtrar por estado
      if (this.selectedEstado) {
        items = items.filter(item => item.status === this.selectedEstado);
      }

      return items;
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.perPage);
    },
    adminComercio() {
      return this.$store.state.user.admin === "comercio" || this.$store.state.user.admin == "master"
    },
    adminMaster() {
      return this.$store.state.user.admin == "master"
    }
  },
  methods: {
    async registrarActividad(evento, result){
      const userId = this.$store.state.user.username; // Reemplaza con el ID del usuario real
      const actionType = evento;
      const actionResult = result;

      try {
          await this.$logUserActivity(userId, actionType, actionResult);
      } catch (error) {
          console.error('Error al registrar la actividad:', error);
      }
    },
    onPageChange(newPage) {
      this.currentPage = newPage;
    },
    async onShowObservaciones(id) {
      const pago = this.$store.state.pagosDobles.all.find(pago => pago.id === id);

      // Dividir el texto en líneas en función del guión medio "-" y unirlo con etiquetas <br>
      const observacionesDivididas = pago.observaciones.split('-').join('<br>');

      this.singleContent = observacionesDivididas;
      this.observacionesModal = true;
      this.registrarActividad("Ver Observaciones", "Trámite nro: " + pago.nroTramite);
    },
  },
}
</script>
