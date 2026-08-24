<template>
  <div class="page main-background">
    <Banner title="Pagos" />
    <MenuItem
      icon="cash-coin"
      to="https://arvige.gob.ar/lpagos"
      title="Pagá online / Descargá tu boleta"
      description="Portal de pagos y descarga de boletas (ARVIGE)"
    />
    <div class="page-btn-volver-wrap">
      <NuxtLink to="/">
        <b-button variant="primary" size="sm" class="page-btn-volver">Volver</b-button>
      </NuxtLink>
    </div>
  </div>
</template>
