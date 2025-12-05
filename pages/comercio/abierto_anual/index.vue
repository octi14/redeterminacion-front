<template>
    <div class="page main-background">
        <Banner title="Comercio Abierto Anual"/>
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
                <b-carousel-slide img-src="../../../assets/banner-abierto-anual.png"></b-carousel-slide>
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
                <b-carousel-slide img-src="../../../assets/banner-abierto-anual-mobile.png"></b-carousel-slide>
            </b-carousel>
        </div>
    <b-row>
        <b-col class="col-md-8 mx-auto">
          <br />
          <b-card class="section-card" id="card-baja" v-bind:class="{ 'expanded': isCardExpanded(0) }">
            <h4 class="section-title" @click="toggleCard(0)">
              ¿Qué es el beneficio de Abierto Anual?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(0)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(0)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">
                    Es un <b>descuento del 60% </b>(sesenta por ciento) del valor <b>de la Tasa por Inspección de  Seguridad e Higiene</b> correspondiente al año fiscal 2026, otorgado en virtud del Artículo 182 de la <a href="https://arvige.gob.ar/legislacion/pdf/12" class="text-success">Ordenanza Fiscal 2156/08 (TO2025).</a></div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(1) }">
            <h4 class="section-title" @click="toggleCard(1)">
              ¿Quiénes son beneficiarios de Abierto Anual?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(1)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(1)">
                <div class="li-row first-li"><div class="li-content">
                    Los/las <b>contribuyentes</b> que ante evaluacion del Municipio <b>acrediten</b> que:</div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">
                    Sus <b>establecimientos</b> hayan permanecido <b>con actividad</b> en forma <b>permanente durante el ejercicio fiscal anterior y no
                    posean deudas</b> con la Municipalidad.</div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">
                    Sus <b>establecimientos</b> hayan permanecido <b>con actividad</b> en forma <b>permanente durante los fines de semana del ejercicio anterior y
                     no posean deudas</b> con la Municipalidad.</div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">
                    Sus establecimientos dispongan de la <b>Renovación o Reempadronamiento</b> comercial correspondiente.</div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(2) }">
            <h4 class="section-title" @click="toggleCard(2)">
              ¿Quienes están excluidos del beneficio de Abierto Anual?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(2)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(2)">
                <div class="li-row first-li">
                  <div class="li-content mb-1"> Están <b>excluidos</b> del Beneficio: </div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content">Aquellos/as <b>contribuyentes que no hayan acreditado</b>, ante la evaluación del Municipio, <b>contar con un comercio con
                   actividad permanente durante el ejercicio fiscal anterior</b>. </div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content"> Los <b>Grandes Contribuyentes</b> incluidos en los Artículos 181 bis a 181 noveno de la <a href="https://arvige.gob.ar/legislacion/pdf/12" class="text-success">Ordenanza Fiscal 2156/08 c/ Mod</a>. </div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(3) }">
            <h4 class="section-title" @click="toggleCard(3)">¿Qué requisitos se necesitan para obtener el beneficio de Abierto Anual?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(3)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(3)">
                <div class="li-row first-li"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content">Poseer una <b>Habilitación Comercial</b> en el Partido de Villa Gesell, con su correspondiente <b>Renovación o Reempadronamiento comercial</b> correspondientes efectuados en tiempo y forma. </div>
                </div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content"><b>No</b> poseer <b>deudas en  concepto de Tasas, Derechos, Contribuciones o Multas con el Municipio</b>.</div>
                </div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content">No ser un contribuyente excluido del beneficio acorde Ord. 2156/08 c/ Mod. </div>
                </div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content"><b>Realizar</b> el procedimiento de <b>carga de datos</b> según lo previsto por la Autoridad de Aplicación.</div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card id="normas" class="section-card" v-bind:class="{ 'expanded': isCardExpanded(4) }">
            <h4 class="section-title" @click="toggleCard(4)">
              ¿Qué documentación se necesita para obtener el Beneficio de Abierto Anual?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(4)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(4)">
                <div class="li-row first-li mb-1"><p>Una <b>factura digital</b> o una <b>fotografía de la factura emitida en formato papel</b>, correspondiente a los
                   siguientes tres períodos del año en curso: </p></div>
                  <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                    <div class="li-content"><p><b>Período 1 (2/5/25 al 31/5/25):</b> Se deberá cargar una factura emitida durante el mes de <i>Mayo</i>.</p></div>
                  </div>
                  <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                    <div class="li-content"><p><b>Período 2 (1/8/25 al 31/8/25):</b> Se deberá cargar una factura emitida durante el mes de <i>Agosto</i>.</p></div>
                  </div>
                  <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                    <div class="li-content"><p><b>Período 3 (1/10/25 al 31/10/25):</b> Se deberá cargar una factura emitida durante el mes de <i>Octubre</i>.</p></div>
                  </div>
                  <b-card border-variant="warning" align="center" class="importante-card" >
                    <b-card-text>
                      <b-row >
                        <b-col md="2">
                          <b-icon-exclamation-triangle variant="warning" font-scale="4"></b-icon-exclamation-triangle>
                          <p class="li-title"><u><b>¡Importante!</b></u></p>
                        </b-col>
                        <b-col  md="10">
                          <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Las <b>facturas</b> deberán ser <b>digitales</b> (en caso de tenerlas en formato papel <b>podés escanearlos o sacarles una foto</b>) y deben ser <b>legibles</b>. Pueden encontrarse en formato pdf o imagen y tener un peso máximo de 15Mb.</div></div>
                          <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Los <b>periodos de recepción</b> de las facturas serán <b>definidos</b> por la <b>Autoridad de Aplicación</b> en el transcurso del año. Estos periodos <b>serán notificados al DFE</b> de la persona interesada <b>y publicitados en las vías oficiales</b> de comunicación <b>del Municipio</b>.</div></div>
                          <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Las <b>facturas</b> deberán <b>corresponder a ventas efectivamente producidas en los períodos descriptos.</b>.</div></div>
                        </b-col>
                      </b-row>
                    </b-card-text>
                  </b-card>
              </div>
            </transition>
          </b-card>
          <b-card id="datos" class="section-card" v-bind:class="{ 'expanded': isCardExpanded(5) }">
            <h4 class="section-title" @click="toggleCard(5)">
              ¿Cómo se realiza la carga y verificación de la documentación?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(5)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(5)">
                <div class="li-row first-li">
                  <div class="li-icon">
                    <p class="icon-orange">1. </p>
                  </div>
                  <div class="li-content">
                    <p><b>Leé</b> atentamente la <b>notificación</b> que recibiste y los <b>requisitos</b> que están aquí descriptos.</p>
                  </div>
                </div>
                <div class="li-row other-li">
                  <div class="li-icon">
                    <p class="icon-orange">2. </p>
                  </div>
                  <div class="li-content">
                    <p>Una vez leída la información, <b>escribí tu número de legajo comercial</b> (indicado en la notificación recibida) y tu <b>CUIM/CUIT</b>. </p>
                  </div>
                </div>
                <div class="li-row other-li">
                  <div class="li-icon">
                    <p class="icon-orange">3. </p>
                  </div>
                  <div class="li-content">
                    <p>En la pantalla de “carga de documentación” <b>seleccioná el período que se encuentra habilitado y cargá una factura</b> (digital o fotografía de la boleta impresa) que haya sido <b>emitida durante el mes indicado</b>.</p>
                  </div>
                </div>
                <div class="li-row other-li">
                  <div class="li-icon">
                    <p class="icon-orange">4. </p>
                  </div>
                  <div class="li-content">
                    <p>Una vez cargada, <b>ARVIGE revisará</b> que <b>la factura</b> sea correcta:</p>
                    <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="0.75" class="icon-orange" shift-v="3px"></b-icon-caret-right-fill></div>
                      <div class="li-content mini-content"><p>Si la <u>factura es correcta</u>, <b>no recibirás notificaciones en tu Domicilio Fiscal Electrónico (DFE)</b>. Para más información lee atentamente el paso 5.</p></div>
                    </div>
                    <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="0.75" class="icon-orange" shift-v="3px"></b-icon-caret-right-fill></div>
                      <div class="li-content mini-content"><p>Si la <u>factura es incorrecta</u> o la carga fue errónea (por ejemplo, se subió una imagen donde la fecha no coincide con el período a acreditar) <b>se te notificará por DFE que deberás volver a efectuar la carga en un plazo de tiempo determinado</b>. Si no tenes constituido tu DFE podés iniciar el trámite enviando un mail a <a href="mailto:dirarvige@gesell.gob.ar" target="_blank" class="icon-green">dirarvige@gesell.gob.ar</a></p></div>
                    </div>
                    <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="0.75" class="icon-orange" shift-v="3px"></b-icon-caret-right-fill></div>
                      <div class="li-content mini-content"><p><i>En caso que no dispongas de DFE no se te notificará el error y deberás continuar en el paso 5.</i></p></div>
                    </div>
                  </div>
                </div>
                <div class="li-row other-li">
                  <div class="li-icon">
                    <p class="icon-orange">5. </p>
                  </div>
                  <div class="li-content">
                    <p>Si la persona que solicita el beneficio desea <b>verificar el estado de carga de su boleta, podrá hacerlo en esta misma página</b>. Para eso, <b>deberá ingresar nuevamente los datos requeridos</b> y revisar en “carga de documentación” si la misma fue aceptada o rechazada:</p>
                    <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="0.75" class="icon-orange" shift-v="3px"></b-icon-caret-right-fill></div>
                      <div class="li-content mini-content"><p>Si la <u>factura es correcta</u> podrá ver la fecha en la que fue verificada por ARVIGE.</p></div>
                    </div>
                    <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="0.75" class="icon-orange" shift-v="3px"></b-icon-caret-right-fill></div>
                      <div class="li-content mini-content"><p>Si la <u>factura fue rechazada</u>, podrá visualizar en la página la información necesaria para la rectificación de la misma en el periodo fijado a esos efectos.</p></div>
                    </div>
                  </div>
                </div>
                <div class="li-row other-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">Para visualizar como realizar tu trámite, podés mirar este video tutorial</p>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/NKZWxjCh1l4?si=SCCPendq9R_daKRK" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                  </div>
                </div>
                <p class="first-li separador-top"><b>El trámite concluye a fin de año (2025) y es requisito que hayas cargado 3 facturas (una por cada período) para obtener el Beneficio de Comercio Abierto Anual.</b></p>
              </div>
            </transition>
          </b-card>
          <b-card id="datos" class="section-card" v-bind:class="{ 'expanded': isCardExpanded(5) }">
            <h4 class="section-title" @click="toggleCard(6)">
              Preguntas frecuentes
              <b-icon-chevron-compact-down v-if="!isCardExpanded(6)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(6)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Qué sucede si mi comercio se encontraba cerrado por causas justificadas durante el período a acreditar?</p>
                    <p >En caso de no poder realizar el envío de alguna de las facturas en los períodos indicados (el establecimiento se encontraba cerrado por vacaciones, el comercio se encontraba en refacción ou otra causa justificada que haga que no se adecue a lo determinado en el Artículo citado en la Referencia) <u>deberá acreditarse la facturación completa (Resumen Z) efectuada el último día más próximo al que debió acreditarse la misma</u>. Por ejemplo: El local permaneció cerrado en Agosto por reparaciones; deberá presentarse el Resumen Z del 31 de Julio.</p>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Qué sucede si no envié a tiempo las tres facturas solicitadas?</p>
                    <p>En caso de no cumplirse con el envío de las 3 facturas solicitadas en los períodos indicados previamente SE PODRÁN ACREDITAR desde el 1 al 30 DE NOVIEMBRE DE 2025 siendo este el último plazo de acreditación posible. <b>Extinguido el plazo no podrá reclamarse el beneficio.</b></p>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Qué sucede si fui categorizado/a como Gran Contribuyente?</p>
                    <p>Aquellos/as contribuyentes que accedieron a la recategorización como Grandes Contribuyentes no son pasibles de gozar del beneficio.</p>
                  </div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-row>
            <b-col>
              <b-button variant="success" class="float-right btn-form" @click="openPopup('Form')">Iniciar Trámite</b-button>
              <!-- <b-button variant="success" class="float-right btn-form" @click="openPopup('ClosedPeriod')">Iniciar Trámite</b-button> -->
            </b-col>
          </b-row>
        </b-col>
      </b-row>
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
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Recordá que los documentos deben ser legibles, estar subidos en formato imagen o pdf y tener un peso máximo de 15 mb.</div>
          </div>
          <div class="form-check">
              <input class="form-check-input" type="checkbox" id="documentCheckbox" v-model="documentCheckboxChecked"/>
              <label class="form-check-label" for="documentCheckbox">Ya tengo todos los documentos digitalizados y la información requerida.</label>
          </div>
          <div class="text-center mt-3">
              <nuxt-link :class="{ 'disabled': !documentCheckboxChecked }" :to="{path: '/comercio/abierto_anual/form'}">
              <b-btn variant="success" :disabled="!documentCheckboxChecked" @click="proceedToForm()" >
                  Aceptar
              </b-btn>
              </nuxt-link>
          </div>
        </div>
    </b-modal>
    <!-- Popup de solicitud de libredeuda -->
    <b-modal v-model="showLibreDeudaPopup" title="" @hide="resetForm" :header-bg-variant="'success'" hide-footer centered>
      <template #modal-header>
        <div class="modal-info">
          <h5>
              <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
              Información Adicional
          </h5>
        </div>
            <button type="button" aria-label="Close" class="close" @click="showLibreDeudaPopup = false">×</button>
      </template>
      <div class="modal-info">
        <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>En el encabezado de cada factura se indica si tu partida registra deuda o no lo hace. Hacé click en la imagen y verificá cómo se visualiza.</p>
        <div style="width: 100%">
          <a href="http://haciendavgesell.gob.ar/_nuxt/img/ej-libredeuda.78769c7.jpg" target="_blank"><img src="../../../assets/ej-libredeuda.jpg" width="100%" height="fit-content" /></a>
        </div>
      </div>
    </b-modal>
    <!-- Popup de periodo cerrado -->
    <b-modal v-model="showClosedPopup" hide-footer :header-bg-variant="'success'" centered   no-close-on-backdrop no-close-on-esc>
      <template #modal-header>
        <div class="closed-popup-header">
            <b-icon icon="exclamation-triangle" scale="2" variant="light" ></b-icon>
        </div>
            <button type="button" aria-label="Close" class="close" @click="showClosedPopup = false" style="position: absolute; right: 15px; top: 15px;">×</button>
      </template>
      <div class="closed-popup-body">
        <h2 class="icon-orange"><b>IMPORTANTE</b></h2>
        <p >El plazo para acreditar las facturas del año 2025 ha expirado.</p>

        <div class="li-row">
          <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Por cualquier reclamo comunicate con <a href="mailto:dirarvige@gesell.gob.ar" class="text-success">ARVIGE</a> para conocer los pasos a seguir.</div>
        </div>

        <div class="text-center mt-3">
            <b-btn variant="success" @click="showClosedPopup = false">
                Aceptar
            </b-btn>
        </div>
      </div>
    </b-modal>
    </div>

  </template>

  <script>
  import rubros from "@/plugins/rubros.js";
  import abiertoAnualConfig from '~/plugins/abiertoAnualConfig';
  export default {
    data:function() {
      return {
        config: abiertoAnualConfig,
        slide: 0,
        sliding: null,
        filteredRubros: rubros,//.filter(rubro => rubro.requisitos.length > 0),
        showPopupA: false,
        showPopupB: false,
        showPopupC: false,
        showPopupD: false,
        showPopupE: false,
        showConfirmationPopup: false,
        showLibreDeudaPopup: false,
        showPopupNroInmueble: false,
        showPopupConstanciaLibreDeudaSegHig: false,
        documentCheckboxChecked: false,
        showClosedPopup: false,
        captchaResponse: null,
        expandedCards: [],
      };
    },
    mounted() {
      this.filteredRubros.sort((a, b) => a.nombre.localeCompare(b.nombre));
      this.showClosedPopup = this.config.popUpAbiertoAnualCerrado;
    },
    methods: {
      onSlideStart(slide) {
        this.sliding = true
      },
      onSlideEnd(slide) {
        this.sliding = false
      },
      openPopup(type) {
        // Lógica para abrir el popup correspondiente según el tipo (A, B, C, D)
        if (type === 'A') {
          ("ShowPopup A")
          this.showPopupA = true;
        } else if (type === 'B') {
          this.showPopupB = true;
        } else if (type === 'C') {
          this.showPopupC = true;
        } else if (type === 'D') {
          this.showPopupD = true;
        } else if (type === 'E') {
          this.showPopupE = true;
        } else if (type === 'Form') {
          this.showConfirmationPopup = true;
        } else if (type === 'LibreDeuda') {
          this.showLibreDeudaPopup = true;
        } else if (type === 'NroInmueble'){
          this.showPopupNroInmueble = true;
        }else if (type === 'ConstanciaLibreDeudaSegHig'){
          this.showPopupConstanciaLibreDeudaSegHig = true;
        }else if (type === 'ClosedPeriod'){
          this.showClosedPopup = true;
        }
      },
      proceedToForm() {
        // Aquí puedes realizar alguna acción adicional si es necesario antes de redirigir al formulario
        this.showConfirmationPopup = false;
      },
      resetForm() {
        // Lógica para resetear el formulario
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
  }
  }
  </script>

<style scoped>
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
@media (max-width: 767.98px) {
  .page {
    overflow-x: hidden;
  }
  .col-md-8.mx-auto {
    max-width: calc(100% - 30px) !important;
    margin-left: 15px !important;
    margin-right: 15px !important;
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
  .col-md-8.mx-auto {
    max-width: calc(100% - 30px) !important;
    margin-left: 15px !important;
    margin-right: 15px !important;
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
.mini-content{
  font-size: 0.85rem ;
}
.importante-card{
  margin-top: 2rem;
}
.importante-card .li-row{
  margin-bottom: 1rem;
}
.importante-card .li-content, .card-foot{
  text-align: left;
  color: #353535;
}
.card-foot{
  text-align: center;
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
  color: #353535;
}
.btn-form{
  margin: 15px 0;
}
.confirmation-popup-header, .closed-popup-header{
 margin: auto;
 font-size: 2rem;
}
.confirmation-popup-body h2, .closed-popup-body h2{
  text-align: center;
  font-size: 2.5rem;
}
.confirmation-popup-body h2 b, .closed-popup-body h2 b{
  padding: 0 5%;
  border-bottom: 1px solid #ccc;
}
.confirmation-popup-body p, .closed-popup-body p{
  text-align: center;
  font-size: 1.25rem;
  color: black;
}
.confirmation-popup-body .form-check{
  margin: auto;
  margin-top: 1rem;
}
.confirmation-popup-body .li-content, .closed-popup-body .li-content{
  color: black;
}
.btn-success{
  background-color: #0c681a;
  border-color: #0c681a;
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
.other-li{
  margin-top: 0.35rem;
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
