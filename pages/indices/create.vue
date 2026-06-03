<template>
  <div class="page main-background">
    <Banner title="Índices"></Banner>
    <div class="container col-md-4 col-sm-10 card shadow-card my-5">
      <div class="col ml-5 mt-5">
        <h4>
          <i class="bi bi-arrow-down-left-square"></i> |
          <b class="landing-text"> Crear índice </b>
        </h4>
      </div>
      <hr class="col-9 mx-auto"/>
      <b-form class="my-2 col-md-10 mx-auto justify-content-center" @submit.stop.prevent="onSubmitCreateFile">
        <b-form-group>
            <b-form-group label="Mes"  class="landing-text">
              <b-form-input v-model="mes" type="text" />
            </b-form-group>
            <b-form-group label="Año"  class="landing-text">
              <b-form-input v-model="año" type="text"/>
            </b-form-group>
            <b-form-text class="landing-text"><h6> Categoría </h6> </b-form-text>
            <b-form-select v-model="categoria" class="mb-3">
              <b-form-select-option
              v-for="categoria in categorias"
              :key="categoria.id"
              :value="categoria">{{categoria.nombre}}</b-form-select-option>
            </b-form-select>
            <b-form-group label="Valor" class="landing-text">
              <b-form-input v-model="valor" type="float" />
            </b-form-group>
        </b-form-group>
        <b-row class="justify-content-center mb-3">
          <b-button variant="success" class="mx-2" type="submit">Crear índice</b-button>
          <b-button variant="primary" size="sm" class="page-btn-volver" @click="goBack">Volver</b-button>
        </b-row>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  setup(){ const { showToast } = useProjectToast(); return { showToast } },
  middleware: ['authenticated'],
  data() {
    return {
      año: '',
      mes: '',
      categoria: null,
      valor: '',
      categorias: [],
    }
  },
  async mounted() {
    await useCategoriasStore().getAll()
    this.categorias = useCategoriasStore().all
  },
  methods: {
    async onSubmitCreateFile() {
    try {
      const userToken = useUserStore().token
      await useIndicesStore().create({
        userToken,
        indice: {
          año: this.año,
          mes: this.mes,
          categoria: this.categoria.id,
          valor: this.valor,
        },
      })
      this.showToast('Creado correctamente', {
        title: 'Creada',
        variant: 'success',
        appendToast: true,
        solid: true,
      })
      await this.$router.push('/')
      } catch (e) {
        this.showToast('Error Cargando el índice', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
    addItem() {
      this.items.push({
        item: null,
        monto: null,
      })
    },
    deleteItem(index) {
      this.items.splice(index, 1)
    },
    async goBack(){
      await this.$router.push('/obras')
    }
  },
}
</script>

