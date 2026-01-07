<template>
  <div class="page main-background">
    <Banner title="Solicitudes de turnos" subtitle="Uso interno" />
    <div v-if="adminComercio || adminInspeccion">
      <div class="row justify-content-center">
        <b-form-group class="col-4 mx-auto mt-3" horizontal label-class="text-success">
          <label for="selectedEstado" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><b-icon-funnel-fill></b-icon-funnel-fill> Filtrar por Estado</label>
            <b-form-select plain v-model="selectedEstado">
            <option value="">Todos</option>
            <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
          </b-form-select>
        </b-form-group>

        <b-form-group class="col-4 mx-auto mt-3" horizontal label-class="text-success">
          <label for="selectedTipoTramite" class="bv-no-focus-ring col-form-label pt-0 text-success h6"><b-icon-funnel-fill></b-icon-funnel-fill> Filtrar por Tipo de Trámite</label>
            <b-form-select plain v-model="selectedTipoTramite">
            <option value="">Todos</option>
            <option v-for="tipo in tiposTramite" :value="tipo" :key="tipo">{{ tipo }}</option>
          </b-form-select>
        </b-form-group>
      </div>

      <b-form-checkbox class="text-center" v-model="hideFinalizados">Ocultar Inspeccionados/Cancelados</b-form-checkbox>

      <b-table per-page="10" head-row-variant="primary" class="col-md-10 col-sm-8 mx-auto mt-4 shadow-card white" hover :items="filteredItems" :fields="fields" :current-page="currentPage" :sort-compare="onSortCompare">
        <template #cell(status)="row">
          <div :class="row.item.estadoColor"><b>{{ row.value }}</b></div>
        </template>
        <!-- Plantilla personalizada para la columna "detalles" -->
        <template #cell(detalles)="row">
        <NuxtLink :to="{ name: 'comercio-turnos-id', params: { id: row.item.id } }" @click.native="registrarActividad('Abrir Turno', 'Turno nro: ' + row.item.nroTramite)">
          <b-button variant="outline-secondary" size="sm" title="Editar" >
            <b-icon-pen/>
          </b-button>
        </NuxtLink>
        </template>
        <template #cell(observaciones)="row">
          <b-button v-if="row.item.observaciones != ''" @click="onShowObservaciones(row.item.id)" variant="outline-primary" size="sm" title="Observaciones">
            <b-icon-eye/>
          </b-button>
        </template>
      </b-table>

      <b-pagination :total-rows="filteredItems.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>

    </div>

    <b-modal v-model="singleModal" header-bg-variant="primary" :title="'Observaciones: Turno ' + nroObservaciones" title-class="text-light" hide-footer centered>
      <p> {{ singleContent }} </p>
    </b-modal>
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
  async fetch() {
    await this.$store.dispatch('turnos/getAll')
    this.items = this.turnos
    // Asignar el color adecuado según el estado
    this.items.forEach(item => {
      switch (item.status) {
        case 'Pendiente de inspección':
          item.estadoColor = 'text-secondary';
          break;
        case 'Cancelado':
          item.estadoColor = 'estado-danger';
          break;
        case 'Inspeccionado':
          item.estadoColor = 'text-success';
          break;
        case 'Inspección rechazada':
          item.estadoColor = 'estado-danger';
          break;
        default:
          item.estadoColor = 'text-primary';
      }
    });
    await this.$store.commit('turnos/ordenar')
    const perPage = 10;
  },
  computed: {
    turnos(){
      return this.$store.state.turnos.all
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
      return this.$store.state.user.admin == "comercio" || this.$store.state.user.admin == "master"
    },
    adminInspeccion(){
      return this.$store.state.user.admin == "inspeccion" || this.$store.state.user.admin == "master"
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
      const turno = this.$store.state.turnos.all.filter(turno => turno.id === id)
      this.nroObservaciones = turno[0].nroTramite
      this.singleContent = turno[0].observaciones
      this.$fetch()
      this.singleModal = true
      this.registrarActividad("Ver Observaciones", "Trámite nro: " + turno[0].nroTramite);
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
