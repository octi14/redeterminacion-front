<template>
  <div class="page main-background">
    <Banner title="Solicitudes de habilitación" subtitle="Uso interno" />
    <div class="col-8 mx-auto" v-if="adminComercio">
      <b-form-group class="col-8 mx-auto mt-4" label-class="text-success h6" label="Filtrar por Estado">
        <b-form-select plain v-model="selectedEstado">
          <option value="">Todos</option>
          <option v-for="estado in estados" :value="estado" :key="estado">{{ estado }}</option>
        </b-form-select>
      </b-form-group>
      <b-form-checkbox class="text-center" v-model="hideFinalizados">Ocultar Finalizados/Rechazados</b-form-checkbox>
      <!-- <b-form-group class="col-4 mx-auto mt-4" horizontal label-class="text-success h6" label="Filtrar por DNI">
        <b-icon-funnel-fill variant="success" />
        <b-form-input v-model="selectedDocumento" @keypress="onSearchByDocumento">
        </b-form-input>
      </b-form-group> -->
    </div>

    <b-table per-page="10" head-row-variant="warning" class="col-md-10 white col-sm-8 mx-auto mt-4 shadow-card" :items="paginatedItems" :fields="fields">
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
        <b-button v-if="row.item.observaciones && row.item.observaciones != ''" @click="onShowObservaciones(row.item.id)" variant="outline-primary" size="sm" title="Observaciones">
          <b-icon-eye/>
        </b-button>
      </template>
    </b-table>
    <b-pagination class="mt-4" :total-rows="items.length" :per-page="perPage" v-model="currentPage" align="center" @input="onPageChange"></b-pagination>

    <b-modal v-model="singleModal" header-bg-variant="primary" title="Observaciones" title-class="text-light" hide-footer centered>
      <p v-html="singleContent"></p>
    </b-modal>
  </div>
</template>

<script>
export default{
  data() {
    return {
      hideFinalizados: false,
      lastLength: false,
      items: [],
      selectedEstado: '',
      singleModal: false,
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
      estados: ['Rechazada','En revisión', 'Esperando turno','Esperando inspección','Inspeccionado', 'Esperando documentación', 'Prórroga 1', 'Prórroga 2', 'Finalizada'],
    }
  },
  async fetch() {
    await this.$store.dispatch('habilitaciones/getAll')
    this.items = this.habilitaciones

    // Asignar el color adecuado según el estado
    this.items.forEach(item => {
      switch (item.status) {
        case 'En revisión':
          item.estadoColor = 'text-primary';
          break;
        case 'Rectificación':
          item.estadoColor = 'text-lightblue';
          break;
        case 'Esperando turno':
          item.estadoColor = 'text-secondary';
          break;
        case 'Esperando inspección':
          item.estadoColor = 'text-secondary';
          break;
        case 'Prórroga 1':
          item.estadoColor = 'text-secondary';
          break;          
        case 'Prórroga 2':
          item.estadoColor = 'text-secondary';
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
          item.estadoColor = 'text-primary';
      }
    });
    this.$store.commit('habilitaciones/ordenarHabilitaciones')

    const perPage = 10;
  },
  computed: {
    habilitaciones(){
      return this.$store.state.habilitaciones.all
    },
    paginatedItems() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;

      if (this.selectedEstado) {
        return this.items.filter((item) => {
          if (this.hideFinalizados) {
            return item.status === this.selectedEstado && !["Rechazada", "Finalizada"].includes(item.status);
          } else {
            return item.status === this.selectedEstado;
          }
        }).slice(startIndex, endIndex);
      } else {
        return this.items.filter((item) => {
          if (this.hideFinalizados) {
            return !["Rechazada", "Finalizada"].includes(item.status);
          } else {
            return true;
          }
        }).slice(startIndex, endIndex);
      }
    },
    filteredItems() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;

      if (this.selectedEstado) {
        return this.items.filter(item => item.status == this.selectedEstado).slice(startIndex, endIndex);
      } else {
        return this.items.slice(startIndex, endIndex); // Sin filtro, mostrar elementos paginados
      }
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.perPage);
    },
    adminComercio() {
      return this.$store.state.user.admin === "comercio"
    }
  },
  methods: {
    onPageChange(newPage) {
      this.currentPage = newPage;
    },
    async onShowObservaciones(id) {
      const habilitacion = this.$store.state.habilitaciones.all.find(habilitacion => habilitacion.id === id);

      // Dividir el texto en líneas en función del guión medio "-" y unirlo con etiquetas <br>
      const observacionesDivididas = habilitacion.observaciones.split('-').join('<br>');

      this.singleContent = observacionesDivididas;
      this.singleModal = true;
    },
  },
}
</script>
