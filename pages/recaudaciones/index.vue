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
      <MenuItem v-if="tasaHabilitada('AUTOMOTORES')" icon="truck" to="/recaudaciones/tasa-automotor"
       title="Descargar Tasa Automotor"
        description="Consultar y descargar boletas de Automotores por dominio"/>
      <MenuItem v-if="tasaHabilitada('URBANA')" icon="building" to="/recaudaciones/tasa-urbana"
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
  data() {
    return {
      tasas: [],
    }
  },
  computed: {
    adminCementerio() {
      return this.$can('cementerio.read') || this.$can('cementerio.admin')
    },
  },
  mounted() {
    this.cargarTasas()
  },
  methods: {
    async cargarTasas() {
      try {
        const response = await this.$axios.get('/tasas/tipos')
        this.tasas = response.data.data || []
      } catch (_) {
        this.tasas = []
      }
    },
    tasaHabilitada(codigo) {
      const tasa = this.tasas.find(item => item.codigo === codigo)
      return !tasa || tasa.importacionHabilitada !== false
    },
  },
}
</script>
