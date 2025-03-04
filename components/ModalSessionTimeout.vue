<template>
  <!-- Modal de sesión expirada -->
  <b-modal id="modalSessionTimeout" v-model="mostrarModal" no-close-on-backdrop title="Sesión expirada" header-bg-variant="secondary" title-class="text-center text-light" hide-footer centered>
    <p class="h5 text-center font-weight-500">Tu sesión ha vencido. Debes iniciar sesión nuevamente.</p>
    <div class="row justify-content-center">
      <b-button class="col-3 my-3" variant="secondary" @click="logout">Aceptar</b-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    mostrarModal: Boolean,
  },
  methods: {
    logout() {
      this.$store.dispatch("user/logout"); // Cerrar sesión
      this.$router.push("/login"); // Redirigir al login
      this.$bvModal.hide('modalSessionTimeout')
    },
  },
};
</script>
