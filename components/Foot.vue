<template>
  <div class="footer">
    <!-- Sección oscura con información de contacto -->
    <div class="footer-contact bg-dark text-light py-5">
      <div class="container-fluid px-4">
        <!-- Título principal -->
        <div class="row no-gutters mb-4">
          <div class="col-7 mx-auto">
            <h4 class="text-light text-main mb-3 text-center-mobile">Información de contacto</h4>
          </div>
        </div>

        <div class="row no-gutters justify-content-center">
          <!-- Logo y Secretaría de Hacienda -->
          <div class="col-lg-2 col-md-3 mb-3">
            <div class="logo-section text-center mb-3">
              <div class="logo-container d-inline-block">
                <img src="../assets/logoVGheader2.png" alt="Villa Gesell" class="footer-logo">
              </div>
            </div>
            <div class="contact-section">
              <h6 class="text-light text-big mb-3">Secretaría de Hacienda</h6>
              <div class="text-center">
                <p class="mb-2"><b-icon-geo-alt class="mr-2"/>Av. 3 n°820 - Palacio municipal</p>
                <p class="mb-0"><b-icon-telephone class="mr-2"/>(02255) 478073</p>
              </div>
            </div>
          </div>

          <!-- Departamentos principales -->
          <div class="col-lg-5 mx-auto col-md-6 mb-3">
            <div class="row no-gutters">
              <!-- Fila 1: Tesorería y Dpto. Recaudaciones -->
              <div class="col-12 d-flex justify-content-between mb-3 flex-column flex-md-row">
                <div class="col-md-6 mb-3 mb-md-0">
                  <div class="department-section mb-3">
                    <h6 class="text-light mb-2">Tesorería</h6>
                    <p class="mb-1"><b-icon-geo-alt class="mr-2"/>Av. 3 n°820 - Palacio Municipal</p>
                    <p class="mb-1"><b-icon-telephone class="mr-2"/>(02255) 478053</p>
                    <p class="mb-2"><b-icon-envelope class="mr-2"/>tesoreriavg@gesell.gob.ar</p>
                  </div>
                </div>
                <div class="col-md-6 d-flex justify-content-end">
                  <div class="department-section mb-3">
                    <h6 class="text-light mb-2">Dpto. Recaudaciones</h6>
                    <p class="mb-1"><b-icon-geo-alt class="mr-2"/>Av. 3 n° 820 - Palacio municipal</p>
                    <p class="mb-0"><b-icon-envelope class="mr-2"/>recaudaciones@gesell.gob.ar</p>
                  </div>
                </div>
              </div>

              <!-- Fila 2: Dpto. Compras y Dpto. Comercio -->
              <div class="col-12 d-flex justify-content-between mb-3 flex-column flex-md-row">
                <div class="col-md-6 mb-3 mb-md-0">
                  <div class="department-section mb-3">
                    <h6 class="text-light mb-2">Dpto. Compras</h6>
                    <p class="mb-1"><b-icon-geo-alt class="mr-2"/>Av. 3 n° 820 - Palacio Municipal</p>
                    <p class="mb-0"><b-icon-telephone class="mr-2"/>(02255) 478028 / 79</p>
                  </div>
                </div>
                <div class="col-md-6 d-flex justify-content-end">
                  <div class="department-section mb-3">
                    <h6 class="text-light mb-2">Dpto. Comercio</h6>
                    <p class="mb-1"><b-icon-geo-alt class="mr-2"/>Av. 3 n° 820 - Palacio municipal</p>
                    <p class="mb-1"><b-icon-envelope class="mr-2"/>deptocomercio@gesell.gob.ar</p>
                    <p class="mb-0"><b-icon-telephone class="mr-2"/>(02255) 478056</p>
                  </div>
                </div>
              </div>

              <!-- Fila 3: ARVIGE y Dpto. Inspección -->
              <div class="col-12 d-flex justify-content-between mb-3 flex-column flex-md-row">
                <div class="col-md-6 mb-3 mb-md-0">
                  <div class="department-section">
                    <h6 class="text-light mb-2">ARVIGE</h6>
                    <p class="mb-1"><b-icon-geo-alt class="mr-2"/>Paseo 111 N° 351 - Villa Gesell</p>
                    <p class="mb-1"><b-icon-link class="mr-2"/><a href="https://arvige.gob.ar" target="_blank" class="text-light">https://arvige.gob.ar</a></p>
                    <p class="mb-1"><b-icon-envelope class="mr-2"/>dirarvige@gesell.gob.ar / arvige@gesell.gob.ar</p>
                    <p class="mb-1"><b-icon-telephone class="mr-2"/>(02255) 456190</p>
                    <p class="mb-1"><b-icon-instagram class="mr-2"/><a href="https://instagram.com/a.r.vi.ge" target="_blank" class="text-light">a.r.vi.ge</a></p>
                    <p class="mb-0"><b-icon-facebook class="mr-2"/><a href="https://facebook.com/AgenciaRecaudacionVillaGesell" target="_blank" class="text-light">Agencia de Recaudación Villa Gesell</a></p>
                  </div>
                </div>
                <div class="col-md-6 d-flex justify-content-end">
                  <div class="department-section">
                    <h6 class="text-light mb-2">Dpto. Inspección</h6>
                    <p class="mb-1"><b-icon-geo-alt class="mr-2"/>Av. 3 n° 820 - Palacio municipal</p>
                    <p class="mb-1"><b-icon-envelope class="mr-2"/>divinspectores@gesell.gob.ar</p>
                    <p class="mb-0"><b-icon-telephone class="mr-2"/>(02255) 478053</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Casa de Villa Gesell en Buenos Aires -->
          <div class="col-lg-3 mx-auto col-md-3 mb-3">
            <div class="casa-buenos-aires">
              <h6 class="text-light mb-3">Casa de Villa Gesell<br/> en Buenos Aires</h6>
              <div>
                <p class="mb-1"><b-icon-geo-alt class="mr-2"/>Corrientes 1312 piso 11 of 42, CABA</p>
                <p class="mb-1"><b-icon-envelope class="mr-2"/>casadevillagesell@gesell.gob.ar</p>
                <p class="mb-3"><b-icon-telephone class="mr-2"/>(011) 52782990</p>
              </div>

              <!-- Mapa de Google Maps -->
              <div class="map-container rounded" style="height: 150px; width: 100%; overflow: hidden;">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0!2d-58.3854!3d-34.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f19.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzE0LjQiUyA1OMKwMjMnMDcuNCJX!5e0!3m2!1ses!2sar!4v1234567890"
                  width="100%"
                  height="100%"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Barra verde con copyright -->
    <div class="footer-copyright bg-success text-light py-2">
      <div class="container-fluid">
      <div class="row no-gutters">
          <div class="col-12 text-center">
            <p class="mb-1" style="font-size: 1.1rem;">© 2025 - Municipalidad de Villa Gesell</p>
            <p class="mb-0" style="font-size: 1.1rem;">Sitio desarrollado por el Dpto. Modernización del Estado- ARVIGE</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap');

.footer {
  width: 100%;
  margin: 0;
  padding: 0;
  margin-top: 1.5rem;
  font-family: 'Roboto', sans-serif;
}

/* Sección oscura con información de contacto */
.footer-contact {
  background-color: #505050 !important; /* Bootstrap dark */
}

.footer-contact .text-big {
  font-size: 2rem;
  text-align: center;
  font-weight: 700;
}

.footer-contact .text-main {
  font-size: 3rem;
  text-align: center;
  font-weight: 700;
}

.footer-contact h4 {
  color: #ffffff !important;
  font-weight: 600;
  font-size: 1.5rem;
  text-align: left !important;
  /* Mantener fuente por defecto para el título principal */
}

.footer-contact h6 {
  color: #f8f9fa !important;
  font-weight: 500;
  font-size: 1.5rem;
  font-family: 'Roboto', sans-serif;
  letter-spacing: 0.2px;
}

.footer-contact p {
  margin-bottom: 0.2rem;
  padding-bottom: 0;
  font-size: 0.9rem;
  font-weight: 400;
  color: #e9ecef !important;
  letter-spacing: 0.25px;
  line-height: 1.2;
  font-family: 'Roboto', sans-serif;
}

.footer-contact .logo-container {
  min-width: 120px;
}

.footer-contact .footer-logo {
  /* Sin estilos personalizados - apariencia natural */
}

.footer-contact .department-section {
  padding-left: 0;
  margin-bottom: 20px;
  justify-content: space-between;
}

.footer-contact .casa-buenos-aires {
  border-left: 2px solid #ffffff;
  padding-left: 30px;
  margin-left: 20px;
  min-height: 100%;
}

.footer-contact .map-container {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 100%;
}

.footer-contact .map-container iframe {
  border: none;
  border-radius: 4px;
}

/* Estilos para enlaces en el footer - Mayor especificidad */
.footer-contact p a,
.footer-contact p a.text-light,
.footer-contact a.text-light {
  color: #e9ecef !important;
  text-decoration: none !important;
  font-family: 'Roboto', sans-serif !important;
  font-weight: 400 !important;
  font-size: 0.9rem !important;
  letter-spacing: 0.25px !important;
  line-height: 1.2 !important;
}

.footer-contact p a:hover,
.footer-contact p a.text-light:hover,
.footer-contact a.text-light:hover {
  color: #e9ecef !important;
  text-decoration: none !important;
}

/* Clase específica para centrar título en mobile */
@media (max-width: 768px) {
  .text-center-mobile {
    text-align: center !important;
    font-size: 1.8rem !important;
    font-weight: 600 !important;
  }
}

/* Responsive para mobile */
@media (max-width: 768px) {
  .footer-contact .container {
    padding: 0 15px;
  }

  .footer-contact h4 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  .footer-contact h6 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .footer-contact .logo-section {
    margin-bottom: 2rem;
  }

  .footer-contact .footer-logo {
    max-width: 200px;
    height: auto;
  }

  .footer-contact .department-section {
    margin-bottom: 1.5rem;
    padding: 0 10px;
  }

  .footer-contact .department-section h6 {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }

  .footer-contact .department-section p {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }

  .footer-contact .casa-buenos-aires {
    margin-left: 0;
    padding-left: 20px;
    border-left: 2px solid #ffffff;
  }

  .footer-contact .map-container {
    height: 120px;
    margin-top: 1rem;
  }

  .footer-contact .casa-buenos-aires h6 {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }

  .footer-contact .casa-buenos-aires p {
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }

  /* Enlaces en mobile */
  .footer-contact p a,
  .footer-contact p a.text-light,
  .footer-contact a.text-light {
    font-size: 0.85rem !important;
    word-break: break-all;
  }
}

@media (max-width: 576px) {
  .footer-contact .container {
    padding: 0 10px;
  }

  .footer-contact h4 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    text-align: center !important;
  }

  .footer-contact h6 {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }

  .footer-contact .footer-logo {
    max-width: 150px;
  }

  .footer-contact .department-section {
    padding: 0 5px;
  }

  .footer-contact .department-section h6 {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .footer-contact .department-section p {
    font-size: 0.8rem;
    margin-bottom: 0.4rem;
  }

  .footer-contact .casa-buenos-aires {
    padding-left: 15px;
  }

  .footer-contact .map-container {
    height: 100px;
  }

  .footer-contact .casa-buenos-aires h6 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .footer-contact .casa-buenos-aires p {
    font-size: 0.8rem;
    margin-bottom: 0.4rem;
  }

  /* Enlaces en mobile pequeño */
  .footer-contact p a,
  .footer-contact p a.text-light,
  .footer-contact a.text-light {
    font-size: 0.8rem !important;
    word-break: break-all;
  }
}

.footer-contact small {
  color: #adb5bd !important;
  font-size: 0.7rem;
  font-family: 'Roboto', sans-serif;
}

.footer-contact a {
  color: #17a2b8 !important;
  text-decoration: none;
  font-size: 0.7rem;
  font-family: 'Roboto', sans-serif;
}

.footer-contact a:hover {
  color: #20c997 !important;
  text-decoration: underline;
}

.casa-buenos-aires {
  margin-left: 50px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .footer-contact .department-section {
    border-left: none;
    border-top: 1px solid #6c757d;
    padding-left: 0;
    padding-top: 10px;
    margin-top: 10px;
  }

  .footer-contact .casa-buenos-aires {
    border-left: none;
    border-top: 1px solid #ffffff;
    padding-left: 0;
    padding-top: 10px;
    margin-top: 10px;
  }
}

/* Barra verde con copyright */
.footer-copyright {
  background-color: #28a745 !important; /* Verde Bootstrap success */
}

.footer-copyright p {
  margin-bottom: 0;
  padding-bottom: 0;
  font-size: 0.9rem;
  font-weight: 400;
  color: white !important;
  font-family: 'Roboto', sans-serif;
}

.footer-copyright .container-fluid {
  padding: 0;
  margin: 0;
}

/* Estilos generales para ambos footer */
.footer p {
  margin-bottom: 0;
  padding-bottom: 0;
}
</style>
