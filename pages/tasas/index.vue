<template>
  <div class="page main-background">
    <Banner title="Tasas" />
    <MenuItem
      icon="info-circle"
      to="/tasas/pagos_dobles"
      title="Informar pagos dobles"
      description="Realizar un reclamo por pago doble de tasa urbana"
    />
    <MenuItem
      v-if="mostrarTasaAutomotor"
      icon="car-front"
      to="/tasas/tasa-automotor"
      title="Descargar Tasa Automotor"
      description="Consultar y descargar boletas de Automotores por dominio"
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
  name: 'TasasIndex',
  data() {
    return {
      tasaAutomotorPublicaHabilitada: true
    }
  },
  computed: {
    usuarioInternoBoletas() {
      const role = String(useUserStore().admin || '').trim().toLowerCase()
      return ['admin', 'master', 'true', 'boletas'].includes(role)
    },
    mostrarTasaAutomotor() {
      return this.usuarioInternoBoletas || this.tasaAutomotorPublicaHabilitada
    }
  },
  mounted() {
    this.loadTasaAutomotorConfig()
  },
  methods: {
    async loadTasaAutomotorConfig() {
      try {
        const response = await this.$axios.get('/tasas/automotores/configuracion')
        this.tasaAutomotorPublicaHabilitada = response.data.data.habilitada !== false
      } catch (_) {
        this.tasaAutomotorPublicaHabilitada = true
      }
    }
  }
}
</script>
