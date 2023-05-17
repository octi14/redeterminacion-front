<template>
  <div>
    <Banner title="Secretaría de Hacienda" subtitle="Municipalidad de Villa Gesell" />
    <div>
      <div class="text-center" border-variant="light">
        <NuxtLink to="/redeterminacion">
          <b-button pill variant="success" class="mt-5 mx-3">
            <h5 style="color:white"> Redeterminación </h5>
          </b-button>
        </NuxtLink>
        <NuxtLink to="/comercios">
          <b-button pill variant="success" class="mt-5 mx-3">
            <h5 style="color:white"> Habilitaciones Comerciales </h5>
          </b-button>
        </NuxtLink>
        <NuxtLink to="/turnos">
          <b-button pill variant="success" class="mt-5 mx-3">
            <h5 style="color:white"> Turnos comercio </h5>
          </b-button>
        </NuxtLink>
        <br>
        <NuxtLink to="/ordenanzas">
          <b-button pill variant="success" class="mt-5 mx-3">
            <h5 style="color:white"> Ordenanzas vigentes </h5>
          </b-button>
        </NuxtLink>
        <NuxtLink to="/modernizacion">
          <b-button pill variant="success" class="mt-5 mx-3">
            <h5 style="color:white"> Modernización </h5>
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
