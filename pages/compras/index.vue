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
        v-if="adminCompras || puedeVerDashboardCombustible"
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
import { COMBUSTIBLE_DASHBOARD_USERNAMES } from '~/utils/access-control'

export default {
  computed: {
    adminHacienda() {
      const admin = useUserStore().admin
      return admin == "hacienda" || admin == "master";
    },
    adminCompras(){
      const admin = useUserStore().admin
      return admin == "compras" || admin == "master";
    },
    /** Usuario que solo puede ver el dashboard de combustible (sin órdenes ni vehículos). */
    puedeVerDashboardCombustible() {
      return COMBUSTIBLE_DASHBOARD_USERNAMES.includes(useUserStore().username)
    }
  }
};
</script>
