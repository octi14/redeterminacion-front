<template>
  <div class="page main-background">
    <Banner title="Reclamos de pago doble" subtitle="Uso interno" />
    <div class="internal-use-toolbar internal-use-wide" v-if="adminRecaudaciones">
      <!-- Filtrar por estado -->
      <b-row>
        <b-form-group class="col-4 mx-6 mx-auto mt-4" label-class="text-success h6">
          <label for="inputCUIT" class="bv-no-focus-ring col-form-label pt-0 text-success h6">
            <i class="bi bi-search"></i> Buscar por CUIT
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
          <label for="selectedEstado" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><i class="bi bi-funnel-fill"></i> Filtrar por Estado</label>
          <b-form-select plain v-model="selectedEstado">
            <option value="">Todos</option>
            <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
          </b-form-select>
        </b-form-group>
      </b-row>
      <div class="internal-use-checkbox-row">
        <b-form-checkbox v-model="hideFinalizados">Ocultar Finalizados/Rechazados</b-form-checkbox>
      </div>
      <div class="page-btn-export-wrap">
        <b-button variant="success" size="sm" class="page-btn-export" v-if="adminMaster" @click="generarExcelTramitesNoFinalizados"> Exportar a Excel</b-button>
      </div>
    </div>

    <b-table
      per-page="10"
      head-row-variant="warning"
      class="internal-use-table internal-use-wide white mt-4 shadow-card"
      :items="paginatedItems"
      :fields="fields"
      :busy="loading"
    >
      <template #table-busy>
        <LoadingState text="Cargando..." variant="primary" />
      </template>
      <!-- Plantilla personalizada para la columna "detalles" -->
      <template #cell(status)="row">
        <div :class="row.item.estadoColor"><b>{{ row.value }}</b></div>
      </template>
      <template #cell(detalles)="row">
        <NuxtLink :to="{ name: 'recaudaciones-pagos_dobles-solicitudes-id', params: { id: row.item.id } }" @click="registrarActividad('Abrir Trámite', 'Trámite nro: ' + row.item.nroTramite)">
          <b-button variant="outline-secondary" size="sm" title="Editar">
            <i class="bi bi-pen"></i>
          </b-button>
        </NuxtLink>
      </template>
      <template #cell(observaciones)="row">
        <b-button v-if="row.item.observaciones && row.item.observaciones != ''" @click="onShowObservaciones(row.item.id)" variant="outline-primary" size="sm" title="Observaciones">
          <i class="bi bi-eye"></i>
        </b-button>
      </template>
    </b-table>
    <b-pagination v-if="!loading" class="internal-use-pagination internal-use-wide mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>

    <BModal v-model="observacionesModal" header-bg-variant="primary" title="Observaciones" title-class="text-light" no-footer centered>
      <p v-html="singleContent"></p>
    </BModal>
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
          key: 'nroTramite',
          label: 'N° de trámite',
        },
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
      estados: ['Rechazada','En revisión', 'Aprobada'],
      loading: true,
    };
  },
  async mounted() {
    await this.loadSolicitudes()
  },
  computed: {
    pagosDobles(){
      return usePagosDoblesStore().all
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
        // Estados finales en este módulo: Rechazada / Aprobada (compat con Finalizada si backend aún usa ese string)
        items = items.filter(item => !["Rechazada", "Aprobada", "Finalizada"].includes(item.status));
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
    adminRecaudaciones() {
      const admin = useUserStore().admin
      return admin === "recaudaciones" || admin == "master"
    },
    adminMaster() {
      return useUserStore().admin == "master"
    }
  },
  methods: {
    async loadSolicitudes() {
      this.loading = true
      try {
        await usePagosDoblesStore().getAll()
        this.items = this.pagosDobles
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
        usePagosDoblesStore().ordenarPagos()
      } finally {
        this.loading = false
      }
    },
    async registrarActividad(evento, result){
      const userId = useUserStore().username; // Reemplaza con el ID del usuario real
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
      const pago = this.pagosDobles.find(pago => pago.id === id);

      // Dividir el texto en líneas en función del guión medio "-" y unirlo con etiquetas <br>
      const observacionesDivididas = pago.observaciones.split('-').join('<br>');

      this.singleContent = observacionesDivididas;
      this.observacionesModal = true;
      this.registrarActividad("Ver Observaciones", "Trámite nro: " + pago.nroTramite);
    },
  },
}
</script>
