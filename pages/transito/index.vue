<template>
  <div class="page main-background">
    <Banner title="Tránsito" />
    <div v-if="adminMaster" class="internal-use-toolbar">
      <!-- Filtrar por estado -->
      <b-row>
        <b-form-group class="col-3 mx-6 mx-auto mt-4" label-class="text-success h6">
          <label for="inputNroTramite" class="bv-no-focus-ring col-form-label pt-0 text-success h6">
            <i class="bi bi-search"></i> Buscar por N° de Trámite
          </label>
          <b-form-input
            id="inputNroTramite"
            v-model="inputNroTramite"
            placeholder="Ingresá el número de trámite"
            @input="filtrarPorNroTramite"
            type="text"
          />
        </b-form-group>
        <b-form-group class="col-3 mx-6 mx-auto mt-4" label-class="text-success h6">
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
        <b-form-group class="col-3 mx-6 mx-auto mt-4" label-class="text-success h6">
          <label for="selectedEstado" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><i class="bi bi-funnel-fill"></i> Filtrar por Estado</label>
          <b-form-select plain v-model="selectedEstado">
            <option value="">Todos</option>
            <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
          </b-form-select>
        </b-form-group>
        <!-- filtrar por tipo de trámite -->
        <b-form-group class="col-3 mx-auto mt-4" label-class="text-success h6">
          <label for="selectedEstado" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><i class="bi bi-funnel-fill"></i> Filtrar por tipo de trámite</label>
          <b-form-select plain v-model="selectedTipo">
            <option value="">Todos</option>
            <option v-for="tipoTramite in tiposTramite" :value="tipoTramite" :key="tipoTramite">{{ tipoTramite }}</option>
          </b-form-select>
        </b-form-group>
      </b-row>
      <b-form-checkbox class="text-center" v-model="hideFinalizados">Ocultar Finalizados/Rechazados</b-form-checkbox>
      <div class="page-btn-export-wrap">
        <b-button variant="success" size="sm" class="page-btn-export" v-if="adminMaster" @click="generarExcelTramitesNoFinalizados"> Exportar a Excel</b-button>
      </div>
      <!-- <b-form-group class="col-4 mx-auto mt-4" horizontal label-class="text-success h6" label="Filtrar por DNI">
        <i class="bi bi-funnel-fill text-success"></i>
        <b-form-input v-model="selectedDocumento" @keypress="onSearchByDocumento">
        </b-form-input>
      </b-form-group> -->
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
      <!-- Plantilla personalizada para la columna "detalles" -->
      <template #cell(status)="row">
        <div :class="row.item.estadoColor"><b>{{ row.value }}</b></div>
      </template>
      <template #cell(detalles)="row">
        <NuxtLink :to="{ name: 'comercio-solicitudes-id', params: { id: row.item.id } }" @click="registrarActividad('Abrir Trámite', 'Trámite nro: ' + row.item.nroTramite)">
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
    <b-pagination v-if="!loading" class="mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>

    <BModal v-model="observacionesModal" header-bg-variant="primary" title="Observaciones" title-class="text-light" no-footer centered>
      <p v-html="singleContent"></p>
    </BModal>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  adminRoles: ['comercio', 'master'],
})
</script>

<script>
import { loadXlsx } from '~/utils/loadXlsx';
import { saveAsFile } from '~/utils/saveAsFile';

export default{
  data() {
    return {
      hideFinalizados: false,
      lastLength: false,
      inputNroTramite: "", // Variable de búsqueda por número de trámite
      inputCUIT: "",
      items: [],
      selectedEstado: '',
      selectedTipo: '',
      observacionesModal: false,
      singleContent: 'asdasd',
      currentPage: 1,
      perPage: 10,
      fields: [
        {
          key: 'nroTramite',
          label: 'Número de trámite'
        },
        {
          key: 'tipoSolicitud',
          label: 'Tipo de solicitud',
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
      estados: ['Rechazada','En revisión', 'Rectificación', 'Esperando turno','Esperando inspección','Inspeccionado', 'Esperando documentación', 'Prórroga 1', 'Prórroga 2', 'Finalizada'],
      tiposTramite: ['Habilitación','Baja', 'Renovación', 'Reempadronamiento', 'Cambio de Titular'],
      loading: true,
    };
  },
  async mounted() {
    await this.loadSolicitudes()
  },
  computed: {
    habilitaciones(){
      return useHabilitacionesStore().all
    },
    paginatedItems() {
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

      // Filtrar por N° de Trámite
      if (this.inputNroTramite) {
        items = items.filter(item => {
          return item.nroTramite && String(item.nroTramite).includes(this.inputNroTramite);
        });
      }

      // Filtrar por tipo de solicitud
      if (this.selectedTipo) {
        items = items.filter(item => item.tipoSolicitud === this.selectedTipo);
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
      const admin = useUserStore().admin
      return admin === "comercio" || admin == "master"
    },
    adminMaster() {
      return useUserStore().admin == "master"
    }
  },
  methods: {
    async loadSolicitudes() {
      this.loading = true
      try {
        await useHabilitacionesStore().getAll()
        this.items = this.habilitaciones
        this.items.forEach(item => {
          switch (item.status) {
            case 'En revisión':
              item.estadoColor = 'text-primary';
              break;
            case 'Rectificación':
              item.estadoColor = 'text-lightblue';
              break;
            case 'Inspeccionado':
              item.estadoColor = 'text-lightgreen';
              break;
            case 'Rechazada':
              item.estadoColor = 'text-danger';
              break;
            case 'Esperando documentación':
              item.estadoColor = 'text-success';
              break;
            case 'Finalizada':
              item.estadoColor = 'text-darkgreen';
              break;
            default:
              item.estadoColor = 'text-secondary';
          }
        });
        useHabilitacionesStore().ordenarHabilitaciones()
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
    async generarExcelTramitesNoFinalizados() {
      try {
        // Obtenemos todos los trámites del store o de una API
        var tramites = []
        await useHabilitacionesStore().getAll()
        tramites = useHabilitacionesStore().all

        ("TRAMITES: ");
        (tramites);
        // Filtramos los trámites que no están finalizados
        const tramitesNoFinalizados = tramites.filter(tramite => tramite.status != "Finalizada" && tramite.status != "Rechazada");
        ("tramitesNoFinalizados:")
        (tramitesNoFinalizados)

        if (tramitesNoFinalizados.length === 0) {
          this.registrarActividad("Descargar trámites no finalizados", "No Hay trámites no finalizados.");
          console.warn('No hay trámites no finalizados.');
          return;
        }

        // Mapeamos los datos necesarios para el Excel
        const datosExcel = tramitesNoFinalizados.map(tramite => ({
          NroTramite: tramite.nroTramite,
          DNI: tramite.dni,
          CUIL: tramite.cuit,
          legajo: tramite.nroLegajo,
          Mail: tramite.mail,
          TipoTramite: tramite.tipoSolicitud,
          Estado: tramite.status,
          FechaCreacion: tramite.createdAt, // Asegúrate de formatear fechas si es necesario
          observaciones: tramite.observaciones,
        }));

        const XLSX = await loadXlsx();

        // Convertimos los datos a una hoja de Excel
        const hojaTramites = XLSX.utils.json_to_sheet(datosExcel);

        // Creamos un libro de Excel y agregamos la hoja
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, hojaTramites, 'Tramites_No_Finalizados');

        // Convertimos el libro a un buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Creamos un Blob para descargar
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        // Usamos FileSaver.js para guardar el archivo
        await saveAsFile(blob, 'Tramites_No_Finalizados.xlsx');

        this.registrarActividad("Descargar trámites no finalizados", "Archivo descargado.");
        ('Archivo generado y descargado con éxito.');
      } catch (error) {
        console.error('Error al generar el Excel de trámites no finalizados:', error);
        this.registrarActividad("Descargar trámites no finalizados", "Error al generar el Excel de trámites no finalizados: " + error);
      }
    },
    onPageChange(newPage) {
      this.currentPage = newPage;
    },
    async onShowObservaciones(id) {
      const habilitacion = useHabilitacionesStore().all.find(habilitacion => habilitacion.id === id);

      // Dividir el texto en líneas en función del guión medio "-" y unirlo con etiquetas <br>
      const observacionesDivididas = habilitacion.observaciones.split('-').join('<br>');

      this.singleContent = observacionesDivididas;
      this.observacionesModal = true;
      this.registrarActividad("Ver Observaciones", "Trámite nro: " + habilitacion.nroTramite);
    },
  },
}
</script>

