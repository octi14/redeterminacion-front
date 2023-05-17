<template>
  <div class="multimedia-form">
    <h5 class="text-center">Crear archivo</h5>
    <b-form class="my-3 col-md-5 mx-auto justify-content-center" @submit.stop.prevent="onSubmitCreateFile" @reset="volver">
      <b-form-group>
          <b-form-group label="Título">
            <b-form-input v-model="nombre" type="text" />
          </b-form-group>
          <b-form-group label="Link">
            <b-form-input v-model="link" type="text" />
          </b-form-group>
      </b-form-group>
      <b-form-text class="h6"> Categoría </b-form-text>
      <b-form-select v-model="categoria" class="mb-3">
      <b-form-select-option
        v-for="categoria in categorias"
        :key="categoria.id"
        :value="categoria">{{categoria.nombre}}</b-form-select-option>
      </b-form-select>
      <b-btn type="submit" size="sm" variant="success">Crear</b-btn>
      <b-btn type="reset" size="sm">Volver</b-btn>
    </b-form>
  </div>
</template>

<script>
export default {
  middleware: ['authenticated'],
  data() {
    return {
      nombre: '',
      link: '',
      categoria: null,
      categorias: [],
    }
  },
  async fetch() {
    await this.$store.dispatch('multimediacategorias/getAll')
    this.categorias = this.$store.state.multimediacategorias.all
    console.log(this.categorias)
  },
  // fetchOnServer: false,
  methods: {
    volver(){
      this.$emit('reset')
    },
    async onSubmitCreateFile() {
    try {
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('multimedias/create', {
        userToken,
        multimedia: {
          nombre: this.nombre,
          link: this.link,
          categoria: this.categoria.id,
        },
      })
      this.$bvToast.toast('Creado correctamente', {
        title: 'Creado',
        variant: 'success',
        appendToast: true,
        solid: true,
      })
      this.$emit('submit')
      await this.$router.push('/')
      } catch (e) {
        this.$bvToast.toast('Error Cargando el archivo', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
  },
}
</script>

<style type="text/css"></style>
