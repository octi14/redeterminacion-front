<template>
  <div class="page main-background">
    <Banner title="Recaudaciones"/>
    <template>
      <MenuItem v-if="adminCementerio" icon="file-earmark-text" to="/cementerio/certificado_defuncion"
       title="Declaración jurada fallecidos"
        description="Registrar fallecidos y gestionar declaraciones juradas mensuales"/>
      <MenuItem icon="info-circle" to="/recaudaciones/pagos_dobles"
       title="Informar pagos dobles"
        description="Realizar un reclamo por pago doble de tasas"/>
    <div class="row no-gutters">
      <b-button class="mx-auto mt-3" @click="$router.push('/')" variant="primary"> Volver </b-button>
    </div>
    </template>
  </div>
</template>
<script>
export default {
  computed: {
    adminCementerio() {
      return ['cementerio', 'master'].includes(this.$store.state.user.admin)
    },
  },
}
</script>
