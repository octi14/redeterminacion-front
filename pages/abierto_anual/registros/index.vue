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
          type="text"
        />
      </b-form-group>
      <b-form-checkbox class="text-center" v-model="hideFinalizados">Ocultar incompletos</b-form-checkbox>
    </div>

    <b-table per-page="10" head-row-variant="warning" class="col-md-10 white col-sm-8 mx-auto mt-4 shadow-card" :items="filteredItems" :fields="fields">
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
    </b-table>
    <b-pagination class="mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hideFinalizados: false,
      lastLength: false,
      inputCUIT: '', // Agregar la propiedad inputCUIT
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
      ],
      estadosArchivo: ['Incompleto','En revisión', 'Incorrecto', 'Correcto']
    }
  },
  async fetch() {
    await this.$store.dispatch('abiertoAnual/getAll')
    this.$store.commit('abiertoAnual/ordenar')

    const perPage = 10;
  },
  computed: {
    tramites(){
      return this.$store.state.abiertoAnual.all
    },
    filteredItems() {
      if (!this.inputCUIT) {
        return this.tramites;
      }

      return this.tramites.filter((item) => {
        const match = item.cuit && String(item.cuit).includes(this.inputCUIT);
        console.log(`Comparando ${this.inputCUIT} con ${item.cuit}. ¿Coincide? ${match}`);
        return match;
      });
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
      // No es necesario filtrar aquí, ya se hace en filteredItems
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
