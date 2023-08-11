<template>
  <div class="page">
    <Banner title="Solicitudes de turnos" subtitle="Uso interno" />
    <b-form-group class="col-4 mx-auto mt-3" horizontal label-class="text-success h6" label="Filtrar por Estado">
      <b-form-select plain v-model="selectedEstado">
        <option value="">Todos</option>
        <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
      </b-form-select>
    </b-form-group>
    <b-table per-page="10" head-row-variant="primary" class="col-md-10 col-sm-8 mx-auto mt-4 shadow-lg" hover :items="filteredItems" :fields="fields">
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

    <b-modal v-model="singleModal" header-bg-variant="primary" title="Observaciones" title-class="text-light" hide-footer centered>
      <p> {{ singleContent }} </p>
    </b-modal>
  </div>
</template>

<script>
export default{
  data() {
    return {
      singleModal: false,
      singleContent: '',
      lastLength: false,
      items: [],
      selectedEstado: '',
      currentPage: 1,
      perPage: 10,
      totalPages: 0,
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
      estados: ['Pendiente de inspección','Cancelado', 'Inspeccionado','Prórroga 1','Prórroga 2'],
    }
  },
  async fetch() {
    await this.$store.dispatch('turnos/getAll')
    this.items = this.turnos
    // Asignar el color adecuado según el estado
    this.items.forEach(item => {
      switch (item.status) {
        case 'Pendiente de inspección':
          item.estadoColor = 'estado-secondary';
          break;
        case 'Cancelado':
          item.estadoColor = 'estado-danger';
          break;
        case 'Inspeccionado':
          item.estadoColor = 'estado-success';
          break;
        default:
          item.estadoColor = 'estado-primary';
      }
    });
    const perPage = 10;
    this.totalPages = Math.ceil(this.items.length / perPage);
  },
  computed: {
    turnos(){
      return this.$store.state.turnos.all
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
    loadMore() {
      this.$fetch()
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
      this.singleContent = turno[0].observaciones
      this.$fetch()
      this.singleModal = true
    },
  },
}
</script>
