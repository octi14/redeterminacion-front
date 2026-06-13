<template>
  <div class="page main-background">
    <Banner title="Recaudaciones" />
    <MenuItem
      icon="info-circle"
      to="/recaudaciones/pagos_dobles"
      title="Informar pagos dobles"
      description="Realizar un reclamo por pago doble de tasas"
    />
    <MenuItem
      icon="car-front"
      to="/recaudaciones/tasa-automotor"
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
