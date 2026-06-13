<template>
  <div class="page main-background">
    <Banner title="Recaudaciones"/>
    <template>
      <MenuItem icon="info-circle" to="/recaudaciones/pagos_dobles"
       title="Informar pagos dobles"
        description="Realizar un reclamo por pago doble de tasas"/>
      <MenuItem icon="car-front" to="/recaudaciones/tasa-automotor"
       title="Descargar Tasa Automotor"
        description="Consultar y descargar boletas de Automotores por dominio"/>
    <div class="row no-gutters">
      <b-button class="mx-auto mt-3" @click="$router.push('/')" variant="primary"> Volver </b-button>
    </div>
    </template>
  </div>
</template>
