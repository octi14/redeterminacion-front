<template>
  <div class="page main-background">
    <Banner title="Recaudaciones" />
    <MenuItem
      icon="info-circle"
      to="/recaudaciones/pagos_dobles"
      title="Informar pagos dobles"
      description="Realizar un reclamo por pago doble de tasas"
    />
    <MenuItem
      v-if="mostrarTasaAutomotor"
      icon="car-front"
      to="/recaudaciones/tasa-automotor"
      title="Descargar tasa de automotores"
      description="Consultar y descargar boletas de patente de rodados"
    />
    <MenuItem
      v-if="mostrarTasaUrbana"
      icon="building"
      to="/recaudaciones/tasa-urbana"
      title="Descargar tasa urbana"
      description="Consultar y descargar boletas de partidas inmobiliarias"
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
  name: 'RecaudacionesIndex',
  data() {
    return {
      tasaAutomotorPublicaHabilitada: true,
      tasaUrbanaPublicaHabilitada: true
    }
  },
  computed: {
    usuarioInternoBoletas() {
      return this.$can('boletas.manage')
    },
    mostrarTasaAutomotor() {
      return this.usuarioInternoBoletas || this.tasaAutomotorPublicaHabilitada
    },
    mostrarTasaUrbana() {
      return this.usuarioInternoBoletas || this.tasaUrbanaPublicaHabilitada
    }
  },
  mounted() {
    this.loadPublicConfigs()
  },
  methods: {
    async loadPublicConfigs() {
      const [automotor, urbana] = await Promise.allSettled([
        this.$axios.get('/tasas/automotores/configuracion'),
        this.$axios.get('/tasas/urbanas/configuracion')
      ])
      this.tasaAutomotorPublicaHabilitada = automotor.status !== 'fulfilled' || automotor.value.data.data.habilitada !== false
      this.tasaUrbanaPublicaHabilitada = urbana.status !== 'fulfilled' || urbana.value.data.data.habilitada !== false
    }
  }
}
</script>
