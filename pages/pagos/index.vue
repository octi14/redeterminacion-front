<template>
  <div class="page main-background">
    <Banner title="Pagos" />
    <MenuItem
      icon="cash-coin"
      to="https://arvige.gob.ar/lpagos"
      title="Pagá online / Descargá tu boleta"
      description="Portal de pagos y descarga de boletas (ARVIGE)"
    />
    <MenuItem
      v-if="adminHacienda"
      icon="building"
      to="/pagos/tasa-urbana"
      title="Pagar tasa urbana"
      description="Pago de Tasa por Servicios Urbanos (en implementación)"
    />
    <div class="page-btn-volver-wrap">
      <NuxtLink to="/">
        <b-button variant="primary" size="sm" class="page-btn-volver">Volver</b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    adminHacienda() {
      return this.$can('pagos.read')
    },
  },
}
</script>
