<template>
  <div>
    <Banner title="Secretaría de Hacienda" subtitle="Municipalidad de Villa Gesell" />
    <div class="container text-center">
      <div class="row custom-row">
        <div v-for="(link, index) in links" :key="index" class="col-lg-4 mx-auto col-md-6 col-sm-12 mb-3">
          <NuxtLink :to="link.to" class="d-block">
            <b-button variant="outline" class="btn-5">
              <b-icon :icon="link.icon" class="mb-2 landing-icon" />
              <h5 style="color:green"><b>{{ link.title }}</b></h5>
            </b-button>
          </NuxtLink>
        </div>
        <div v-if="adminHacienda" class="col-lg-4 col-md-6 col-sm-12 mb-3">
          <NuxtLink to="/redeterminacion" class="d-block">
            <b-button variant="outline" class="btn-5">
              <b-icon-calculator class="mb-2 landing-icon" />
              <h5 style="color:green"><b> Redeterminación </b></h5>
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
          to: "/comercio/menu",
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
          to: "/compras",
          icon: "briefcase",
          title: "Compras"
        }
      ]
    };
  },
  computed: {
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
    adminHacienda(){
      return this.$store.state.user.admin == "hacienda"
    }
  }
}
</script>

<style>
.landing-icon{
  margin-top: 20px;
  width: 80px;
  height: 80px;
  color:#145314db
}
.custom-row {
  padding-top:60px;
  max-width: 800px; /* Ajusta el ancho máximo deseado */
  margin-left: auto;
  margin-right: auto;
}
</style>
