<template>
  <div class="page main-background">
    <Banner title="Compras"/>
    <div class="mt-5">
      <MenuItem
        to="https://hacienda.gesell.gob.ar/compras-y-suministros.html"
        icon="receipt"
        title="Licitaciones públicas"
        description="Pliegos y notas aclaratorias para consulta"
      />
      <MenuItem to="/compras/proveedores" icon="pen" title="Inscripción de proveedores" description="Información acerca de la inscripción como Proveedor Municipal"/>
      <MenuItem
        v-if="adminCompras"
        to="/compras/combustible"
        title="Combustible"
        description="Administrar órdenes de compra y vales de combustible"
      >
        <template #icon>
          <FuelIcon />
        </template>
      </MenuItem>
    </div>
    <div class="page-btn-volver-wrap">
      <NuxtLink to="/">
        <b-button variant="primary" size="sm" class="page-btn-volver"> Volver </b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    adminCompras(){
      return this.$can('compras.ordenes.read')
    },
  }
};
</script>
