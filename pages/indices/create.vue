<template>
  <div class="page">
    <div class="container my-5">
      <h4 class="text-center">Crear índice</h4>
      <b-form class="my-3 col-md-5 mx-auto justify-content-center" @submit.stop.prevent="onSubmitCreateFile">
        <b-form-group>
            <b-form-group label="Año">
              <b-form-input v-model="año" type="text" />
            </b-form-group>
            <b-form-group label="Mes">
              <b-form-input v-model="mes" type="text" />
            </b-form-group>
            <b-form-text class="h6"> Categoría </b-form-text>
            <b-form-select v-model="categoria" class="mb-3">
              <b-form-select-option
              v-for="categoria in categorias"
              :key="categoria.id"
              :value="categoria">{{categoria.nombre}}</b-form-select-option>
            </b-form-select>
            <b-form-group label="Valor">
              <b-form-input v-model="valor" type="float" />
            </b-form-group>
        </b-form-group>
          <hr />
        <b-btn variant="success" style="color: black" type="submit">Crear índice</b-btn>
        <b-btn variant="info">
        <NuxtLink style="color: black" to="/indices/menu"> Volver </NuxtLink>
        </b-btn>
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
      await this.$router.push('/indices/menu')
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
  },
}
</script>

<style type="text/css"></style>
