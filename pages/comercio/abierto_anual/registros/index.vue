<template>
  <div class="page main-background">
    <Banner title="Comercio Abierto anual" subtitle="Uso interno" />
    <div class="col-8 mx-auto" v-if="adminArvige">
      <b-form-group class="col-5 mx-6 mx-auto mt-4 mb-4" label-class="text-success h6">
        <label for="inputCUIT" class="bv-no-focus-ring col-form-label pt-0 text-success h6">
          <i class="bi bi-search"></i> Buscar por CUIT
        </label>
        <b-form-input
          id="inputCUIT"
          v-model="inputCUIT"
          placeholder="Ingresá un CUIT"
          @input="filtrarPorCUIT"
          type="text"
        />
      </b-form-group>

      <div class="row justify-content-center mb-3">
        <div class="col text-center">
          <p>Filtrar período 1</p>
          <b-form-select v-model="selectedEstado1" :options="estadosArchivo" class="mx-2"/>
        </div>
        <div class="col text-center">
          <p>Filtrar período 2</p>
          <b-form-select v-model="selectedEstado2" :options="estadosArchivo" class="col mx-2"/>
        </div>
        <div class="col text-center">
          <p>Filtrar período 3</p>
          <b-form-select v-model="selectedEstado3" :options="estadosArchivo" class="col mx-2"/>
        </div>
      </div>

      <div class="page-btn-export-wrap">
        <b-button variant="success" size="sm" class="page-btn-export" @click="exportarCSV"><i class="bi bi-download"></i> Exportar CSV</b-button>
      </div>
    </div>

    <b-table
      per-page="10"
      head-row-variant="warning"
      class="internal-use-table white mt-4 shadow-card"
      :items="paginatedItems"
      :fields="fields"
      :busy="loading"
    >
      <template #table-busy>
        <LoadingState text="Cargando..." variant="primary" />
      </template>
      <template #cell(status)="row">
        <div class="facturas-estado-dots">
          <span
            v-for="(estado, index) in (row.item.status || []).slice(0, 3)"
            :key="index"
            class="factura-periodo-dot mx-1"
            :title="estado"
          >
            <i class="bi bi-circle factura-periodo-dot__ring" aria-hidden="true"></i>
            <i
              class="bi bi-circle-fill factura-periodo-dot__fill"
              :style="{ color: estadoColor(estado) }"
              aria-hidden="true"
            ></i>
          </span>
        </div>
      </template>
      <template #cell(detalles)="row">
        <NuxtLink :to="{ name: 'comercio-abierto_anual-registros-id', params: { id: row.item.id } }">
          <b-button variant="outline-secondary" size="sm" title="Editar">
            <i class="bi bi-pen"></i>
          </b-button>
        </NuxtLink>
      </template>
    </b-table>
    <b-pagination v-if="!loading" class="mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  adminRoles: ['arvige', 'master'],
})
</script>

<script>
export default {
  data() {
    return {
      hideFinalizados: false,
      lastLength: false,
      inputCUIT: '',
      items: [],
      selectedEstado: '',
      observacionesModal: false,
      singleContent: '',
      currentPage: 1,
      perPage: 10,
      fields: [
        { key: 'cuit', label: 'CUIT' },
        { key: 'nroLegajo', label: 'Legajo comercial' },
        { key: 'status', label: 'Facturas enviadas', estadoColor: '' },
        { key: 'detalles' },
      ],
      estadosArchivo: ['Todos', 'Incompleto', 'En revisión', 'Incorrecto', 'Correcto'],
      selectedEstado1: '', // Filtro para el estado del período 1
      selectedEstado2: '', // Filtro para el estado del período 2
      selectedEstado3: '', // Filtro para el estado del período 3
      loading: true,
    }
  },
  async mounted() {
    this.loading = true
    try {
      await useAbiertoAnualStore().getAll()
      useAbiertoAnualStore().ordenar()
    } finally {
      this.loading = false
    }
  },
  computed: {
    tramites() {
      return useAbiertoAnualStore().all;
    },
    filteredItems() {
      let items = this.tramites;

      if (this.hideFinalizados) {
        items = items.filter(item => !item.finalizado);
      }

      if (this.inputCUIT) {
        items = items.filter(item => {
          return item.cuit && String(item.cuit).includes(this.inputCUIT);
        });
      }

      // Filtros por estado en cada período, exceptuando "Todos"
      if (this.selectedEstado1 && this.selectedEstado1 !== 'Todos') {
        items = items.filter(item => Array.isArray(item.status) && item.status[0] === this.selectedEstado1);
      }
      if (this.selectedEstado2 && this.selectedEstado2 !== 'Todos') {
        items = items.filter(item => Array.isArray(item.status) && item.status[1] === this.selectedEstado2);
      }
      if (this.selectedEstado3 && this.selectedEstado3 !== 'Todos') {
        items = items.filter(item => Array.isArray(item.status) && item.status[2] === this.selectedEstado3);
      }

      return items;
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = this.currentPage * this.perPage;
      return this.filteredItems.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.perPage);
    },
    adminArvige() {
      const admin = useUserStore().admin
      return admin === "arvige" || admin === "master";
    }
  },
  methods: {
    filtrarPorCUIT() {
      this.currentPage = 1;
    },
    onPageChange(newPage) {
      this.currentPage = newPage;
    },
    async onShowObservaciones(id) {
      const tramite = useAbiertoAnualStore().all.find(tramite => tramite.id === id);
      const observaciones = typeof tramite?.observaciones === 'string' ? tramite.observaciones : ''
      const observacionesDivididas = observaciones.split('-').join('<br>');
      this.singleContent = observacionesDivididas;
      this.observacionesModal = true;
    },
    estadoColor(estado) {
      switch (estado) {
        case 'Incorrecto':
          return 'red';
        case 'Correcto':
          return 'green';
        case 'En revisión':
          return '#FADD1A';
        default:
          return 'lightgrey';
      }
    },
    exportarCSV() {
      const headers = ['CUIT', 'Legajo comercial', 'Status1', 'Observaciones1', 'Status2', 'Observaciones2', 'Status3', 'Observaciones3'];
      const data = this.tramites.map(tramite => [
        tramite.cuit,
        tramite.nroLegajo,
        // tramite.mail,
        (Array.isArray(tramite.status) ? tramite.status[0] : '') || '',
        (Array.isArray(tramite.facturas) && tramite.facturas[0] && tramite.facturas[0].observaciones) || '',
        (Array.isArray(tramite.status) ? tramite.status[1] : '') || '',
        (Array.isArray(tramite.facturas) && tramite.facturas[1] && tramite.facturas[1].observaciones) || '',
        (Array.isArray(tramite.status) ? tramite.status[2] : '') || '',
        (Array.isArray(tramite.facturas) && tramite.facturas[2] && tramite.facturas[2].observaciones) || '',
      ]);

      const csvContent = [
        headers.join(";"),
        ...data.map(row => row.map(field => `"${field}"`).join(";"))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "comercio_abierto_anual.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }

  }
}
</script>

<style scoped>
.facturas-estado-dots {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
}

.factura-periodo-dot {
  position: relative;
  display: inline-block;
  width: 1.15rem;
  height: 1.15rem;
  vertical-align: middle;
  flex-shrink: 0;
}

.factura-periodo-dot__ring,
.factura-periodo-dot__fill {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  line-height: 1;
  font-size: inherit;
}

.factura-periodo-dot__ring {
  color: #212529;
}
</style>
