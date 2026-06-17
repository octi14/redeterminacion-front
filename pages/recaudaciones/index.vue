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
      <MenuItem icon="car-front" to="/recaudaciones/tasa-automotor"
       title="Descargar Tasa Automotor"
        description="Consultar y descargar boletas de Automotores por dominio"/>
      <MenuItem icon="building" to="/recaudaciones/tasa-urbana"
       title="Descargar Tasa Urbana"
        description="Consultar y descargar boletas de Tasa Urbana por partida"/>
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
      return this.$can('cementerio.read')
    },
  },
}
</script>
