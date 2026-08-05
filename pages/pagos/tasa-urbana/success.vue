<template>
  <div class="page main-background">
    <Banner title="Pago exitoso" />
    <div class="row no-gutters justify-content-center mt-4 mb-3">
      <div class="col-md-8 col-lg-6">
        <div class="white shadow-card p-4 text-start">
          <p class="mb-2">
            El pago se registró correctamente. Esta página es el retorno de éxito
            de Provincia NET.
          </p>
          <p class="mb-0 text-muted" style="font-size: 0.9rem">
            El detalle del comprobante se completará cuando finalice la integración.
          </p>
        </div>
      </div>
    </div>
    <div class="page-btn-volver-wrap">
      <NuxtLink to="/">
        <b-button variant="primary" size="sm" class="page-btn-volver">Volver al inicio</b-button>
      </NuxtLink>
    </div>
  </div>
</template>
