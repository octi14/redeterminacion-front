<template>
  <div class="page">
    <div class="container my-5">
      <h1>Crear nuevo archivo</h1>
      <!-- <p>Agrega una nueva obra con sus características</p> -->
      <b-form class="my-5" @submit.stop.prevent="onSubmitCreateFile">
        <b-form-group label="Nombre">
          <b-form-input v-model="name" type="text" />
        </b-form-group>
        <b-form-group label="Descripción">
          <b-form-input v-model="description" type="text" />
        </b-form-group>
        <b-form-group label="Presupuesto oficial">
          <b-form-input v-model="budget" type="text" />
        </b-form-group>
        <b-form-group label="Objeto">
          <b-form-input v-model="budget" type="text" />
        </b-form-group>
        <b-form-group label="Cotización">
          <b-form-input v-model="budget" type="text" />
        </b-form-group>
        <!-- <hr />
        <hr /> -->
        <b-btn type="submit">Enviar</b-btn>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['authenticated'],
  data() {
    return {
      name: '',
      description: '',
      budget: '',
      // ingredients: [
      //   {
      //     quantity: '',
      //     ingredient: null,
      //   },
      // ],
      // instructions: [
      //   {
      //     title: null,
      //     description: null,
      //     image: null,
      //   },
      // ],
    }
  },
  async fetch() {
    await this.$store.dispatch('ingredients/getIngredients')
    await this.$store.dispatch('tags/getTags')
  },
  fetchOnServer: false,
  methods: {
    async onSubmitCreateFile() {
      try {
        const userToken = this.$store.state.user.token
        await this.$store.dispatch('obras/create', {
          userToken,
          obra: {
            name: this.name,
            description: this.description,
            budget: this.budget,
          },
        })
        this.$bvToast.toast('Creada correctamente', {
          title: 'Creada',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        await this.$router.push('/')
      } catch (e) {
        this.$bvToast.toast('Error Cargando la Obra', {
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
