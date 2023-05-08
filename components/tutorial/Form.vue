<template>
  <div class="tutorial-form">
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
    }
  },
  // async fetch() {
  // },
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
        },
      })
      this.$bvToast.toast('Creado correctamente', {
        title: 'Creado',
        variant: 'success',
        appendToast: true,
        solid: true,
      })
      this.$emit('submit')
      await this.$router.push('/repositorio')
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
