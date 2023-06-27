<template>
  <div>
    <Banner title="Secretaría de Hacienda" subtitle="Municipalidad de Villa Gesell" />
    <div>
      <div class="text-center"  border-variant="light">
        <NuxtLink to="/compras">
          <b-button variant="outline" class="mt-5 mx-3">
            <b-icon-wallet class="mb-3 h1 landing-icon"/>
            <h5 style="color:green"><b> Compras </b></h5>
          </b-button>
        </NuxtLink>
        <NuxtLink to="/comercio/menu">
          <b-button variant="outline" class="mt-5 mx-3">
            <b-icon-pen class="mb-3 h1 landing-icon" />
            <h5 style="color:green"><b> Habilitaciones <br> comerciales </b></h5>
          </b-button>
        </NuxtLink>
        <NuxtLink to="/turnos">
          <b-button variant="outline" class="mt-5 mx-3">
            <b-icon-clock class="mb-3 h1 landing-icon" />
            <h5 style="color:green"><b> Turnos <br> inspección </b></h5>
          </b-button>
        </NuxtLink>
        <br>
        <NuxtLink v-if="adminHacienda" to="/redeterminacion">
          <b-button variant="outline" class="mt-5 mx-3">
            <b-icon-calculator class="mb-3 h1 landing-icon" />
            <h5 style="color:green"><b> Redeterminación </b></h5>
          </b-button>
        </NuxtLink>
        <NuxtLink to="/ordenanzas">
          <b-button variant="outline" class="mt-5 mx-3">
            <b-icon-receipt class="mb-3 h1 landing-icon" />
            <h5 style="color:green"><b> Ordenanzas <br> vigentes </b></h5>
          </b-button>
        </NuxtLink>
        <NuxtLink to="/modernizacion">
          <b-button variant="outline" class="mt-5 mx-3">
            <b-icon-list-task class="mb-3 h1 landing-icon"/>
            <h5 style="color:green"><b> Modernización </b></h5>
          </b-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
    adminHacienda(){
      return this.$store.state.user.admin == "hacienda"
    }
  },
  methods: {
  },
}
</script>

<style>
.landing-icon{
  width: 80px;
  height: 80px;
  color:#145314db
}
</style>
