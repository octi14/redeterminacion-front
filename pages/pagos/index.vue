<template>
  <div class="page main-background">
    <Banner title="Pagos"/>
    <MenuItem icon="trash" to="/pagos_dobles" title="Informar pagos dobles" description="Realizar un reclamo por pago doble de tasas"/>
    <div class="row no-gutters">
      <b-button class="mx-auto mt-3" @click="$router.push('/')" variant="primary"> Volver </b-button>
    </div>
  </div>
</template>
