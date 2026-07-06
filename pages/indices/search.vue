<template>
  <div class="page main-background">
    <Banner title="Índices"/>
    <div class="container col-md-4 col-sm-8 card shadow-card my-5 mx-auto">
      <div class="col ml-5 mt-5">
        <h4>
          <i class="bi bi-search"></i> |
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
          <b-button variant="primary" size="sm" class="page-btn-volver" @click="goBack">Volver</b-button>
        </b-row>
      </b-form>
      <div class="my-2" v-if="result">
        <h4> Valor de índice: {{result}} </h4>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  adminRoles: ['hacienda', 'master'],
})
</script>

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
  async mounted() {
    await useCategoriasStore().getAll()
    this.categorias = useCategoriasStore().all
  },
  methods: {
    async onSearchIndex(){
      await useIndicesStore().searchSingle({
        mes: this.mes,
        año: this.año,
        categoria: this.categoria,
      })
      this.result = useIndicesStore().single?.valor
    },
    async goBack(){
      await this.$router.push('/obras')
    }
  }

}
</script>

