<template>
  <div class="page">
    <Banner title="Solicitudes de habilitación" subtitle="Uso interno" />
    <b-table per-page="10" head-row-variant="success" class="col-10 mx-auto mt-4 shadow-lg" hover :items="items" :fields="fields">
      <!-- Plantilla personalizada para la columna "detalles" -->
      <template #cell(status)="row">
        <div :class="row.item.estadoColor"><b>{{ row.value }}</b></div>
      </template>
      <template #cell(detalles)="row">
        <NuxtLink :to="{ name: 'comercio-solicitudes-id', params: { id: row.item.id } }">
          <b-button variant="outline-secondary" size="sm" title="Editar">
            <b-icon-pen/>
          </b-button>
        </NuxtLink>
      </template>
      <template #cell(observaciones)="row">
        <NuxtLink :to="{ name: 'comercio-solicitudes-id', params: { id: row.item.id } }">
          <b-button variant="outline-primary" size="sm" title="Observaciones">
            <b-icon-eye/>
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
          key: 'tipoSolicitud',
          label: 'Tipo de solicitud',
        },
        {
          key: 'createdAt',
          label: 'Fecha de solicitud',
        },
        {
          key: 'dni',
          label: 'DNI',
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
    }
  },
  async fetch() {
    await this.$store.dispatch('habilitaciones/getAll')
    this.items = this.habilitaciones

    // Asignar el color adecuado según el estado
    this.items.forEach(item => {
      switch (item.status) {
        case 'En revisión':
          item.estadoColor = 'estado-primary';
          break;
        case 'Pendiente de inspección':
          item.estadoColor = 'estado-secondary';
          break;
        case 'Rechazada':
          item.estadoColor = 'estado-danger';
          break;
        case 'Aprobada':
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
    habilitaciones(){
      return this.$store.state.habilitaciones.all
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
    verDetalles(name) {
      console.log(name);
    },
  },
}
</script>
