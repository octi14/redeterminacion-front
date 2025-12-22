<template>
  <div class="page main-background">
    <Banner title="Compras"/>
    <div class="mt-5">
      <div class="row no-gutters justify-content-center">
        <a href="https://hacienda.gesell.gob.ar/compras-y-suministros.html" target="_blank" class="col-md-5">
          <b-button variant="outline" class="d-flex align-items-center w-100 white shadow-card">
            <div class="me-3">
              <b-icon-receipt class="mx-3 my-3 landing-icon" />
            </div>
            <div class="col text-left my-auto">
              <h3 class="landing-text"><b> Licitaciones públicas</b></h3>
              <h6>Pliegos y notas aclaratorias para consulta</h6>
            </div>
          </b-button>
        </a>
      </div>
      <MenuItem to="/compras/proveedores" icon="pen" title="Inscripción de proveedores" description="Información acerca de la inscripción como Proveedor Municipal"/>
      <div class="row no-gutters justify-content-center mt-5" v-if="adminCompras">
        <NuxtLink to="/compras/combustible" class="col-md-5">
          <b-button variant="outline" class="d-flex w-100 white shadow-card">
            <div class="me-3">
              <FuelIcon class="mx-3 my-3 landing-icon"/>
            </div>
            <div class="col text-left my-auto">
              <h3 class="landing-text"><b> Combustible </b></h3>
              <h6>Administrar órdenes de compra y vales de combustible</h6>
            </div>
          </b-button>
        </NuxtLink>
      </div>
    </div>
    <div class="text-center m-4 float-lg-end">
      <NuxtLink to="/">
        <b-button variant="primary"> Volver </b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    adminHacienda() {
      return this.$store.state.user.admin == "hacienda" || this.$store.state.user.admin == "master";
    },
    adminCompras(){
      return this.$store.state.user.admin == "compras" || this.$store.state.user.admin == "master";
    }
  }
};
</script>

<style scoped>
.landing-icon {
  width: 60px;
  height: 60px;
  color: #ef8918;
  transition: transform 0.2s ease;
}
/* Aplicar escala al hacer hover en el ícono */
.landing-icon:hover {
  transform: scale(1.15);
}

.col{
  margin: 16px;
}

/* Agregar márgenes laterales en mobile para los rows */
@media (max-width: 767.98px) {
  .row.no-gutters {
    padding-left: 15px;
    padding-right: 15px;
  }
}

</style>
