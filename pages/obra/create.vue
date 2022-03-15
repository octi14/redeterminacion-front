<template>
  <div class="page">
    <div class="container my-5">
      <h1>Crear Nueva obra</h1>
      <p>Agrega una nueva obra con sus características</p>
      <b-form class="my-5" @submit.stop.prevent="onSubmitCreateRecipe">
        <b-form-group label="Nombre">
          <b-form-input v-model="name" type="text" />
        </b-form-group>
        <b-form-group label="Descripción">
          <b-form-input v-model="description" type="text" />
        </b-form-group>
        <b-form-group label="Presupuesto inicial">
          <b-form-input v-model="description" type="text" />
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
      image: '',
      tags: [],
      ingredients: [
        {
          quantity: '',
          ingredient: null,
        },
      ],
      instructions: [
        {
          title: null,
          description: null,
          image: null,
        },
      ],
    }
  },
  async fetch() {
    await this.$store.dispatch('ingredients/getIngredients')
    await this.$store.dispatch('tags/getTags')
  },
  fetchOnServer: false,
  methods: {
    async onSubmitCreateRecipe() {
      try {
        const userToken = this.$store.state.user.token
        await this.$store.dispatch('recipes/create', {
          userToken,
          recipe: {
            name: this.name,
            description: this.description,
            image: this.image,
            tags: this.tags,
            ingredients: this.ingredients,
            instructions: this.instructions,
          },
        })
        this.$bvToast.toast('Receta Creada correctamente', {
          title: 'Receta Creada',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        await this.$router.push('/')
      } catch (e) {
        this.$bvToast.toast('Error Cargando la Receta', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
    addIngredient() {
      this.ingredients.push({
        quantity: '',
        ingredient: null,
      })
    },
    deleteIngredient(index) {
      this.ingredients.splice(index, 1)
    },
    addInstruction() {
      this.instructions.push({
        title: null,
        description: null,
        image: null,
      })
    },
    deleteInstruction(index) {
      this.instructions.splice(index, 1)
    },
  },
}
</script>

<style type="text/css"></style>
