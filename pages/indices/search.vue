<template>
  <div class="page">
    <div class="container text-center my-5 mx-auto">
      <h4> Buscar índice </h4>
      <b-form class="col-md-4 mx-auto" @submit.stop.prevent="onSearchIndex">
        <b-text class="h6"> Mes </b-text>
        <b-form-input type="number" v-model="mes"> </b-form-input>
        <b-text class="h6"> Año </b-text>
        <b-form-input type="number" v-model="año"> </b-form-input>
        <b-text class="h6"> Categoria </b-text>
        <b-form-select v-model="categoria" class="mb-3">
          <b-form-select-option
          v-for="categoria in categorias"
          :key="categoria.id"
          :value="categoria">{{categoria.nombre}}</b-form-select-option>
        </b-form-select>
        <b-button type="submit" variant="primary"> Buscar </b-button>
        <b-button variant="warning">
          <NuxtLink style="color: black" to="/redeterminacion"> Volver </NuxtLink>
        </b-button>
      </b-form>
      <div class="container my-5" v-if="result">
        <h4> Valor de índice </h4>
        <h5> {{result}} </h5>
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
    }
  }

}
</script>
