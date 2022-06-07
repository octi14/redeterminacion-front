<template>
  <div class="page">
    <div class="container text-center my-3 mx-auto">
      <h5> Buscar índice </h5>
      <b-form class="col-md-5 mx-auto">
        <b-text class="h6"> Mes </b-text>
        <b-form-input type="number"> </b-form-input>
        <b-text class="h6"> Año </b-text>
        <b-form-input type="number"> </b-form-input>
        <b-text class="h6"> Categoria </b-text>
        <b-form-select v-model="categoria" class="mb-3">
          <b-form-select-option
          v-for="categoria in categorias"
          :key="categoria.id"
          :value="categoria">{{categoria.nombre}}</b-form-select-option>
        </b-form-select>
        <b-button type="submit" variant="primary"> Buscar </b-button>
        <b-button variant="warning">
          <NuxtLink style="color: black" to="/indices/menu"> Volver </NuxtLink>
        </b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return{
      categorias: [],
    }
  },
  async fetch() {
    await this.$store.dispatch('categorias/getAll')
    this.categorias = this.$store.state.categorias.all
  },
}
</script>
