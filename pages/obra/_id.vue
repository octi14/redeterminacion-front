<template>
  <div class="page">
    <template v-if="obra">
      <!-- <img
        v-if="recipe.image"
        :src="recipe.image"
        :alt="recipe.name"
        style="
          display: block;
          height: 100%;
          max-height: 50vh;
          width: 100%;
          object-fit: cover;
        "
      /> -->
      <div class="container my-5">
        <div class="row">
          <div class="col">
            <h1 class="h2 text-center">{{ obra.objeto }}</h1>
            <p class="lead">{{ obra.adjudicado }}</p>
            <!-- <h2 class="h3">Instrucciones</h2>
            <template v-for="(step, index) in recipe.instructions">
              <div
                :key="step.description"
                class="recipe-step my-2 py-2 border-bottom"
              >
                <h3 class="h4 py-2 sticky-top bg-white">
                  Paso {{ index + 1 }}{{ step.title ? `: ${step.title}` : '' }}
                </h3>
                <div class="recipe-step-content">
                  <b-img v-if="step.image" fluid-grow :src="step.image" />
                  <p>{{ step.description }}</p>
                </div>
              </div>
            </template> -->
          </div>
          <div class="col-12 col-lg-4">
            <b-card class="mb-2 sticky-top">
              <h2 class="lead">Ficha Técnica</h2>
              <p>
                Fecha de contrato: {{ formattedDate }}
              </p>
            </b-card>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ObraService from '~/service/obra'

export default {
  data() {
    return {
      obra: null,
    }
  },
  async fetch() {
    const obraId = this.$route.params.id
    this.obra = await ObraService.getSingle(this.$axios, {
      id: obraId,
    })
  },
  fetchOnServer: false,
  computed: {
    formattedDate() {
      const formatter = new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
      return formatter.format(this.obra.fecha_contrato)
    },
  },
}
</script>

<style type="text/css"></style>
