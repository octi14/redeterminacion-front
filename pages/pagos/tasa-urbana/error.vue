<template>
  <div class="page main-background">
    <Banner title="Error en el pago" />
    <div class="row no-gutters justify-content-center mt-4 mb-3">
      <div class="col-md-8 col-lg-6">
        <div class="white shadow-card p-4 text-start">
          <p class="mb-2">
            No se pudo completar el pago. Esta página es el retorno de error
            de Provincia NET.
          </p>
          <p class="mb-0 text-muted" style="font-size: 0.9rem">
            Podés intentar nuevamente más tarde o usar el portal de ARVIGE.
          </p>
        </div>
      </div>
    </div>
    <div class="page-btn-volver-wrap">
      <NuxtLink to="/pagos">
        <b-button variant="primary" size="sm" class="page-btn-volver">Volver a Pagos</b-button>
      </NuxtLink>
    </div>
  </div>
</template>
