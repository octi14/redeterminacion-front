<template>
  <div class="page main-background">
    <Banner title="Recaudaciones" />

    <div class="col-10 mainCarrousel" style="margin: auto; margin-top: 2rem">
            <b-carousel
            id="mainCarousel"
            v-model="slide"
            :interval="4000"
            img-width="100%"
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
            >
                <b-carousel-slide img-src="../../../assets/banner-pago-doble.png"></b-carousel-slide>
            </b-carousel>
        </div>
        <div class="col-10 mobileCarrousel" style="margin: auto; margin-top: 2rem">
            <b-carousel
            id="mainCarousel"
            v-model="slide"
            :interval="4000"
            img-width="100%"
            style="text-shadow: 1px 1px 2px #333;"
            @sliding-start="onSlideStart"
            @sliding-end="onSlideEnd"
            >
                <b-carousel-slide img-src="../../../assets/banner-pago-doble.png"></b-carousel-slide>
            </b-carousel>
        </div>

    <b-container class="col-8">
      <b-row>
        <b-col>
          <br />
          <b-card class="section-card shadow-card my-2" id="card-baja" v-bind:class="{ 'expanded': isCardExpanded(0) }" >
            <h4 class="section-title" @click="toggleCard(0)">
              ¿A qué nos referimos con este trámite?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(0)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(0)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El formulario de reclamo por <b>Pago doble</b> implica solicitar la acreditación de saldo excedente de <b>tasa urbana</b> para ser utilizado en futuros pagos u otras tasas impagas.</div>
                </div>
                <div class="li-row first-p">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Mediante este trámite <b>el Municipio verificará que la documentación solicitada</b> y el <b>pago de tasas correspondientes estén cumplimentadas.</b></div>
                </div>
                <!-- <div class="li-row">
                  <div class="li-icon"><b-icon-info-circle font-scale="1" class="icon-orange"/></div>
                  <div class="li-content" style="width:100%">
                    <p class="li-title">El trámite de devolución de tributo por doble pago se encuentra regido por el Decreto 3064/2023. </p>
                  </div>
                </div> -->
              </div>
            </transition>
          </b-card>
          <b-card class="section-card shadow-card my-2" id="card-habilitacion">
            <h4 class="section-title" @click="toggleCard(18)">
              ¿Quién puede solicitar la acreditación del saldo?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(18)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(18)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El <b>Titular del inmueble por el cual se reclama</b> ó</div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El <b>Representante o Apoderado/a de la persona interesada</b> con documentación que acredite el carácter de tal. <b-icon-question-circle-fill @click="openPopup('A')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card class="section-card shadow-card my-2">
            <h4 class="section-title" @click="toggleCard(19)">
              ¿Qué documentos se necesitan para demostrar el doble pago?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(19)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(19)">
                <div class="li-row first-li"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">DNI del solicitante (imagen del frente y dorso).</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Comprobantes que demuestren que el pago se ha efectuado más de una vez.</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Acreditación de titularidad de la cuenta. Esto puede realizarse a través de la presentación de la Escritura traslativa de dominio del inmueble / Boleto de Compraventa o afín, con el correspondiente Impuesto de Sellos Provincial y firma certificada por Escribano Público, Entidad Bancaria o Autoridad Administrativa / OTROS.</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Planilla de Autorización de Trámite legalizada o poder autorizado por escribano (únicamente si el trámite es iniciado mediante representante o apoderado/a).</div></div>
                <div class="separador-top">
                  <p>Los <b>documentos</b> deberán encontrarse <b>digitalizados</b> (podés escanearlos o sacarles una foto) y deben <b>ser legibles</b>. Pueden encontrarse <b>en formato pdf o imagen</b> y tener un <b>peso máximo de 15 Mb</b>.</p>
                </div>
                <b-card border-variant="warning" align="center" class="importante-card" >
                  <b-card-text>
                    <b-row >
                      <b-col md="2">
                        <b-icon-exclamation-triangle variant="warning" font-scale="5"></b-icon-exclamation-triangle>
                        <p class="li-title"><u><b>¡Importante!</b></u></p>
                      </b-col>
                      <b-col  md="10">
                          <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Una vez completado el formulario, el Dpto. Recaudaciones se comunicará a través del correo electrónico oficial (recaudaciones@gesell.gob.ar), indicándote los pasos a seguir.</div></div>
                      </b-col>
                    </b-row>
                  </b-card-text>
                </b-card>
            </div>
            </transition>
          </b-card>
          <b-card class="section-card FAQs-card" v-bind:class="{ 'expanded': isCardExpanded(15) }">
            <h4 class="section-title" @click="toggleCard(15)">Preguntas Frecuentes
              <b-icon-chevron-compact-down v-if="!isCardExpanded(15)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(15)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cómo finaliza el trámite?</p>
                    <p>Una vez completado el formulario, el Dpto. Recaudaciones se comunicará a través del correo electrónico oficial (<a href="mailto:recaudaciones@gesell.gob.ar" target="_blank" class="external-link">recaudaciones@gesell.gob.ar</a>), indicándote los pasos a seguir y los costos administrativos del trámite.</p>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Por qué no cargan mis archivos?</p>
                    <p>Puede ser que los archivos que quieras cargar superen el peso máximo soportado. En ese caso, te sugerimos reducirlos con alguna herramienta digital (por ejemplo: <a href="https://www.ilovepdf.com/es/comprimir_pdf" target="_blank" class="external-link">ilovepdf</a>, <a href="https://www.camscanner.com/es-es" target="_blank" class="external-link">camscanner</a>, entre otras). Si el problema persiste podés comunicarte con <a href="mailto:recaudaciones@gesell.gob.ar" target="_blank" class="external-link">recaudaciones@gesell.gob.ar</a></p>
                  </div>
                </div>
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cómo cargo varias imágenes en un campo único del formulario?</p>
                    <p>En caso de que el archivo que vayas a subir tenga varias páginas (y, por ejemplo, vos las hayas fotografiado) deberás compilarlas en un único archivo pdf. Para ello existen diversas herramientas digitales (por ejemplo, <a href="https://www.ilovepdf.com/es/jpg_a_pdf" target="_blank" class="external-link">ilovepdf</a>) que te permiten hacerlo de manera sencilla y gratuita. </p>
                  </div>
                </div>
              </div>
            </transition>
          </b-card>
          <!-- <b-card id="normas" class="section-card shadow-card my-2">
            <h4 class="section-title" @click="toggleCard(21)">
              Condiciones legales
            </h4>
            <transition name="expand">
              <div>
                <p class="first-li">
                  El trámite de devolución de tributo por doble pago se encuentra regido por el Decreto 3064/2023.
                  <a href="https://arvige.gob.ar/legislacion/pdf/12" target="_blank" class="external-link">(Ord.1958/04 (TO2024)</a>.
                </p>
              </div>
            </transition>
          </b-card> -->
        <b-button variant="success" class="float-right btn-form" @click="showPopupConf()">Iniciar Trámite</b-button>
        </b-col>
      </b-row>
    </b-container>

    <!-- Popups -->
    <b-modal v-model="showPopupA"  :hide-footer="true" @click-outside="showPopupA = false" :header-bg-variant="'success'" centered>
        <template #modal-header>
          <div class="modal-info">
            <h5>
                <b-icon icon="question-circle" scale="1.25" variant="light" ></b-icon>
                Información Adicional
            </h5>
          </div>
            <button type="button" aria-label="Close" class="close" @click="showPopupA = false">×</button>
        </template>
        <div class="modal-info popupApoderado">
          <h3>Representante o Apoderado/a</h3>
          <p class="destacado"><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill >Esta figura permite facultar a una persona para la realización de trámites, actos y gestiones en representación del/la contribuyente o responsable solicitante.</p>
          <h6>Casos de Representación:</h6>
          <p><span class="icon-orange">1) </span><b>Representante Voluntario:</b> Persona que actúa en nombre y por cuenta de otra, en virtud de la facultad que ella le confiere mediante un mandato (poder o autorización).</p>
          <p><span class="icon-orange">2) </span><b>Representante Legal:</b> Persona que actúa en nombre y por cuenta de una Persona Jurídica en virtud del carácter que posee por integrar los órganos de mando. Asimismo, los padres que ejercen la patria potestad sobre sus hijos/as.</p>
          <p><span class="icon-orange">3) </span><b>Representante Judicial:</b> Persona que actúa en nombre y por cuenta de otra (Humana o Jurídica) en virtud de una designación judicial, debido a una incapacidad legal que recae sobre aquella.</p>
          <p><span class="icon-orange">4) </span><b>Sucesiones Indivisas:</b> Casos en que, existiendo varios/as herederos/as, todos/as son propietarios/as de los bienes, pero aún no se ha realizado la división de los mismos en la proporción que cada uno/a tiene derecho a heredar.</p>
          <p><span class="icon-orange">5) </span><b>Herederos/as o Legatarios/as (Causahabientes):</b> Sucesor/a de una persona fallecida (actuación ante el Fisco previa al inicio de la sucesión o iniciada ésta, previa a la declaratoria de herederos/as).</p>
        </div>
    </b-modal>
    <b-modal v-model="showPopupB" title="" :hide-footer="true" @click-outside="showPopupB = false" :header-bg-variant="'success'" centered>
        <template #modal-header>
          <div class="modal-info">
            <h5>
                <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
                Información Adicional
            </h5>
          </div>
            <button type="button" aria-label="Close" class="close" @click="showPopupB = false">×</button>
        </template>
        <div class="modal-info modal-plano">
          <div>
            <h6>Tipos de Plano para cargar</h6>
            <p><span class="icon-orange">1. </span>Plano Conforme a obra o Medición Aprobado.</p>
            <p><span class="icon-orange">2. </span>Plano Conforme a obra o Medición Registrado.</p>
          </div>
          <div class="parrafo">
            <h6>¿Cómo identificar los tipos de plano?</h6>
            <p><b-icon-check scale="1.25" class="icon-orange"></b-icon-check>Verificá el sello impuesto en la carátula de tu plano. Esta puede indicar: <i class="icon-green">Conforme a obra o Medición Aprobado o Conforme a obra o Medición Registrado.</i></p>
          </div>
          <div class="parrafo">
            <div style="width: 64%; display: inline-block; vertical-align:top;">
            <h6>¿Cómo digitalizar el plano?</h6>
              <p><b-icon-check scale="1.25" class="icon-orange"></b-icon-check>Sacá una <b>fotografía</b> de la <b>carátula</b> y del <b>sector del plano donde se encuentra el local a habilitar</b>. Éste debe estar claramente <b>identificado</b> con una <b>cruz</b> en lápiz.</p>
              <p><b-icon-check scale="1.25" class="icon-orange"></b-icon-check>Luego, uní las imagenes en un pdf con alguna herramienta digital (como <a href="https://www.ilovepdf.com/es/jpg_a_pdf" class="external-link" target="_blank">ilovepdf</a>).</p>
              <p><b-icon-check scale="1.25" class="icon-orange"></b-icon-check>Podés ver un ejemplo haciendo click en la imagen. <i>Ahí te indicamos cómo identificar el tipo de plano y cómo señalar la unidad funcional donde se ubicará tu comercio.</i></p>
            </div>
            <div style="width: 35%; display: inline-block; max-width:165px; margin-top:1rem">
              <a href="https://drive.google.com/file/d/11JlAeO_87e-mslA7W_VAAoDEfou48WrU/view" target="_blank"><img src="../../../assets/ej-plano.jpg" width="100%" height="fit-content" /></a>
            </div>
          </div>
        </div>
    </b-modal>
    <!-- Popup de advertencia -->
    <b-modal v-model="showConfirmationPopup" hide-footer :header-bg-variant="'success'" centered>
        <template #modal-header>
          <div class="confirmation-popup-header">
              <b-icon icon="exclamation-triangle" scale="2" variant="light" ></b-icon>
            </div>
        </template>
        <div class="confirmation-popup-body">
          <h2 class="icon-orange"><b>IMPORTANTE</b></h2>
          <p>Antes de continuar tené en cuenta lo siguiente:</p>
          <div class="li-row">
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">La documentación presentada deberá encontrarse actualizada, es decir que debe haber sido expedida dentro del plazo de los últimos 30 días.</div>
          </div>
          <div class="li-row">
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Recordá que los documentos deben ser legibles, estar subidos en formato imagen o pdf y tener un peso máximo de 15 mb.</div>
          </div>
          <div class="form-check">
              <input class="form-check-input" type="checkbox" id="documentCheckbox" v-model="documentCheckboxChecked"/>
              <label class="form-check-label" for="documentCheckbox">Ya tengo todos los documentos digitalizados y la información requerida.</label>
          </div>
          <div class="text-center mt-3">
              <nuxt-link :class="{ 'disabled': !documentCheckboxChecked }" :to="{path: '/recaudaciones/pagos_dobles/form' }">
              <b-btn variant="success" :disabled="!documentCheckboxChecked" @click="proceedToForm()" >
                  Aceptar
              </b-btn>
              </nuxt-link>
          </div>
        </div>
    </b-modal>
  </div>
</template>

<script>

export default({
  data(){
    return{
      showConfirmationPopup: false,
      showPopupA: false,
      showPopupB: false,
      documentCheckboxChecked: false,
      expandedCards: [],
    }
  },
  methods:{
    showPopupConf(){
      this.showConfirmationPopup = true
    },
    openPopup(name){
      this.showPopupA = true
    },
    toggleCard(cardIndex) {
      if (this.expandedCards.includes(cardIndex)) {
        this.expandedCards = this.expandedCards.filter((index) => index !== cardIndex);
      } else {
        this.expandedCards.push(cardIndex);
      }
    },
    isCardExpanded(cardIndex) {
      return this.expandedCards.includes(cardIndex);
    },
    proceedToForm() {
      this.showConfirmationPopup = false;
    },
  }
})
</script>


<style scoped>
.btn-secondary{
  background-color: #daa511 !important;
  border: none;
}
.mainCarrousel{
    display: block;
  }
  .mobileCarrousel{
    display: none;
  }
@media (max-width: 1200px) {
  .col-8{
    max-width: 80%;
  }
  .importante-card p{
    font-size: 0.8rem;
  }
  .importante-card .col-md-2{
    padding: 0;
  }
  .videoTuto{
    width: 100%;
  }
  .botonera-container .row div .selected{
    border: #0c681a 2px solid;
    -webkit-border-radius: 00px;
    -moz-border-radius: 00px;
    border-radius: 00px;
    cursor: auto;
  }
  .mainCarrousel{
    display: block;
  }
  .mobileCarrousel{
    display: none;
  }
  .botonera-container .row div{
    /*Opcion 1. 2 botones por fila*/
  width: 50%;
  margin: 0.5rem auto;
    /* Opcion 2. 1 boton por fila
  width: 100%;
  margin: 0.5rem 10%;
    */
  }
}
@media (max-width: 720px){
  .mainCarrousel{
    display: none;
  }
  .mobileCarrousel{
    display: block;
  }
  .col-8{
    max-width: 90%;
  }
  .botonera-container .row div{
    /*Opcion 1. 2 botones por fila*/
  width: 50%;
  margin: 0.5rem auto;
    /* Opcion 2. 1 boton por fila
  width: 100%;
  margin: 0.5rem 10%;
    */
  }
  .botonera-container .row div img{
    margin: 0 !important;
  }
}
p, .li-content{
  font-family: Calibri, 'Trebuchet MS', sans-serif;
}
.importante-card .li-content{
  text-align: left;
  margin-bottom: 1rem;
}
.importante-card .card-body{
  padding-bottom: 0.25rem;
}
.importante-card .col-md-2 .li-title{
    margin-bottom: 1rem;
}
.separador-top{
  border-top: 1px solid #ccc;
  padding: 2rem 0;
  margin-top: 2rem;
  text-align: center;
}
.btn-form{
  margin: 15px 0;
}
.confirmation-popup-header{
 margin: auto;
 font-size: 2rem;
}
.confirmation-popup-body h2{
  text-align: center;
  font-size: 2.5rem;
}
.confirmation-popup-body h2 b{
  padding: 0 5%;
  border-bottom: 1px solid #ccc;
}
.confirmation-popup-body p{
  text-align: center;
  font-size: 1.25rem;
  color: black;
}
.confirmation-popup-body .form-check{
  margin: auto;
  margin-top: 1rem;
}
.confirmation-popup-body .li-content{
  color: black;
}
.btn{
  background-color: #0c681a;
  border-color: #0c681a;
}
.btn:hover{
  background-color: green;
  border-color: green;
}
.modal h5{
  color: white !important;
  font-weight: bold;
  font-size: 1.5rem;
}
.modal .modal-subtitle{
  font-size: 1.25rem;
  color: #0c681a !important;
}
.modal-dialog{
  max-width: 600px;
}
.modal-body{
  padding: 1.5rem 1rem;
}
.modal-content .bg-danger{
  background-color: #e53749 !important;
}
.modal-content .bg-success{
  background-color: #0c681a !important;
}
.popupApoderado{
  padding-left: 6%;
}
.modal-info h3{
  color: #0c681a !important;
  font-weight: bold;
  font-size: 1.6rem;
  padding-bottom: 0.5rem;
  margin-top: 0;
}
.modal-info h5{
  font-size: 1.5rem;
  padding: 0.75rem 0;
}
.modal-info h6{
  font-size: 1.5rem;
  font-weight: bold;
  color: #0c681a;
  margin: 1rem 0;
}
.modal-info .destacado{
  border-bottom: 2px solid #ccc;
  border-top: 2px solid #ccc;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: #666;
}
.modal-info .bi-question-circle{
  margin-right: 1rem;
  padding-right: 0.5rem;
  border-right: 1px solid #FFF;
}
.modal-info p, .modal-info .bi-caret-right-fill{
  display: inline-block;
}
.modal-info .bi-caret-right-fill{
  margin-right: 1rem;
  color: #E27910;
  vertical-align: top;
  margin-top: 0.35rem;
  font-size: 1rem;
}
.modal-info ol b, .modal-info a, .popupApoderado b{
  color: #0c681a;
}
.modal-info p{
  color: #666;
}
.modal-plano .parrafo{
  border-top: #ccc 1px solid;
  padding-top: 1rem;
  margin-top: 1rem;
}
.modal-plano .parrafo{
  border-top: #ccc 1px solid;
  padding-top: 1rem;
  margin-top: 1rem;
}
.modal-plano .parrafo p{
  margin-bottom: 0.5rem;
}
.modal-plano h6{
  margin-top: 0;
  font-size: 1.25rem;
}
.modal-plano p{
  margin-bottom: 0;
}
.popupApoderado b{
  font-weight: 600;
}
.banner-icon{
  width: 100%;
  height: 100%;
  margin: auto;
}
.sangria{
  margin-left: 25px;
  margin-bottom: 10px;
}
.icon-orange{
  color: #E27910;
}
.icon-green{
  color: #0c681a;
}
.texto-introd{
  font-size: 1.3rem;
}
.external-link {
  color: #0c681a;
  text-decoration: underline;
}
.popup-link {
  color: #0c681a;
  font-weight: bold;
}
.disabled {
  pointer-events: none;
}
.datosCatastralesContainer *{
  text-align: center;
}
.section-card{
  margin: 1rem 0;
  padding: 0.5rem 0;
  box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
  -webkit-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
}
.section-title {
  color: #0c681a !important;
  cursor: pointer;
  width: 100%;
  display: inline-block;
  margin-bottom:0px;
  font-weight: bold;
}
.subtitle{
  color: #0c681a !important;
  font-weight: bold;
  font-size: 1rem;
  margin: 10px 0;
}
.bi-chevron-compact-up, .bi-chevron-compact-down{
  position: absolute;
  right: 20px;
}
.bi-question-circle-fill{
  cursor: pointer;
}
.bi-check-circle-fill, .bi-question-circle-fill, .bi-person-circle{
  margin-right: 5px;
}
ul{
  list-style-type: none; /* Elimina los puntos por defecto */
  padding: 0;
}
.li-icon, .li-title{
  font-weight: 600;
  color: #0c681a;
}
.li-icon, .li-content{
  display: inline-block;
}
.li-title{
  margin-bottom: 0.3rem;
}
.li-icon{
  margin-right: 1%;
  vertical-align: top;
}
.li-row{
  display: flex;
  width: 100%;
}
.first-li{
  margin-top: 1rem;
}
.first-p{
  margin-bottom: 1rem;
}
.FAQs-card .li-row{
  margin-top: 1rem;
}
.li-content .li-row{
  margin-top: 0;
}
.li-icon, .li-content{
  display: inline-block;
}
.li-p{
  margin-bottom: 1rem;
}
/* Estilos para Animaciones de Expansión/Contracción  */
.expanded {
  max-height: 3000px; /* Altura máxima cuando está expandido */
}

.expand-enter-active,
.expand-leave-active {
  transition: max-height 2s ease-out; /* Duración de la animación */
}

.expand-enter,
.expand-leave-to {
  max-height: 0; /* Altura inicial y final de la animación */
  overflow: hidden;
}
.botonera h2{
  font-weight: bold;
  margin: 0.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px #666 solid;
}
.botonera{
  margin-top: 2rem;
}
.botonera-container .btn-container{
  width: 100%;
  height: 80%;
  border: 1px solid grey;
  padding: 1rem;
  margin: 1rem 0.5rem;
  cursor: pointer;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
}
.botonera-container .btn-container p{
  width: 55%;
  color: green;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid grey;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.5rem;
}
.botonera-container .btn-container .b-icon{
  width: 2rem;
}
.botonera-container .row div img{
  margin: 1rem 0.5rem;
  cursor: pointer;
}
.botonera-container .row div .selected{
  border: #0c681a 2px solid;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  border-radius: 15px;
  cursor: auto;
}
.botonera-container .row div .disabled{
  opacity: 0.5;
}
#btnB, #btnH {
  scroll-behavior: smooth;
}
</style>
