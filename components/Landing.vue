<template>
  <div>
    <Banner title="Secretaría de Hacienda" subtitle="Municipalidad de Villa Gesell" />
    <div>
      <div class="text-center" border-variant="light">
        <NuxtLink to="/redeterminacion">
          <b-button pill variant="outline" class="mt-5 mx-3">
            <b-icon-calculator class="mb-3 h1" style="width: 80px; height: 80px; color:green" />
            <h5 style="color:green"><b> Redeterminación </b></h5>
          </b-button>
        </NuxtLink>
        <NuxtLink to="/comercios">
          <b-button pill variant="outline" class="mt-5 mx-3">
            <b-icon-pen class="mb-3 h1" style="width: 80px; height: 80px; color:green" />
            <h5 style="color:green"><b> Habilitaciones Comerciales </b></h5>
          </b-button>
        </NuxtLink>
        <NuxtLink to="/turnos">
          <b-button pill variant="outline" class="mt-5 mx-3">
            <b-icon-clock class="mb-3 h1" style="width: 80px; height: 80px; color:green" />
            <h5 style="color:green"><b> Turnos comercio </b></h5>
          </b-button>
        </NuxtLink>
        <br>
        <NuxtLink to="/ordenanzas">
          <b-button pill variant="outline" class="mt-5 mx-3">
            <b-icon-receipt class="mb-3 h1" style="width: 80px; height: 80px; color:green" />
            <h5 style="color:green"><b> Ordenanzas vigentes </b></h5>
          </b-button>
        </NuxtLink>
        <NuxtLink to="/modernizacion">
          <b-button pill variant="outline" class="mt-5 mx-3">
            <b-icon-list-task class="mb-3 h1" style="width: 80px; height: 80px; color:green" />
            <h5 style="color:green"><b> Modernización </b></h5>
          </b-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
  },
  methods: {
  },
}
</script>

<style>

</style>
