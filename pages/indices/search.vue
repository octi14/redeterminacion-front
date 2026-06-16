<template>
  <div class="page main-background">
    <Banner title="Índices"/>
    <div class="container col-md-4 col-sm-8 card shadow-card my-5 mx-auto">
      <div class="col ml-5 mt-5">
        <h4>
          <b-icon-search class="icon-orange" /> |
          <b class="landing-text"> Buscar índice </b>
        </h4>
      </div>
      <hr class="col-9 mx-auto"/>
      <b-form class="col-md-10 mb-4 mx-auto text-left" @submit.stop.prevent="onSearchIndex">
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
        <b-row class="justify-content-center mt-2">
          <b-button type="submit" class="mx-2" variant="success"> Buscar </b-button>
          <b-button variant="secondary" @click="goBack">
            Volver
          </b-button>
        </b-row>
      </b-form>
      <div class="my-2" v-if="result">
        <h4> Valor de índice: {{result}} </h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return{
      mes: null,
      año: null,
      categoria: null,
      categorias: [],
      result: null,
    }
  },
  async fetch() {
    await this.$store.dispatch('categorias/getAll')
    this.categorias = this.$store.state.categorias.all
  },
  methods: {
    async onSearchIndex(){
      await this.$store.dispatch('indices/searchSingle', {
        mes: this.mes,
        año: this.año,
        categoria: this.categoria,
      })
      this.result = this.$store.state.indices.single.valor
    },
    async goBack(){
      await this.$router.push('/obras')
    }
  }

}
</script>

