<template>
  <div class="page main-background">
    <Banner title="Tasas" />
    <MenuItem
      v-if="mostrarTasaAutomotor"
      icon="car-front"
      to="/tasas/tasa-automotor"
      title="Descargar Tasa Automotor"
      description="Consultar y descargar boletas de Automotores por dominio"
    />
    <MenuItem
      v-if="mostrarPagoUrbana"
      icon="building"
      to="/tasas/pagar-tasas"
      title="Pagar tasas"
      description="Pago online de tasas municipales"
    />
    <MenuItem
      icon="info-circle"
      to="/tasas/pagos_dobles"
      title="Informar pagos dobles"
      description="Realizar un reclamo por pago doble de tasa urbana"
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
  name: 'TasasIndex',
  data() {
    return {
      tasaAutomotorPublicaHabilitada: true,
      pagoUrbanaPublico: false,
    }
  },
  computed: {
    usuarioInternoBoletas() {
      const role = String(useUserStore().admin || '').trim().toLowerCase()
      return ['admin', 'master', 'true', 'boletas'].includes(role)
    },
    mostrarTasaAutomotor() {
      return this.usuarioInternoBoletas || this.tasaAutomotorPublicaHabilitada
    },
    usuarioInternoPagoUrbana() {
      const admin = String(useUserStore().admin || '').trim().toLowerCase()
      return ['hacienda', 'master', 'admin', 'true', 'boletas'].includes(admin)
    },
    mostrarPagoUrbana() {
      return this.usuarioInternoPagoUrbana || this.pagoUrbanaPublico
    },
  },
  mounted() {
    this.loadTasaAutomotorConfig()
    this.loadPagoUrbanaConfig()
  },
  methods: {
    async loadPagoUrbanaConfig() {
      try {
        const response = await ProvinciaNetService.getConfiguracion(this.$axios)
        const data = response?.data || response
        this.pagoUrbanaPublico = data?.habilitada === true
      } catch (_) {
        this.pagoUrbanaPublico = false
      }
    },
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
