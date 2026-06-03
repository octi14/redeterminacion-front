<template>
  <div class="page main-background">
    <Banner title="Solicitudes de turnos" subtitle="Uso interno" />
    <div v-if="adminComercio || adminInspeccion">
      <div class="internal-use-toolbar internal-use-wide">
        <b-row class="align-items-end mt-3">
        <b-form-group class="col-md-6" label-class="text-success h6">
          <label for="selectedEstado" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><i class="bi bi-funnel-fill"></i> Filtrar por Estado</label>
            <b-form-select id="selectedEstado" plain v-model="selectedEstado">
            <option value="">Todos</option>
            <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
          </b-form-select>
        </b-form-group>

        <b-form-group class="col-md-6" label-class="text-success h6">
          <label for="selectedTipoTramite" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><i class="bi bi-funnel-fill"></i> Filtrar por Tipo de Trámite</label>
            <b-form-select id="selectedTipoTramite" plain v-model="selectedTipoTramite">
            <option value="">Todos</option>
            <option v-for="tipo in tiposTramite" :value="tipo" :key="tipo">{{ tipo }}</option>
          </b-form-select>
        </b-form-group>
        </b-row>

        <div class="internal-use-checkbox-row">
          <b-form-checkbox v-model="hideFinalizados">Ocultar Inspeccionados/Cancelados</b-form-checkbox>
        </div>
      </div>

      <b-table per-page="10" head-row-variant="primary" class="internal-use-table internal-use-wide mt-4 shadow-card white" hover :items="filteredItems" :fields="fields" :current-page="currentPage" :sort-compare="onSortCompare" :busy="loading">
        <template #table-busy>
          <LoadingState text="Cargando..." variant="primary" />
        </template>
        <template #cell(status)="row">
          <div :class="row.item.estadoColor"><b>{{ row.value }}</b></div>
        </template>
        <!-- Plantilla personalizada para la columna "detalles" -->
        <template #cell(detalles)="row">
        <NuxtLink :to="{ name: 'comercio-turnos-id', params: { id: row.item.id } }" @click="registrarActividad('Abrir Turno', 'Turno nro: ' + row.item.nroTramite)">
          <b-button variant="outline-secondary" size="sm" title="Editar" >
            <i class="bi bi-pen"></i>
          </b-button>
        </NuxtLink>
        </template>
        <template #cell(observaciones)="row">
          <b-button v-if="row.item.observaciones != ''" @click="onShowObservaciones(row.item.id)" variant="outline-primary" size="sm" title="Observaciones">
            <i class="bi bi-eye"></i>
          </b-button>
        </template>
      </b-table>

      <b-pagination v-if="!loading" class="internal-use-pagination internal-use-wide" :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>

    </div>

    <BModal v-model="singleModal" header-bg-variant="primary" :title="'Observaciones: Turno ' + nroObservaciones" title-class="text-light" no-footer centered>
      <p> {{ singleContent }} </p>
    </BModal>
  </div>
</template>

<script>
export default{
  data() {
    return {
      hideFinalizados: false,
      singleModal: false,
      singleContent: '',
      lastLength: false,
      items: [],
      nroObservaciones: 0,
      selectedEstado: '',
      selectedTipoTramite: '',
      currentPage: 1,
      perPage: 10,
      loading: true,
      fields: [
        {
          key: 'nroTramite',
          label: 'Número de trámite',
          sortable: true,
        },
        {
          key: 'tipoTramite',
          label: 'Tipo de trámite',
        },
        {
          key: 'dia',
          label: 'Fecha de inspección',
          sortable: true,
        },
        {
          key: 'horario',
          label: 'Horario',
        },
        {
          key: 'nombre',
          label: 'Nombre',
        },
        {
          key: 'domicilio',
          label: 'Domicilio',
        },
        {
          key: 'status',
          label: 'Estado',
        },
        {
          key: 'detalles',
        },
        {
          key: 'observaciones',
        },
      ],
      estados: ['Pendiente de inspección','Cancelado', 'Inspeccionado','Prórroga 1','Prórroga 2', 'Inspección rechazada'],
      tiposTramite: ['Habilitación', 'Baja', 'Renovación'], // Agrega los tipos de trámite necesarios
    }
  },
  async mounted() {
    await this.loadReservas()
  },
  computed: {
    turnos(){
      return useTurnosStore().all
    },
    paginatedItems() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;

      return this.items.filter((item) => {
        let estadoMatch = true;
        let tipoTramiteMatch = true;

        if (this.selectedEstado) {
          estadoMatch = item.status === this.selectedEstado;
        }

        if (this.selectedTipoTramite) {
          tipoTramiteMatch = item.tipoTramite === this.selectedTipoTramite; // Ajusta esto según la estructura de tus datos
        }

        if (this.hideFinalizados) {
          return estadoMatch && tipoTramiteMatch && !["Cancelado", "Inspeccionado"].includes(item.status);
        } else {
          return estadoMatch && tipoTramiteMatch;
        }
      }).slice(startIndex, endIndex);
    },
    filteredItems() {
      let items = this.items;

      // Filtrar por estado
      if (this.selectedEstado) {
        items = items.filter(item => item.status === this.selectedEstado);
      }

      // Filtrar por tipo de trámite
      if (this.selectedTipoTramite) {
        items = items.filter(item => item.tipoTramite === this.selectedTipoTramite);
      }

      // Filtrar finalizados si está activo
      if (this.hideFinalizados) {
        items = items.filter(item => !["Cancelado", "Inspeccionado"].includes(item.status));
      }

      return items;
    },
    adminComercio(){
      const admin = useUserStore().admin
      return admin == "comercio" || admin == "master"
    },
    adminInspeccion(){
      const admin = useUserStore().admin
      return admin == "inspeccion" || admin == "master"
    }
  },
  methods: {
    async loadReservas() {
      this.loading = true
      try {
        await useTurnosStore().getAll()
        this.items = this.turnos
        this.items.forEach(item => {
          switch (item.status) {
            case 'Pendiente de inspección':
              item.estadoColor = 'text-secondary'
              break
            case 'Cancelado':
              item.estadoColor = 'estado-danger'
              break
            case 'Inspeccionado':
              item.estadoColor = 'text-success'
              break
            case 'Inspección rechazada':
              item.estadoColor = 'estado-danger'
              break
            default:
              item.estadoColor = 'text-primary'
          }
        })
        useTurnosStore().ordenar()
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
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    async onShowObservaciones(id){
      const turno = useTurnosStore().all.find(turno => turno.id === id)
      if (!turno) {
        this.singleContent = 'No hay observaciones para mostrar.'
        this.nroObservaciones = 0
        this.singleModal = true
        return
      }
      this.nroObservaciones = turno.nroTramite
      this.singleContent = turno.observaciones || 'No hay observaciones para mostrar.'
      this.singleModal = true
      this.registrarActividad("Ver Observaciones", "Trámite nro: " + turno.nroTramite);
    },
    onSortCompare(a, b, key) {
      // Ordenamiento personalizado para campos específicos
      if (key === 'nroTramite') {
        // Ordenar como número
        const numA = Number(a[key]) || 0;
        const numB = Number(b[key]) || 0;
        return numA - numB;
      }
      
      if (key === 'dia') {
        // Convertir fecha DD/MM/YYYY a objeto Date para comparar
        const parseDate = (dateStr) => {
          if (!dateStr) return new Date(0);
          // Asegurarse de que sea string
          const str = String(dateStr).trim();
          const parts = str.split('/');
          if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Los meses en Date son 0-indexed
            const year = parseInt(parts[2], 10);
            // Validar que los valores sean números válidos
            if (isNaN(day) || isNaN(month + 1) || isNaN(year)) {
              return new Date(0);
            }
            const date = new Date(year, month, day);
            // Validar que la fecha sea válida
            if (isNaN(date.getTime())) {
              return new Date(0);
            }
            return date;
          }
          return new Date(0);
        };
        
        const dateA = parseDate(a[key]);
        const dateB = parseDate(b[key]);
        const diff = dateA.getTime() - dateB.getTime();
        return diff;
      }
      
      // Retornar false para usar el ordenamiento por defecto de Bootstrap Vue
      return false;
    },
  },
}
</script>
