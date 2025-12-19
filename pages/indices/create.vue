<template>
  <div class="page main-background">
    <Banner title="Índices"></Banner>
    <div class="container col-md-4 col-sm-10 card shadow-card my-5">
      <div class="col ml-5 mt-5">
        <h4>
          <b-icon-arrow-down-left-square class="icon-orange" /> |
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
          <b-btn variant="success" class="mx-2" type="submit">Crear índice</b-btn>
          <b-btn variant="secondary" @click="goBack">Volver</b-btn>
        </b-row>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
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
  async fetch() {
    await this.$store.dispatch('categorias/getAll')
    this.categorias = this.$store.state.categorias.all
    // await this.$store.dispatch('tags/getTags')
  },
  fetchOnServer: false,
  methods: {
    async onSubmitCreateFile() {
    try {
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('indices/create', {
        userToken,
        indice: {
          año: this.año,
          mes: this.mes,
          categoria: this.categoria.id,
          valor: this.valor,
        },
      })
      this.$bvToast.toast('Creado correctamente', {
        title: 'Creada',
        variant: 'success',
        appendToast: true,
        solid: true,
      })
      await this.$router.push('/')
      } catch (e) {
        this.$bvToast.toast('Error Cargando el índice', {
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

