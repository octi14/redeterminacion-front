<template>
  <div class="page main-background">
    <Banner title="Solicitudes de trámite" subtitle="Uso interno" />
    <div class="internal-use-toolbar internal-use-wide" v-if="adminComercio">
      <!-- Filtros y búsqueda en una sola línea -->
      <b-row class="align-items-end mt-4">
        <b-form-group class="col mt-0 mb-0" label-class="text-success h6">
          <label for="inputNroTramite" class="bv-no-focus-ring col-form-label pt-0 text-success h6">
            <i class="bi bi-search"></i> Buscar por N° de Trámite
          </label>
          <b-form-input
            id="inputNroTramite"
            v-model="inputNroTramite"
            placeholder="Ingresá el número de trámite"
            type="text"
          />
        </b-form-group>
        <b-form-group class="col mt-0 mb-0" label-class="text-success h6">
          <label for="inputCUIT" class="bv-no-focus-ring col-form-label pt-0 text-success h6">
            <i class="bi bi-search"></i> Buscar por CUIT
          </label>
          <b-form-input
            id="inputCUIT"
            v-model="inputCUIT"
            placeholder="Ingresá el CUIT"
            type="text"
          />
        </b-form-group>
        <b-form-group class="col mt-0 mb-0" label-class="text-success h6">
          <label for="inputNombre" class="bv-no-focus-ring col-form-label pt-0 text-success h6">
            <i class="bi bi-search"></i> Buscar por nombre
          </label>
          <b-form-input
            id="inputNombre"
            v-model="inputNombre"
            placeholder="Ingresá el nombre o nombre de fantasía"
            type="text"
          />
        </b-form-group>
        <b-form-group class="col mt-0 mb-0" label-class="text-success h6">
          <label for="selectedEstado" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><i class="bi bi-funnel-fill"></i> Filtrar por Estado</label>
          <b-form-select plain v-model="selectedEstado">
            <option value="">Todos</option>
            <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
          </b-form-select>
        </b-form-group>
        <b-form-group class="col mt-0 mb-0" label-class="text-success h6">
          <label for="selectedTipo" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><i class="bi bi-funnel-fill"></i> Filtrar por tipo de trámite</label>
          <b-form-select plain v-model="selectedTipo">
            <option value="">Todos</option>
            <option v-for="tipoTramite in tiposTramite" :value="tipoTramite" :key="tipoTramite">{{ tipoTramite }}</option>
          </b-form-select>
        </b-form-group>
      </b-row>
      <div class="internal-use-checkbox-row">
        <b-form-checkbox v-model="hideFinalizados">Ocultar Finalizados/Rechazados</b-form-checkbox>
      </div>
      <div class="page-btn-export-wrap">
        <b-button variant="success" size="sm" class="page-btn-export" v-if="jefeComercio" @click="generarExcelTramitesNoFinalizados"> Exportar a Excel</b-button>
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
      class="internal-use-table internal-use-wide white mt-4 shadow-card"
      :items="paginatedItems"
      :fields="fields"
      :busy="loading"
    >
      <template #table-busy>
        <LoadingState text="Cargando..." variant="primary" />
      </template>
      <!-- Plantilla personalizada para la columna "detalles" -->
      <template #cell(nroTramite)="row">
        <span>{{ row.value }}</span>
        <span v-if="adminMaster && row.item.visible === false" title="Trámite invisible para no administradores">
          <i class="bi bi-eye-slash"></i>
        </span>
      </template>
      <template #cell(status)="row">
        <div :class="row.item.estadoColor"><b>{{ row.value }}</b></div>
      </template>
      <template #cell(nombreFantasia)="row">
        <span :title="row.value">{{ (row.value && row.value.length > 50) ? row.value.slice(0, 50) + '...' : row.value }}</span>
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
    <b-pagination v-if="!loading" class="internal-use-pagination internal-use-wide mt-4" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>

    <BModal v-model="observacionesModal" header-bg-variant="primary" title="Observaciones" title-class="text-light" no-footer centered>
      <p v-html="singleContent"></p>
    </BModal>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { saveAsFile } from '~/utils/saveAsFile';

export default{
  setup(){ const { showToast } = useProjectToast(); return { showToast } },
  data() {
    return {
      hideFinalizados: false,
      lastLength: false,
      inputNroTramite: "", // Variable de búsqueda por número de trámite
      inputCUIT: "",
      inputNombre: "",
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
          key: 'nombreFantasia',
          label: 'Nombre de fantasía',
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

      if (!this.adminMaster) {
        items = items.filter(item => item.visible !== false);
      }

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

      // Filtrar por nombre (nombre de fantasía)
      if (this.inputNombre && this.inputNombre.trim()) {
        const nombreBusqueda = this.inputNombre.trim().toLowerCase();
        items = items.filter(item => {
          const nombre = item.nombreFantasia ? String(item.nombreFantasia).toLowerCase() : '';
          return nombre.includes(nombreBusqueda);
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
      return admin === "comercio" || admin === "master"
    },
    adminMaster() {
      const userStore = useUserStore()
      return userStore.admin === "master" || userStore.username === "gracielabularte@gesell.gob.ar"
    },
    jefeComercio() {
      const userStore = useUserStore()
      return userStore.username === "nataliamegias@gesell.gob.ar" ||
      userStore.username === "gracielabularte@gesell.gob.ar" || userStore.admin === "master"
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
        // Obtenemos todos los trámites del store
        await useHabilitacionesStore().getAll()
        const tramites = useHabilitacionesStore().all

        // Filtramos los trámites que no están finalizados
        const tramitesNoFinalizados = tramites.filter(tramite =>
          tramite.status !== "Finalizada" && tramite.status !== "Rechazada"
        );

        if (tramitesNoFinalizados.length === 0) {
          this.registrarActividad("Descargar trámites no finalizados", "No hay trámites no finalizados.");
          this.showToast('No hay trámites no finalizados para exportar', {
            title: 'Información',
            variant: 'info',
            solid: true
          });
          return;
        }

        // Mapeamos los datos necesarios para el Excel
        const datosExcel = tramitesNoFinalizados.map(tramite => ({
          'Número de Trámite': tramite.nroTramite || '',
          'DNI': tramite.dni || '',
          'CUIT': tramite.cuit || '',
          'Legajo': tramite.nroLegajo || '',
          'Email': tramite.mail || '',
          'Tipo de Trámite': tramite.tipoSolicitud || '',
          'Estado': tramite.status || '',
          'Fecha de Creación': tramite.createdAt || '',
          'Observaciones': tramite.observaciones || '',
        }));

        // Convertimos los datos a una hoja de Excel
        const hojaTramites = XLSX.utils.json_to_sheet(datosExcel);

        // Ajustamos el ancho de las columnas
        const columnas = Object.keys(datosExcel[0]);
        const anchos = columnas.map(col => ({ wch: Math.max(col.length, 15) }));
        hojaTramites['!cols'] = anchos;

        // Creamos un libro de Excel y agregamos la hoja
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, hojaTramites, 'Trámites_No_Finalizados');

        // Convertimos el libro a un buffer
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Creamos un Blob para descargar
        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Usamos FileSaver.js para guardar el archivo
        const fecha = new Date().toISOString().split('T')[0];
        const nombreArchivo = `Tramites_No_Finalizados_${fecha}.xlsx`;
        await saveAsFile(blob, nombreArchivo);

        this.registrarActividad("Descargar trámites no finalizados", `Archivo descargado: ${nombreArchivo}`);

        this.showToast('Archivo Excel generado exitosamente', {
          title: 'Éxito',
          variant: 'success',
          solid: true
        });
      } catch (error) {
        this.registrarActividad("Descargar trámites no finalizados", "Error al generar el Excel: " + error.message);

        this.showToast('Error al generar el archivo Excel', {
          title: 'Error',
          variant: 'danger',
          solid: true
        });
      }
    },
    onPageChange(newPage) {
      this.currentPage = newPage;
    },
    async onShowObservaciones(id) {
      const habilitacion = useHabilitacionesStore().all.find(habilitacion => habilitacion.id === id);
      if (!habilitacion) {
        this.showToast('No se encontraron observaciones para este trámite.', {
          title: 'Información',
          variant: 'info',
          solid: true,
        });
        return;
      }

      // Dividir el texto en líneas en función del guión medio "-" y unirlo con etiquetas <br>
      const observacionesDivididas = (habilitacion.observaciones || 'No hay observaciones para mostrar.').split('-').join('<br>');

      this.singleContent = observacionesDivididas;
      this.observacionesModal = true;
      this.registrarActividad("Ver Observaciones", "Trámite nro: " + habilitacion.nroTramite);
    },
  },
}
</script>
