<template>
  <div class="page">
    <Banner title="Solicitudes de turnos" subtitle="Uso interno" />
    <b-table per-page="10" head-row-variant="success" class="col-md-10 col-sm-8 mx-auto mt-4 shadow-lg" hover :items="items" :fields="fields">
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
    </b-table>
  </div>
</template>

<script>
export default{
  data() {
    return {
      lastLength: false,
      items: [],
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
        }
      ],
    }
  },
  async fetch() {
    await this.$store.dispatch('turnos/getAll')
    this.items = this.turnos
    // Asignar el color adecuado según el estado
    this.items.forEach(item => {
      switch (item.status) {
        case 'Pendiente':
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
    }
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
  },
}
</script>
