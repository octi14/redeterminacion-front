<template>
  <div class="page">
    <Banner title="Solicitudes de turnos" subtitle="Uso interno" />
    <b-table per-page="10" head-row-variant="success" class="col-10 mx-auto mt-4 shadow-lg" hover :items="items" :fields="fields">
      <!-- Plantilla personalizada para la columna "detalles" -->
      <template #cell(detalles)="row">
      <NuxtLink :to="{ name: 'comercio-solicitudes-id', params: { id: row.item.id } }">
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
          key: 'dia',
          label: 'Fecha',
        },
        {
          key: 'horario',
          label: 'Horario',
        },
        {
          key: 'dni',
          label: 'DNI',
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
    verDetalles(name) {
      console.log(name);
    },
  },
}
</script>
