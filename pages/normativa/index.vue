<template>
  <div class="page main-background">
    <Banner title="Normativa"/>
    <div class="mt-5">
      <div class="row justify-content-center">
        <NuxtLink to="/normativa/comercio" class="col-md-5">
          <b-button variant="outline" class="d-flex align-items-center w-100 white shadow-card">
            <div class="me-3">
              <b-icon-shop class="mx-3 my-3 landing-icon" />
            </div>
            <div class="col text-left my-auto">
              <h3 class="landing-text"><b> Digesto Comercial </b></h3>
              <h6>Normativa vigente para los comercios de Villa Gesell</h6>
            </div>
          </b-button>
        </NuxtLink>
      </div>
      <div class="row justify-content-center mt-5">
        <NuxtLink to="/normativa/obras" class="col-md-5">
          <b-button variant="outline" class="d-flex w-100 white shadow-card">
            <div class="me-3">
              <ObraIcon class="my-3 obra-icon"/>
            </div>
            <div class="col text-left my-auto">
              <h3 class="landing-text"><b> Normativa de Obras Públicas </b></h3>
              <h6>Normativa vigente para Obras Públicas de la localidad de Villa Gesell</h6>
            </div>
          </b-button>
        </NuxtLink>
      </div>
    </div>
    <div class="text-center m-4 float-lg-end">
      <NuxtLink to="/">
        <b-button variant="primary"> Volver </b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    adminHacienda() {
      return this.$store.state.user.admin == "hacienda" || this.$store.state.user.admin == "master";
    }
  }
};
</script>

<style scoped>
.landing-icon {
  width: 60px;
  height: 60px;
  color: #ef8918;
  transition: transform 0.2s ease;
}
/* Aplicar escala al hacer hover en el ícono */
.landing-icon:hover {
  transform: scale(1.15);
}
.obra-icon{
  padding-left: 8px;
  color:#ef8918;
  transition: transform 0.2s ease; /* Cambia la duración a medio segundo (0.5s) */
}
/* Aplicar escala al hacer hover en el ícono */
.obra-icon:hover {
  transform: scale(1.15); /* Ajusta el valor según desees el efecto de escala */
}

.col{
  margin: 16px;
}

</style>
