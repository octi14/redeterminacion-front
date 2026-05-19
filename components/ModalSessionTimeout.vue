<template>
  <!-- Modal de sesión expirada -->
  <b-modal
    id="modalSessionTimeout"
    :model-value="mostrarModal"
    @update:model-value="$emit('update:mostrarModal', $event)"
    no-close-on-backdrop
    no-close-on-esc
    hide-header-close
    title="Sesión expirada"
    header-bg-variant="secondary"
    title-class="text-center text-light"
    hide-footer
    centered
  >
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
  emits: ['update:mostrarModal'],
  methods: {
    logout() {
      this.$emit('update:mostrarModal', false)
      this.$store.dispatch("user/logout")
      this.$router.push("/login")
    },
  },
};
</script>
