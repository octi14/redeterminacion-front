<template>
  <div class="page">
    <Banner title="Detalles de solicitud"/>
    <div v-if="!habilitacion" class="text-center mt-3">
      <h2> Cargando </h2>
      <h4> Por favor espere unos segundos </h4>
    </div>
    <!-- Datos del solicitante -->
    <template v-if="habilitacion">
      <div class="container col-md-6 col-sm-8 card shadow-lg mt-4 mx-auto">
          <div class="col mx-auto">
            <div class="container text-center mx-auto">
              <h2 class="text-success mt-2"><b> Datos del solicitante </b></h2>
              <hr/>
            </div>
          </div>
          <div class="container mx-auto">
            <div class="layout">
              <p class="col col-main">
                <strong>Nombre</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.nombre + " " + habilitacion.apellido}}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Número de documento</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.dni }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>CUIT</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.cuit }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Razón social</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.razonSocial || "No posee" }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Domicilio</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.domicilioReal + " (C.P. " + habilitacion.codigoPostal + "), " + habilitacion.localidad + ", " + habilitacion.provincia }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Número de teléfono</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.telefono }}</a>
              </p>
            </div>
            <br>
          </div>
        </div>
    </template>
    <!-- Datos del inmueble -->
    <template v-if="habilitacion">
      <div class="container col-md-6 col-sm-8 card shadow-lg mt-4 mx-auto">
          <div class="col mx-auto">
            <div class="container text-center mx-auto">
              <h2 class="text-success mt-2"><b> Datos del inmueble </b></h2>
              <hr/>
            </div>
          </div>
          <div class="container justify-content-center mx-auto">
            <div class="layout">
              <p class="col col-main">
                <strong>Domicilio solicitado</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.calleInmueble + " " + habilitacion.nro + ", " + habilitacion.localidadInmueble}}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Nombre de fantasía</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.nombreFantasia || "No tiene" }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Rubro solicitado</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.rubro }}</a>
              </p>
            </div>
            <div class="layout">
              <p class="col col-main">
                <strong>Desea ocupar espacio público</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <a>{{ habilitacion.espacioPublico ? 'Si' : 'No' }}</a>
              </p>
            </div>
            <br>
          </div>
        </div>
    </template>
    <!-- Documentación -->
    <template v-if="habilitacion && habilitacion.documentos">
      <div class="container col-md-6 col-sm-8 card shadow-lg mt-4 mb-3 mx-auto">
        <!-- Resto del contenido del componente -->
        <div class="col mx-auto">
          <div class="container text-center mx-auto">
            <h2 class="text-success mt-2"><b> Documentación presentada </b></h2>
            <hr/>
          </div>
        </div>
        <!-- Mostrar los enlaces a los documentos -->
        <div class="container justify-content-center mx-auto">
          <div v-for="(documento, nombreDocumento) in habilitacion.documentos" :key="nombreDocumento">
            <div class="layout" v-if="habilitacion.documentos && documento != $store.state.habilitaciones.single.documentos._id">
              <p class="col col-main">
                <strong>{{ documentoNames[nombreDocumento] }}</strong><br>
              </p>
              <p class="col col-complementary" role="complementary">
                <b-button @click="openDocumento(documento)" variant="outline-primary" pill>
                  <b-icon icon="eye"></b-icon>
                  Ver
                </b-button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mb-3">
        <NuxtLink to="/comercio/solicitudes">
          <b-button variant="primary">Volver</b-button>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<script>

export default {
  data() {
    return {
      habilitacion: null,
      documentoNames: {
        planillaAutorizacion: 'Planilla de Autorización',
        dniFrente: 'DNI Frente',
        dniDorso: 'DNI Dorso',
        constanciaCuit: 'Constancia de CUIT',
        constanciaIngresosBrutos: 'Constancia de Ingresos Brutos',
        actaPersonaJuridica: 'Acta de Persona Jurídica',
        actaDirectorio: 'Acta de Directorio',
        libreDeudaUrbana: 'Libre Deuda Urbana',
        tituloPropiedad: 'Título de Propiedad',
        plano: 'Plano',
        certificadoDomicilio: 'Certificado de Domicilio',
        croquis: 'Croquis',
        // Agrega los demás nombres de documentos aquí
      },
    }
  },
  computed: {
    cleanDocumentos() {
      // Filtrar los documentos para eliminar el campo "_id"
      return Object.entries(this.habilitacion.documentos).reduce((acc, [key, value]) => {
        if (key !== '_id') {
          acc[key] = value;
        }
        return acc;
      }, {});
    },
  },
  async fetch() {
    const habilitacionId = this.$route.params.id
    await this.$store.dispatch('habilitaciones/getSingle',{
      id: habilitacionId,
    })
    this.habilitacion = this.$store.state.habilitaciones.single
  },
  fetchOnServer: false,
  activated() {
    this.habilitacion = null
    this.$fetch()
  },
  methods: {
    openDocumento(documento) {
      const arrayBufferView = new Uint8Array(documento.data.data);
      const blob = new Blob([arrayBufferView], { type: documento.contentType });
      const fileURL = URL.createObjectURL(blob);

      // Abrir el PDF en una nueva pestaña utilizando <embed>
      const embed = document.createElement('embed');
      embed.setAttribute('type', 'application/pdf');
      embed.setAttribute('src', fileURL);
      embed.setAttribute('width', '100%');
      embed.setAttribute('height', '120%');

      const newWindow = window.open('', '_blank');
      newWindow.document.body.appendChild(embed);
    },
    onResetEdit() {
      this.editing = false
    },
    format(value) {
        if(value){
          let val = (value/1).toFixed(2).replace('.', ',')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }else{
          return 0
        }
    },
  },
}
</script>

<style type="text/css">
/* Layout: */

.col-main {
  flex: 1;
}

.col-complementary {
  flex: 1;
}

.col strong{
  margin-bottom: 0%;
}
/* Responsive: */

@media only screen and (min-width: 640px) {
  .layout {
    display: flex;
    max-width: 90%;
    margin: auto;
  }
}

/* etc */

/* body {
  margin: 1.5em;
} */

.col {
  padding: 0.4em;
  margin: 0 2px 2px 40px;
}
</style>
