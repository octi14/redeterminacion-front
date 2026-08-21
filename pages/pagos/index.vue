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
      v-if="mostrarPagoUrbana"
      icon="building"
      to="/pagos/pagar-tasas"
      title="Pagar tasas"
      description="Pago online de tasas municipales"
    />
    <div class="page-btn-volver-wrap">
      <NuxtLink to="/">
        <b-button variant="primary" size="sm" class="page-btn-volver">Volver</b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import ProvinciaNetService from '~/service/provinciaNet.js'

export default {
  data() {
    return {
      pagoUrbanaPublico: false,
    }
  },
  computed: {
    usuarioInternoPagoUrbana() {
      const admin = String(useUserStore().admin || '').trim().toLowerCase()
      return ['hacienda', 'master', 'admin', 'true', 'boletas'].includes(admin)
    },
    mostrarPagoUrbana() {
      return this.usuarioInternoPagoUrbana || this.pagoUrbanaPublico
    },
  },
  mounted() {
    this.loadConfig()
  },
  methods: {
    async loadConfig() {
      try {
        const response = await ProvinciaNetService.getConfiguracion(this.$axios)
        const data = response?.data || response
        this.pagoUrbanaPublico = data?.habilitada === true
      } catch (_) {
        this.pagoUrbanaPublico = false
      }
    },
  },
}
</script>
