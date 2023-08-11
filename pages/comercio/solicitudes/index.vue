<template>
  <div class="page">
    <Banner title="Solicitudes de habilitación" subtitle="Uso interno" />
    <div class="row col-8 mx-auto" v-if="adminComercio">
      <b-form-group class="col-4 mx-auto mt-3" horizontal label-class="text-success h6" label="Filtrar por Estado">
        <b-form-select plain v-model="selectedEstado">
          <option value="">Todos</option>
          <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
        </b-form-select>
      </b-form-group>
      <!-- <b-form-group class="col-4 mx-auto mt-4" horizontal label-class="text-success h6" label="Filtrar por DNI">
        <b-icon-funnel-fill variant="success" />
        <b-form-input v-model="selectedDocumento" @keypress="onSearchByDocumento">
        </b-form-input>
      </b-form-group> -->
    </div>
    <b-table per-page="11" head-row-variant="warning" class="col-10 mx-auto mt-4 shadow-lg" :items="filteredItems" :fields="fields">
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
      lastLength: false,
      items: [],
      selectedEstado: '',
      singleModal: false,
      singleContent: 'asdasd',
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
      estados: ['Rechazada','En revisión', 'Esperando turno','Esperando inspección','Inspeccionado', 'Esperando documentación', 'Finalizada'],
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
        case 'Esperando inspección':
          item.estadoColor = 'estado-secondary';
          break;
        case 'Esperando turno':
          item.estadoColor = 'estado-secondary';
          break;
        case 'Rechazada':
          item.estadoColor = 'estado-danger';
          break;
        case 'Esperando documentación':
          item.estadoColor = 'estado-success';
          break;
        case 'Inspeccionado':
          item.estadoColor = 'estado-success';
          break;
        case 'Finalizada':
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
    },
    filteredItems() {
      if (this.selectedEstado) {
        return this.items.filter(item => item.status == this.selectedEstado);
      } else {
        return this.items; // Sin filtro, mostrar todos los elementos
      }
    },
    adminComercio() {
      return this.$store.state.user.admin === "comercio"
    }
  },
  methods: {
    loadMore() {
      this.$fetch()
    },
    async onShowObservaciones(id){
      const habilitacion = this.$store.state.habilitaciones.all.filter(habilitacion => habilitacion.id === id)
      this.singleContent = habilitacion[0].observaciones
      this.$fetch()
      this.singleModal = true
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
