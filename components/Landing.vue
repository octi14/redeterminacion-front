<template>
  <div>
    <Banner title="Secretaría de Hacienda" subtitle="Municipalidad de Villa Gesell" />
    <div>
      <div class="text-center" border-variant="light">
        <NuxtLink to="/redeterminacion">
          <b-button pill variant="success" v-if="isAdmin" class="mt-5 mx-3">
            <h5 style="color:white"> Redeterminación </h5>
          </b-button>
        </NuxtLink>
        <!-- <NuxtLink to="/comercios">
          <b-button pill variant="success" class="mt-5 mx-3">
            <h5 style="color:white"> Habilitaciones Comerciales </h5>
          </b-button>
        </NuxtLink> -->
        <!-- <NuxtLink to="/turnos">
          <b-button pill variant="success" class="mt-5 mx-3">
            <h5 style="color:white"> Turnos comercio </h5>
          </b-button>
        </NuxtLink> -->
        <br>
        <!-- <NuxtLink to="/ordenanzas">
          <b-button pill variant="success" class="mt-5 mx-3">
            <h5 style="color:white"> Ordenanzas vigentes </h5>
          </b-button>
        </NuxtLink> -->
        <NuxtLink to="/modernizacion">
          <b-button pill variant="success" class="mt-5 mx-3">
            <h5 style="color:white"> Modernización </h5>
          </b-button>
        </NuxtLink>
        <!-- <NuxtLink to="/guias">
          <b-button pill variant="success" class="mt-5 mx-3">
            <h5 style="color:white"> Guías </h5>
          </b-button>
        </NuxtLink> -->
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
      return (this.$store.state.user.admin)
    },
  },
  methods: {
  },
}
</script>

<style>
  /* .bg{
    background-image: url(https://images.unsplash.com/photo-1588420343624-8b15ebd3573d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1112&q=80);
  } */
</style>
