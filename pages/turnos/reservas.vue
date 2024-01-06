<template>
  <div class="page main-background">
    <Banner title="Solicitudes de turnos" subtitle="Uso interno" />
    <b-form-group class="col-4 mx-auto mt-3" horizontal label-class="text-success h6" label="Filtrar por Estado">
      <b-form-select plain v-model="selectedEstado">
        <option value="">Todos</option>
        <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
      </b-form-select>
    </b-form-group>
    <b-form-checkbox class="text-center" v-model="hideFinalizados">Ocultar Inspeccionados/Cancelados</b-form-checkbox>

    <b-table per-page="10" head-row-variant="primary" class="col-md-10 col-sm-8 mx-auto mt-4 shadow-card white" hover :items="paginatedItems" :fields="fields">
      <template #cell(status)="row">
        <div :class="row.item.estadoColor"><b>{{ row.value }}</b></div>
      </template>
      <!-- Plantilla personalizada para la columna "detalles" -->
      <template #cell(detalles)="row">
      <NuxtLink :to="{ name: 'turnos-id', params: { id: row.item.id } }">
        <b-button variant="outline-secondary" size="sm" title="Editar">
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

    <b-pagination :total-rows="items.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>

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
      currentPage: 1,
      perPage: 10,
      fields: [
        {
          key: 'nroTramite',
          label: 'Número de trámite',
        },
        {
          key: 'dia',
          label: 'Fecha de inspección',
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

      if (this.selectedEstado) {
        return this.items.filter((item) => {
          if (this.hideFinalizados) {
            return item.status === this.selectedEstado && !["Cancelado", "Inspeccionado"].includes(item.status);
          } else {
            return item.status === this.selectedEstado;
          }
        }).slice(startIndex, endIndex);
      } else {
        return this.items.filter((item) => {
          if (this.hideFinalizados) {
            return !["Cancelado", "Inspeccionado"].includes(item.status);
          } else {
            return true;
          }
        }).slice(startIndex, endIndex);
      }
    },
    filteredItems() {
      if (this.selectedEstado) {
        return this.items.filter(item => item.status == this.selectedEstado);
      } else {
        return this.items; // Sin filtro, mostrar todos los elementos
      }
    },
  },
  methods: {
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
    },
  },
}
</script>
