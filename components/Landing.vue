<template>
  <div>
    <div class="container text-center">
      <div class="row custom-row">
        <div v-for="(link, index) in links" :key="index" class="col-lg-4 my-4 mx-auto col-md-6 col-sm-12 mb-3">
          <NuxtLink :to="link.to" class="d-block">
            <b-button variant="outline" class="btn-5">
              <b-icon :icon="link.icon" class="mb-4 landing-icon" />
              <h5 class="landing-text"><b>{{ link.title }}</b></h5>
            </b-button>
          </NuxtLink>
        </div>
        <div v-if="adminHacienda" class="col-lg-4 col-md-6 mx-auto my-4 col-sm-12 mb-4">
          <NuxtLink to="/obras" class="d-block">
            <b-button variant="outline" class="btn-5">
              <b-icon-calculator class="mb-4 landing-icon" />
              <h5 class="landing-text"><b> Redeterminación </b></h5>
            </b-button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          to: "/ordenanzas",
          icon: "receipt",
          title: "Digesto comercial"
        },
        {
          to: "/comercio",
          icon: "pen",
          title: "Habilitaciones comerciales"
        },
        {
          to: "/turnos",
          icon: "clock",
          title: "Turnos inspección"
        },
        {
          to: "/modernizacion",
          icon: "list-ul",
          title: "Modernización"
        },
        {
          to: "/consulta_tramite",
          icon: "search",
          title: "Consulta estado de trámite"
        },
        {
          to: "/abierto_anual",
          icon: "shop",
          title: "Comercio Abierto anual"
        },
        {
          to: "/compras",
          icon: "briefcase",
          title: "Compras"
        }
      ]
    };
  },
  computed: {
    adminHacienda(){
      return this.$store.state.user.admin == "hacienda" || this.$store.state.user.admin == "master"
    }
  }
}
</script>

<style>
.landing-icon{
  margin-top: 20px;
  width: 80px;
  height: 80px;
  color:#ef8918;
  transition: transform 0.2s ease; /* Cambia la duración a medio segundo (0.5s) */
}
/* Aplicar escala al hacer hover en el ícono */
.landing-icon:hover {
  transform: scale(1.15); /* Ajusta el valor según desees el efecto de escala */
}
.custom-row {
  padding-top:10px;
  max-width: 800px; /* Ajusta el ancho máximo deseado */
  margin-left: auto;
  margin-right: auto;
}
</style>
