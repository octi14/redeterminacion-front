<template>
  <div class="page main-background">
    <Banner title="Pagos"/>
    <template v-if="adminMaster">
      <MenuItem icon="info-circle" to="/pagos/pagos_dobles" title="Informar pagos dobles" description="Realizar un reclamo por pago doble de tasas"/>
    <div class="row no-gutters">
      <b-button class="mx-auto mt-3" @click="$router.push('/')" variant="primary"> Volver </b-button>
    </div>
    </template>
    <template v-else>
      <div class="row no-gutters my-5">
        <h4 class="mx-auto">Sitio en construcción</h4>
      </div>
    </template>
  </div>
</template>

<script>
export default{
  computed:{
    adminMaster(){
      return this.$store.state.user.admin === "master"
    }
  }
}
</script>
