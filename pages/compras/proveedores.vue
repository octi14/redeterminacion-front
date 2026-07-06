<template>
  <div class="page main-background mt-3">
    <Banner title="Compras" />
    <div class="mt-5">
      <h1 class="text-title">Inscripción de proveedores</h1>
      <b-card class="m-4 mt-5 col-md-11 col-sm-8 shadow-card proveedores-card">
        <h4 class="section-title mt-4">
          ¿Qué documentación necesito para registrarme como Proveedor Municipal?
        </h4>
        <div class="li-row ml-3 mt-3 mb-3">
          <div class="li-icon">
            <i class="bi bi-caret-right-fill icon-orange icon" />
          </div>
          <div class="li-content">
            <h6>
              Para realizar la inscripción como Proveedor Municipal deberás completar la
              <a
                target="_blank"
                href="https://www.google.com/url?q=https://drive.google.com/file/d/1lkEj6eRbXCGcRyD54ibEssMILgMJdSG2/view?usp%3Dsharing&sa=D&source=docs&ust=1696884793738508&usg=AOvVaw1GzSOcReLrdMhQdS-pltSr"
              >
                Planilla de Inscripción de Proveedores
              </a>
              y contar con la documentación solicitada en la misma.
            </h6>
          </div>
        </div>
        <div class="li-row ml-3 mb-3">
          <div class="li-icon">
            <i class="bi bi-caret-right-fill icon-orange icon" />
          </div>
          <div class="li-content">
            <h6>
              Luego, deberás entregar la planilla y documentación original en el Departamento de
              Compras y Licitaciones municipal.
            </h6>
          </div>
        </div>

        <h4 class="section-title">
          ¿Cuál es el valor de la Inscripción al Registro de Proveedores?
        </h4>
        <div class="li-row ml-3 mt-3 mb-3">
          <div class="li-icon">
            <i class="bi bi-caret-right-fill icon-orange icon" />
          </div>
          <div class="li-content">
            <h6>
              El valor de la inscripción corresponde a lo indicado en el
              <a href="https://arvige.gob.ar/legislacion/pdf/12">
                Art. 242 de la Ordenanza Municipal 2156/08 (TO 2024).
              </a>
            </h6>
          </div>
        </div>
        <div class="li-row ml-3 mb-3">
          <div class="li-icon">
            <i class="bi bi-caret-right-fill icon-orange icon" />
          </div>
          <div class="li-content">
            <h6>
              También puede consultarse telefónicamente o por correo electrónico en el Departamento
              de Compras municipal.
            </h6>
          </div>
        </div>

        <h4 class="section-title">
          ¿Cómo realizo el pago de Inscripción al Registro de Proveedores?
        </h4>
        <div class="li-row ml-3 mt-3 mb-3">
          <div class="li-icon">
            <i class="bi bi-caret-right-fill icon-orange icon" />
          </div>
          <div class="li-content">
            <h6>
              Podés realizar el pago a través de depósito o transferencia. Consultá los
              <b>Datos Bancarios</b> haciendo
              <a
                target="_blank"
                href="https://docs.google.com/document/d/1tNkM1aft_U6j1ibSLBqxmi77BjvjZPl54wjtkeVSqWU/"
              >
                click aquí.
              </a>
            </h6>
          </div>
        </div>
        <div class="li-row ml-3 mb-3">
          <div class="li-icon">
            <i class="bi bi-caret-right-fill icon-orange icon" />
          </div>
          <div class="li-content">
            <h6>Para finalizar, enviá el comprobante de pago a la Tesorería Municipal.</h6>
          </div>
        </div>

        <h4 class="section-title">Contactos útiles</h4>
        <div class="li-row ml-3 mt-3">
          <div class="li-icon">
            <i class="bi bi-caret-right-fill icon-orange icon" />
          </div>
          <div class="li-content">
            <h6><b>Departamento de Compras</b></h6>
            <h6>Tel: 02255-478028/79 | Horario de Atención: Lunes a Viernes de 08.30 a 13.30 hs</h6>
          </div>
        </div>
        <div class="li-row ml-3 mt-4">
          <div class="li-icon">
            <i class="bi bi-caret-right-fill icon-orange icon" />
          </div>
          <div class="li-content">
            <h6><b>Tesorería municipal</b></h6>
            <h6>tesoreriavg@gesell.gob.ar | Tel: 02255-478034</h6>
          </div>
        </div>
      </b-card>
      <div class="page-btn-volver-wrap">
        <NuxtLink to="/compras">
          <b-button variant="primary" size="sm" class="page-btn-volver"> Volver </b-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-title {
  color: #0c681a !important;
  width: 100%;
  display: inline-block;
  margin-bottom: 0;
  font-weight: bold;
}

.text-title {
  color: #514e4b !important;
  font-size: 35px;
  margin-left: 3rem;
  font-weight: bold;
}

.proveedores-card {
  width: auto;
}

.li-row {
  display: flex;
  align-items: flex-start;
  width: 100%;
}

.li-icon {
  flex: 0 0 auto;
  margin-right: 0.5rem;
  margin-top: 0.25rem;
  line-height: 1;
}

.li-content {
  flex: 1;
  min-width: 0;
}

.li-content h6 {
  margin-bottom: 0.35rem;
}

.li-content h6:last-child {
  margin-bottom: 0;
}

.icon {
  font-size: 1rem;
}

h6 {
  font-family: 'Calibri', sans-serif;
  font-size: 1.2rem;
  color: #353535;
}

.li-content a {
  color: #0c681a;
}

@media (max-width: 767.98px) {
  .text-title {
    margin-left: 1rem;
    font-size: 28px;
  }

  .proveedores-card {
    margin-left: 0.75rem !important;
    margin-right: 0.75rem !important;
  }
}
</style>
