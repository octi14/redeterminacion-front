<template>
  <div class="page main-background">
    <Banner title="Habilitaciones comerciales" />

    <div class="col-10 mainCarrousel" style="margin: auto; margin-top: 2rem">
      <b-carousel
        id="mainCarousel"
        v-model="slide"
        :interval="4000"
        controls
        indicators
        img-width="100%"
        style="text-shadow: 1px 1px 2px #333;"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <b-carousel-slide img-src="../../assets/habilita-en-simples-pasos.png"></b-carousel-slide>
        <b-carousel-slide img-src="../../assets/habilita-en-simples-pasos-2.png"></b-carousel-slide>
      </b-carousel>
    </div>
    <div class="col-12 moblieCarrousel" style="padding: 0 10%; margin-top: 0; background-color: #FFFEF7;">
      <b-carousel
        id="moblieCarousel"
        v-model="slide"
        :interval="4000"
        controls
        indicators
        img-width="100%"
        style="text-shadow: 1px 1px 2px #333;"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <b-carousel-slide img-src="../../assets/habilita-en-simples-pasos-mobile.png"></b-carousel-slide>
      </b-carousel>
    </div>

    <b-container class="col-8">
      <b-row>
        <b-col class="botonera">
          <h2 class="icon-green"><b-icon-question-octagon-fill class="icon-orange" scale="0.75"></b-icon-question-octagon-fill> ¿Qué trámite estás buscando?</h2>
          <div class="botonera-container">
            <b-row>
              <b-col lg="3" md="4" sm="6"><a href="#card-habilitacion" id="btnH"><img id="btn-Habilitación" width="100%" src="../../assets/btn/btn_habilitacion.png" @click="seleccionarTramite('Habilitación')"></a></b-col>
              <b-col lg="3" md="4" sm="6"><a href="#card-baja" id="btnB"><img id="btn-Baja" width="100%" src="../../assets/btn/btn_baja.png" @click="seleccionarTramite('Baja')"></a></b-col>
              <b-col lg="3" md="4" sm="6"><a href="#card-renovacion" id="btnR"><img id="btn-Renovación" width="100%" src="../../assets/btn/btn_renovacion.png" @click="seleccionarTramite('Renovación')"></a></b-col>
              <b-col lg="3" md="4" sm="6"><img id="btn-Cambio-Titular" class="disabled" width="100%" src="../../assets/btn/btn_cambio_titular.png" @click="seleccionarTramite('Cambio-Titular')"></b-col>
              <b-col lg="3" md="4" sm="6"><img id="btn-Cambio-Domicilio" class="disabled" width="100%" src="../../assets/btn/btn_cambio_domicilio.png" @click="seleccionarTramite('Cambio-Domicilio')"></b-col>
              <b-col lg="3" md="4" sm="6"><img id="btn-Anexo" class="disabled" width="100%" src="../../assets/btn/btn_anexo.png" @click="seleccionarTramite('Anexo')"></b-col>
              <b-col lg="3" md="4" sm="6"><img id="btn-Reempadronamiento" class="disabled" width="100%" src="../../assets/btn/btn_reempadronamiento.png" @click="seleccionarTramite('Reempadronamiento')"></b-col>
              <b-col lg="3" md="4" sm="6"><img id="btn-Anexo-Cambio" class="disabled" width="100%" src="../../assets/btn/btn_anexo_cambio.png" @click="seleccionarTramite('Anexo-Cambio')"></b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col v-if="tramiteSeleccionado=='Baja'">
          <br />
          <b-card class="section-card" id="card-baja" v-bind:class="{ 'expanded': isCardExpanded(0) }">
            <h4 class="section-title" @click="toggleCard(0)">
              ¿Qué significa realizar una Baja Comercial?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(0)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(0)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El trámite de Baja Comercial implica finalizar una Habilitación Comercial. Mediante este trámite el Municipio verificará que la documentación solicitada y el pago de tasas correspondientes estén cumplimentadas.</div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Una vez confirmada esta información se extiende al solicitante un certificado de Baja Comercial donde consta la desvinculación comercial con este Municipio.</div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(1) }">
            <h4 class="section-title" @click="toggleCard(1)">
              ¿Quién puede realizar una Baja Comercial?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(1)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(1)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El <b>Titular de la Habilitación Comercial</b> ó</div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El <b>Propietario/a del Inmueble</b> en el cual se encuentre situado el comercio habilitado. <i>En este último caso el contrato entre las partes debe estar finalizado y debe haber cesado la actividad comercial.</i></div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> En ambos casos podrá actuar un/a representante o apoderado/a de la persona interesada con documentación que acredite el carácter de tal. <b-icon-question-circle-fill @click="openPopup('A')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(2) }">
            <h4 class="section-title" @click="toggleCard(2)">
              ¿Qué documentación necesito para iniciar una Baja Comercial?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(2)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(2)">
                <div class="li-row first-li"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> DNI del solicitante <i>(imagen del frente y dorso)</i>. </div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Libre deuda de Tasa de Inspección de Seguridad e Higiene. <b-icon-question-circle-fill @click="openPopup('ConstanciaLibreDeudaSegHig')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Libre deuda de <a href="https://arvige.gob.ar/lpagos" target="_blank" class="external-link">Tasa por Servicios Urbanos</a> que afectan al local <i>(o última factura de pago que indique que la Tasa municipal no registra deuda)</i>. <b-icon-question-circle-fill @click="openPopup('LibreDeuda')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Libre deuda de <a href="https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?tramite=266&categ=34" target="_blank" class="external-link">Ingresos Brutos</a> <i>(Solo si la baja la solicita el titular de la habilitación)</i>. </div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Escritura traslativa de Dominio del Inmueble/ Contrato de locación / Boleto de Compraventa o afín, con el correspondiente Impuesto de Sellos Provincial y firma certificada por Escribano Público, Entidad Bancaria o Autoridad Administrativa (en caso de corresponder).</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Poder autorizado por escribano <i>(únicamente si el trámite es iniciado mediante representante o apoderado/a)</i>.</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <b>Personas Jurídicas:</b> Escritura constitutiva de la misma con designación actual de sus representantes.</div></div>
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
                        <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Una vez iniciado el trámite, recibirás un correo electrónico del Departamento Comercio (deptocomercio@gesell.gob.ar), indicandote los pasos para continuar.</div></div>
                        <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Tené en cuenta que la Baja será efectiva una vez que el Departamento Comercio haya verificado la documentación presentada, se haya abonado el valor del trámite y hayas obtenido el certificado respectivo.</div></div>
                    </b-col>
                  </b-row>
                </b-card-text>
              </b-card>
              </div>
            </transition>
          </b-card>
          <b-card class="section-card FAQs-card" v-bind:class="{ 'expanded': isCardExpanded(3) }">
            <h4 class="section-title" @click="toggleCard(3)">Preguntas Frecuentes
              <b-icon-chevron-compact-down v-if="!isCardExpanded(3)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(3)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Qué sucede si el/la titular de la baja se encuentra fallecido/a?</p>
                    <p >En caso de titular fallecido realizar la consulta correspondiente en <a href="mailto:deptocomercio@gesell.gob.ar" target="_blank" class="external-link">deptocomercio@gesell.gob.ar</a></p>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>Apellido y nombre del/la titular de la habilitación</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>Nro. de Expediente.</p></div>
                    </div>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Qué sucede si el/la titular del inmueble que iniciará el trámite no estaba registrado/a previamente?</p>
                    <p>En ese caso, deberás enviar un correo electrónico a: <a href="mailto:deptocomercio@gesell.gob.ar" target="_blank" class="external-link">deptocomercio@gesell.gob.ar</a></p>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cómo finaliza el trámite?</p>
                    <p>Una vez completado el formulario, el Dpto. Comercio se comunicará a través del correo electrónico oficial (<a href="mailto:deptocomercio@gesell.gob.ar" target="_blank" class="external-link">deptocomercio@gesell.gob.ar</a>), indicándote los costos administrativos del trámite. Una vez abonado, se te informará como obtener el certificado de baja comercial.</p>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cuál es el costo del trámite?</p>
                    <p>El costo del trámite se encuentra determinado en la Ordenanza 2156/08 (TO 2023).</p>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Por qué no cargan mis archivos?</p>
                    <p>Puede ser que los archivos que quieras cargar superen el peso máximo soportado. En ese caso, te sugerimos reducirlos con alguna herramienta digital (por ejemplo: <a href="https://www.ilovepdf.com/es/comprimir_pdf" target="_blank" class="external-link">ilovepdf</a>). Si el problema persiste podés comunicarte con <a href="mailto:deptocomercio@gesell.gob.ar" target="_blank" class="external-link">deptocomercio@gesell.gob.ar</a></p>
                  </div>
                </div>
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cómo cargo varias imágenes en un campo único del formulario?</p>
                    <p>En caso de que el documento que vayas a subir tenga varias páginas (y, por ejemplo, las hayas fotografiado) deberás compilarlas en un único archivo pdf. Para ello existen diversas herramientas digitales (por ejemplo, <a href="https://www.ilovepdf.com/es/jpg_a_pdf" target="_blank" class="external-link">ilovepdf</a>) que te permiten hacerlo de manera sencilla y gratuita. </p>
                  </div>
                </div>
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cómo puedo saber en qué estado se encuentra mi trámite?</p>
                    <p>Hacé click en el botón <a class="external-link" href="/consulta_tramite">consulta de trámites</a> que se encuentra en la página de inicio y escribí el número de trámite que te dio el sistema cuando completaste tu solicitud.</p>
                  </div>
                </div>
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">Para visualizar como realizar tu trámite, podés mirar este video tutorial</p>
                    <iframe class="videoTuto" width="560" height="315" src="https://www.youtube.com/embed/HJwZkfxsnOw?si=EszZ_Byjmv2-ysF8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                  </div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card id="normas" class="section-card" v-bind:class="{ 'expanded': isCardExpanded(4) }">
            <h4 class="section-title" @click="toggleCard(4)">
              Condiciones legales
              <b-icon-chevron-compact-down v-if="!isCardExpanded(4)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(4)">
                <p class="first-li">
                  La habilitación de comercios/industrias o asimilables deberá adecuarse a lo determinado en concordancia con leyes nacionales, provinciales y
                  <a href="https://arvige.gob.ar/legislacion/pdf/12" target="_blank" class="external-link">el Digesto de Habilitaciones Comerciales (Ord.1958/04 (TO2024)</a>.
                </p>
              </div>
            </transition>
          </b-card>
        <b-button variant="success" class="float-right btn-form" @click="openPopup('Form')">Iniciar Trámite</b-button>
        <br />
        </b-col>
        <b-col v-if="tramiteSeleccionado=='Habilitación'">
          <br />
          <b-card class="section-card" id="card-baja" v-bind:class="{ 'expanded': isCardExpanded(5) }">
            <h4 class="section-title" @click="toggleCard(5)">
              ¿Qué significa realizar una Habilitacion Comercial?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(5)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(5)">
                <div class="li-row first-li" style="margin-bottom: 1rem">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <p class="li-content">La Municipalidad de Villa Gesell dispone que toda persona humana o jurídica que pretenda ejercer el comercio, industria o actividad asimilable deberá, previo a su desarrollo dentro del Partido, solicitar la habilitación pertinente.</p>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Qué sucede si abro un local comercial sin realizar la habilitación correspondiente?</p>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>La omisión de la habilitación determinará la inmediata clausura del establecimiento, debiendo abonar la multa correspondiente para quienes cometieran tal infracción.</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>El establecimiento deberá permanecer cerrado hasta tanto regularice su trámite de habilitación.</p></div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card class="section-card" id="card-habilitacion" v-bind:class="{ 'expanded': isCardExpanded(6) }">
            <h4 class="section-title" @click="toggleCard(6)">
              ¿Quién puede iniciar una Habilitación Comercial?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(6)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(6)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El <b>interesado futuro comerciante/industrial o afin</b> mayor de 18 años.</div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El <b>representante o apoderado/a de la persona</b> interesada con documentación que acredite el carácter de tal. <b-icon-question-circle-fill @click="openPopup('A')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div>
                </div>
              </div>
            </transition>
          </b-card>

          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(7) }">
            <h4 class="section-title" @click="toggleCard(7)">
              ¿Qué documentación necesito para iniciar una Habilitación Comercial?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(7)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(7)">
                <div class="li-row first-li"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> DNI del solicitante <i>(imagen del frente y dorso)</i>.</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Domicilio real y legal del establecimiento <i>(deberá constar calle y número)</i>. <b-icon-question-circle-fill @click="openPopup('NroInmueble')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Copia de plano (en alguna de sus dos posibilidades: <i>1. Conforme a obra o Medición aprobado / 2. Conforme a obra o Medición registrado).</i> En caso de no poseerlo, se requerirá el Informe Técnico debidamente visado por el Colegio Profesional correspondiente. <b-icon-question-circle-fill @click="openPopup('B')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Libre deuda de <a href="https://arvige.gob.ar/lpagos" target="_blank" class="external-link">Tasa por Sevicios Urbanos</a> <i>(o última factura de pago que indique que la Tasa municipal no registra deuda)</i>. <b-icon-question-circle-fill @click="openPopup('LibreDeuda')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Copia de la Escritura traslativa de Dominio del inmueble donde se desarrollará la actividad / Contrato de locación / Boleto de Compraventa o afín, con el correspondiente Impuesto de Sellos Provincial y firma certificada por Escribano Público, Entidad Bancaria o Autoridad Administrativa.</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <a href="https://seti.afip.gob.ar/padron-puc-constancia-internet/ConsultaConstanciaAction.do" target="_blank" class="external-link">Constancia de CUIT</a> actualizada.</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <a href="https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?tramite=582&categ=34" target="_blank" class="external-link">Constancia de Inscripción en Ingresos Brutos</a> (ARBA) actualizada al momento de la solicitud. Esta deberá mantenerse activa mientras el comercio, industria o asimilable esté habilitado, bajo pena de ser pasible de la clausura del establecimiento.</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <a href="https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?tramite=582&categ=34" target="_blank" class="external-link">Certificado de domicilio Ingresos Brutos - Punto de venta Villa Gesell.</a></div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <a href="https://drive.google.com/file/d/1m5ouibBL4sWokhkSR5keTjbUVo-I4TOU/view" target="_blank" class="external-link">Planilla de Autorización de Trámite</a> o poder autorizado por escribano <i>(únicamente si el trámite es iniciado mediante representante o apoderado/a)</i>.</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <b>Personas Jurídicas:</b> Escritura constitutiva de la misma con designación actual de sus representantes.</div></div>
              <div class="separador-top">
                <p>Excepto el domicilio, el resto de los <b>documentos</b> deberán encontrarse <b>digitalizados</b> (podés escanearlos o sacarles una foto) y deben <b>ser legibles</b>. Pueden encontrarse <b>en formato pdf o imagen</b> y tener un <b>peso máximo de 15 Mb</b>.</p>
              </div>
              <b-card border-variant="warning" align="center" class="importante-card" >
                <b-card-text>
                  <b-row >
                    <b-col md="2">
                      <b-icon-exclamation-triangle variant="warning" font-scale="5"></b-icon-exclamation-triangle>
                      <p class="li-title"><u><b>¡Importante!</b></u></p>
                    </b-col>
                    <b-col  md="10">
                        <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Si en el lugar <b>donde vas a habilitar tu comercio existía otro antes, este último debe estar dado de baja.</b> En caso de que aún no se haya regularizado esta situación,  deberás realizar el <a href="#card-baja" id="btnB" class="external-link" @click="seleccionarTramite('Baja')">Trámite de Baja Comercial</a> para poder iniciar el trámite de habilitación.</div></div>
                        <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Tené en cuenta que <b>la iniciación y pago del trámite no implican la habilitación tácita</b>, ya que <b>la misma está sujeta a la entrega de la documentación original y al retiro del certificado de habilitación</b>. <u>Mientras tanto el local deberá permanecer cerrado.</u></div></div>
                    </b-col>
                  </b-row>
                </b-card-text>
              </b-card>
              </div>
            </transition>
          </b-card>

          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(8) }">
            <h4 class="section-title" @click="toggleCard(8)">
              Requisitos por rubros comerciales
              <b-icon-chevron-compact-down v-if="!isCardExpanded(8)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(8)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p>Seleccioná el rubro de tu comercio para conocer los requisitos a los que se debe adecuar y el mapa de zonas permitidas donde se puede ubicar.</p>
                    <b-form-group label="" label-for="rubro">
                      <b-form-select v-model="rubroSeleccionado.id" :options="filteredRubros" value-field="id" text-field="nombre" @change="handleRubroChange" style="margin:10px 0;"></b-form-select>
                    </b-form-group>
                  </div>
                </div>

                <div v-if="rubroSeleccionado.id">

                    <div v-if="rubroSeleccionado.descripcion != ''" class="li-row">
                      <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                      <div class="li-content">
                        <p class="li-title">¿A qué nos referimos cuando hablamos de “{{ rubroSeleccionado.nombre }}”?</p>
                        <p class="li-p">{{ rubroSeleccionado.descripcion }}</p>
                      </div>
                    </div>
                    <div v-if="rubroSeleccionado.requisitos.length" class="li-row">
                      <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                      <div class="li-content" style="width:inherit;">
                        <p class="li-title">Requisitos Generales  <a href="https://drive.google.com/file/d/1I3BW2F16ZhW7tLqPU6qSmRYybkMKBTXS/view" target="_blank" class="external-link" style="font-weight: 500">(Ord. 1958/04)</a></p>
                        <div v-if="rubroSeleccionado.requisitos.length" class="li-p">
                          <div class="li-row" v-for="(req, index) in rubroSeleccionado.requisitos" :key="index">
                            <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                            <div class="li-content" >
                              <p> {{ req }}</p>
                            </div>
                          </div>
                        </div></div>
                    </div>
                    <div v-if="rubroSeleccionado.especiales.length" class="li-row">
                      <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                      <div class="li-content" style="width:inherit;">
                        <p class="li-title">Requisitos <span v-if="rubroSeleccionado.requisitos.length">específicos para el rubro</span><span v-else>Generales</span></p>
                        <div v-if="rubroSeleccionado.especiales.length" class="li-p">
                          <div class="li-row" v-for="(req, index) in rubroSeleccionado.especiales" :key="index">
                            <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                            <div class="li-content" >
                              <a v-if="rubroSeleccionado.links.length && rubroSeleccionado.links[index]!='' && rubroSeleccionado.links[index]!=null" :href="`${rubroSeleccionado.links[index]}`" target="_blank" class="external-link" > {{ req }}</a>
                              <p v-else> {{ req }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <b-card v-if="rubroSeleccionado.inspeccion"  border-variant="warning" align="center" class="importante-card li-p" >
                      <b-card-text>
                        <b-row >
                          <b-col md="2">
                            <b-icon-exclamation-triangle variant="warning" font-scale="5"></b-icon-exclamation-triangle>
                            <p class="li-title"><u><b>¡Importante!</b></u></p>
                          </b-col>
                          <b-col  md="10">
                              <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Para habilitar un comercio del rubro {{ rubroSeleccionado.nombre }} <b>necesitás solicitar turno para llevar a cabo la inspección</b> correspondiente. Allí se constatará el cumplimiento de los requisitos mencionados previamente.</div></div>
                              <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Los turnos de Inspección se solicitan <b>luego de recibir el correo electrónico del Departamento Comercio</b> autorizando el Formulario de Solicitud de Habilitación (donde te indicarán los pasos a seguir para continuar).</div></div>
                          </b-col>
                        </b-row>
                      </b-card-text>
                    </b-card>
                    <b-card v-else border-variant="info" align="center" class="importante-card li-p" >
                      <b-card-text>
                        <b-row >
                          <b-col md="2">
                            <b-icon-exclamation-triangle variant="info" font-scale="5"></b-icon-exclamation-triangle>
                            <p class="li-title"><u><b>¡Importante!</b></u></p>
                          </b-col>
                          <b-col  md="10">
                              <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Los comercios del rubro {{ rubroSeleccionado.nombre }} <b>no requieren inspección</b> para llevar a cabo la habilitación.</div></div>
                              <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Los documentos originales se solicitan luego de recibir el correo electrónico del Departamento Comercio autorizando el Formulario de Solicitud de Habilitación (donde te indicarán los pasos a seguir para continuar).</div></div>
                          </b-col>
                        </b-row>
                      </b-card-text>
                    </b-card>
                    <div v-if="rubroSeleccionado.croquisExpandido === true" class="li-row">
                      <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                      <div class="li-content">
                        <p class="li-title">Requisitos especiales en casos en que haya más de una parcela para uso de la actividad comercial (y las mismas no se encuentren reunidas por plano de mensura y unificación o reunidas de oficio)</p>
                        <div class="li-p"><p><b>Deberá acreditar:</b> Croquis  del Establecimiento efectuado por profesional habilitante en escala 1:100 en donde debe indicarse:</p>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">a)</span> Acceso peatonal y vehicular.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">b)</span> Estacionamiento.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">c)</span> Pileta, espejo de agua, natatorio, destacando profundidad y cercado tipo y altura.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">d)</span> Cercado perimetral.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">e)</span> Forestación existente.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">f)</span> Juegos para niños.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">g)</span> Administración o recepción.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">h)</span> Depósito, guardarropas, vestuarios.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">i)</span> Zona de desayuno, comedores, cocinas.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">j)</span> Ubicación de matafuegos internos.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">k)</span> Carteles en el predio de “EVITE PROVOCAR INCENDIOS”.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">l)</span> Señalización con números o letras de las unidades de viviendas, cabañas, departamentos, bungalows, que se afectan al servicio del pasajero.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">ll)</span> Vivienda particular que no se afectaría al servicio, con nombre del destinatario y período de ocupación.</div>
                          </div>
                          <div class="li-row"><div class="li-icon"></div>
                            <div class="li-content"><span class="icon-orange">m)</span> Espacios con otros destinos (spa, gimnasio, salón de usos múltiples, lavaderos, depósitos externos, etc).</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-if="rubroSeleccionado.pom" >
                      <div class="li-row">
                        <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                        <div class="li-content">
                          <p class="li-title">Zonas permitidas para el rubro: {{ rubroSeleccionado.nombre }}</p>
                          <div class="li-row">
                            <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                            <div class="li-content"><p class="">En este mapa se indican las zonas permitidas para tu comercio de acuerdo a lo determinado por la Ordenanza 3069/21 Mod 3138/21 (Plan de Ordenamiento Municipal).</p></div>
                          </div>
                          <div class="li-row">
                            <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                            <div class="li-content"><p class="li-p">La zona coloreada del mapa señala el espacio catastral donde es posible habilitar comercios de tu rubro <i>(no indica ubicaciones catastrales que se encuentren libres)</i>.</p></div>
                          </div>
                        </div>
                      </div>
                      <iframe :src="`${rubroSeleccionado.pom}`" width="100%" height="800" allow="autoplay" class="li-p"></iframe>
                      <p v-if="rubroSeleccionado" class="li-p">Descargá el mapa de zonas permitidas para tu rubro haciendo <a class="external-link" target="_blank" :href="`${rubroSeleccionado.pom}`">click aquí</a></p>
                    </div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card class="section-card FAQs-card" v-bind:class="{ 'expanded': isCardExpanded(9) }">
            <h4 class="section-title" @click="toggleCard(9)">Preguntas Frecuentes
              <b-icon-chevron-compact-down v-if="!isCardExpanded(9)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(9)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Qué sucede si en el local donde voy a habilitar mi comercio existía otro antes?</p>
                    <p>En este caso, el comercio anterior debe estar dado de baja. Dicho trámite se realiza de manera virtual haciendo <a href="#card-baja" id="btnB" class="external-link" @click="seleccionarTramite('Baja')">click aquí</a>.</p>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cómo se calcula la Tasa de Habilitación?</p>
                    <p class="li-p">La Tasa de Habilitación depende de los siguientes factores:</p>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>El rubro que se quiere habilitar.</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>La zona donde se encuentra el local.</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>La superficie total afectada a la actividad comercial (que implican el sector de atención al público, depósito, espacio de circulación, entrepiso, sanitarios, entre otros).</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>La condición del plano de obra (aprobado o registrado).</p></div>
                    </div>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">Para facilitar la búsqueda de un local: ¿Dónde puedo consultar la Zona Comercial Apta para habilitar y los requisitos edilicios para su instalación y funcionamiento?</p>
                    <p class="li-p">Para realizar tu consulta, podés enviar un correo electrónico a: <a class="external-link" href="mailto:deptocomercio@gesell.gob.ar" target="_blank">deptocomercio@gesell.gob.ar</a> informando los siguientes datos:</p>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>Rubro a habilitar.</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>Domicilio real del local (Calle y Número).</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>Localidad de ubicación en el Partido de Villa Gesell.</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>Datos catastrales: Chacra- Quinta- Manzana - Parcela - Unidad Contributiva.</p></div>
                    </div>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Deben renovarse las habilitaciones comerciales?</p>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p><b>En caso de contrato de locación:</b> Las habilitaciones se extienden por el período que abarca el contrato de locación y deben reempadronarse anualmente, según corresponda, teniendo en cuenta la normativa vigente.</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p><b>En caso de ser propietario/a del inmueble:</b> Las habilitaciones no tienen caducidad si la titularidad o las condiciones acreditadas al momento de la entrega del certificado de habilitación no cambian.</p></div>
                    </div>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cómo puedo obtener el Registro Provincial para la Comercialización de Bebidas Alcohólicas (REBA)?</p>
                    <p class="li-p">Las actividades que comercializan bebidas alcohólicas deben tramitar el certificado del REBA correspondiente.</p>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>Para tramitarlo debés tener tu habilitación comercial vigente.</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>Su costo dependerá de la actividad comercial que se lleve a cabo.</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p>El trámite se lleva a cabo <b>personalmente</b> en la Municipalidad una vez iniciado el trámite online.</p></div>
                    </div>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Por qué no cargan mis archivos?</p>
                    <p>Puede ser que los archivos que quieras cargar superen el peso máximo soportado. En ese caso, te sugerimos reducirlos con alguna herramienta digital (por ejemplo: <a href="https://www.ilovepdf.com/es/comprimir_pdf" target="_blank" class="external-link">ilovepdf</a>). Si el problema persiste podés comunicarte con <a href="mailto:deptocomercio@gesell.gob.ar" target="_blank" class="external-link">deptocomercio@gesell.gob.ar</a></p>
                  </div>
                </div>
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cómo cargo varias imágenes en un campo único del formulario?</p>
                    <p>En caso de que el archivo que vayas a subir tenga varias páginas (y, por ejemplo, vos las hayas fotografiado) deberás compilarlas en un único archivo pdf. Para ello existen diversas herramientas digitales (por ejemplo, <a href="https://www.ilovepdf.com/es/jpg_a_pdf" target="_blank" class="external-link">ilovepdf</a>) que te permiten hacerlo de manera sencilla y gratuita. </p>
                  </div>
                </div>
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cómo puedo saber en qué estado se encuentra mi trámite?</p>
                    <p>Hacé click en el botón <a class="external-link" href="/consulta_tramite">consulta de trámites</a> que se encuentra en la página de inicio y escribí el número de trámite que te dio el sistema cuando completaste tu solicitud.</p>
                  </div>
                </div>
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">Para visualizar como realizar tu trámite, podés mirar este video tutorial</p>
                    <iframe class="videoTuto" width="560" height="315" src="https://www.youtube.com/embed/HJwZkfxsnOw?si=EszZ_Byjmv2-ysF8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                  </div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card id="normas" class="section-card" v-bind:class="{ 'expanded': isCardExpanded(10) }">
            <h4 class="section-title" @click="toggleCard(10)">
              Condiciones legales
              <b-icon-chevron-compact-down v-if="!isCardExpanded(10)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(10)">
                <p class="first-li">
                  La habilitación de comercios/industrias o asimilables deberá adecuarse a lo determinado en concordancia con leyes nacionales, provinciales y
                  <a href="https://arvige.gob.ar/legislacion/pdf/12" target="_blank" class="external-link">el Digesto de Habilitaciones Comerciales (Ord.1958/04 (TO2024)</a>.
                </p>
              </div>
            </transition>
          </b-card>
        <b-button variant="success" class="float-right btn-form" @click="openPopup('Form')">Iniciar Trámite</b-button>
        <br />
        </b-col>
        <b-col v-if="tramiteSeleccionado=='Renovación'">
          <br />
          <b-card class="section-card" id="card-baja" v-bind:class="{ 'expanded': isCardExpanded(11) }">
            <h4 class="section-title" @click="toggleCard(11)">
              ¿Qué significa realizar una Renovación Comercial?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(11)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(11)">
                <div class="li-row first-li">
                  <p class="first-li first-p"><b>El trámite de Renovación Comercial implica reafirmar la continuidad de una Habilitación Comercial en los mismos términos en los que fue solicitada</b>. Mediante este trámite el Municipio verificará que la documentación solicitada y el pago de tasas correspondientes estén cumplimentadas.
                  <br />Una vez confirmada esta información se extiende al solicitante un Certificado de Habilitación donde consta la renovación comercial con este Municipio.</p>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">Si realizaste alguna de estas acciones, el trámite a realizar NO es una renovación comercial:</p>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p><b>Baja Comercial</b>. Podes ver los requisitos de este trámite haciendo <a href="#card-baja" id="btnB" class="external-link" @click="seleccionarTramite('Baja')">click aquí</a>.</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p><b>Cambio de Domicilio</b>.<!--  Podes ver los requisitos de este trámite haciendo <a href="#card-cambio-domicilio" id="btnCD" class="external-link" @click="seleccionarTramite('Cambio de Domicilio')">click aquí</a>. --></p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p><b>Cambio de Titular</b>.<!--  Podes ver los requisitos de este trámite haciendo <a href="#card-cambio-titular" id="btnCT" class="external-link" @click="seleccionarTramite('Cambio de Titular')">click aquí</a>. --></p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p><b>Anexo de Mts2</b>.<!--  Podes ver los requisitos de este trámite haciendo <a href="#card-anexo-mt-2" id="btnAM2" class="external-link" @click="seleccionarTramite('Anexo de Mts2')">click aquí</a>. --></p></div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card class="section-card" id="card-habilitacion" v-bind:class="{ 'expanded': isCardExpanded(12) }">
            <h4 class="section-title" @click="toggleCard(12)">
              ¿Quién puede iniciar una Renovación Comercial?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(12)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(12)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El <b>Titular de la Habilitación Comercial</b> ó</div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El <b>Representante o Apoderado/a de la persona interesada</b> con documentación que acredite el carácter de tal. <b-icon-question-circle-fill @click="openPopup('A')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div>
                </div>
              </div>
            </transition>
          </b-card>

          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(13) }">
            <h4 class="section-title" @click="toggleCard(13)">
              ¿Qué documentación necesito para iniciar una Renovación Comercial?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(13)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(13)">
                <div class="li-row first-li"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> DNI del solicitante <i>(imagen del frente y dorso)</i>.</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Libre deuda de Tasa de Inspección de Seguridad e Higiene. <b-icon-question-circle-fill @click="openPopup('ConstanciaLibreDeudaSegHig')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Libre deuda de <a href="https://arvige.gob.ar/lpagos" target="_blank" class="external-link">Tasa por Servicios Urbanos</a> que afectan al local <i>(o última factura de pago que indique que la Tasa municipal no registra deuda)</i>. <b-icon-question-circle-fill @click="openPopup('LibreDeuda')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Libre deuda de <a href="https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?tramite=266&categ=34" target="_blank" class="external-link">Ingresos Brutos</a> <i>(Solo si la renovación la solicita el titular de la habilitación)</i>. </div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <a href="https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?tramite=582&categ=34" target="_blank" class="external-link">Certificado de domicilio Ingresos Brutos - Punto de venta Villa Gesell.</a></div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Libro de Actas (<i>en caso de alojamientos: 2 libros - Se entrega de forma presencial al finalizar el trámite.</i>)</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <u>Si el  Plano de Obra continua en tramite</u>: Presentar Informe Técnico Visado en el Colegio de Arquitecto (<a href="" class="external-link">Artic. 20º Ord. Nº 3177/21</a>) </div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Contrato de locación con el correspondiente Impuesto de Sellos Provincial y firma certificada por Escribano Público, Entidad Bancaria o Autoridad Administrativa.</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <a href="https://drive.google.com/file/d/1m5ouibBL4sWokhkSR5keTjbUVo-I4TOU/view" target="_blank" class="external-link">Planilla de Autorización de Trámite</a> o poder autorizado por escribano <i>(únicamente si el trámite es iniciado mediante representante o apoderado/a)</i>.</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <b>Personas Jurídicas:</b> Escritura constitutiva de la misma con designación actual de sus representantes.</div></div>
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
                          <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Una vez iniciado el trámite, <b>recibirás un correo electrónico del Departamento Comercio</b> (deptocomercio@gesell.gob.ar), indicandote los pasos para continuar.</div></div>
                          <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Tené en cuenta que la renovación ó el reempadronamiento serán efectivos una vez que el Departamento Comercio (deptocomercio@gesell.gob.ar) haya verificado la documentación presentada, se haya abonado el valor del trámite, se hayan presentado los originales y, posteriormente, hayas obtenido el certificado respectivo.</div></div>
                          <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Recordá que las <b>renovaciones y reempadronamientos</b> sólo se <b>realizan si no hiciste modificaciones</b> respecto a la <b>habilitación inicial</b>. En caso contrario deberás iniciar un  trámite diferente (por ejemplo, un cambio de domicilio).</div></div>
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
                    <p class="li-title">¿Cuál es el costo del trámite?</p>
                    <p>El costo del trámite se encuentra determinado en la Ordenanza 2156/08 (TO 2023).</p>
                  </div>
                </div>                
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cómo finaliza el trámite?</p>
                    <p>Una vez completado el formulario, el Dpto. Comercio se comunicará a través del correo electrónico oficial (<a href="mailto:deptocomercio@gesell.gob.ar" target="_blank" class="external-link">deptocomercio@gesell.gob.ar</a>), indicándote los pasos a seguir y los costos administrativos del trámite.</p>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cuándo deben renovarse las habilitaciones comerciales?</p>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p><b>En caso de contrato de locación:</b> Las habilitaciones se extienden por el período que abarca el contrato de locación y deben reempadronarse anualmente, según corresponda, teniendo en cuenta la normativa vigente.</p></div>
                    </div>
                    <div class="li-row">
                      <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                      <div class="li-content"><p><b>En caso de ser propietario/a del inmueble:</b> Las habilitaciones no tienen caducidad si la titularidad o las condiciones acreditadas al momento de la entrega del certificado de habilitación no cambian.</p></div>
                    </div>
                  </div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Por qué no cargan mis archivos?</p>
                    <p>Puede ser que los archivos que quieras cargar superen el peso máximo soportado. En ese caso, te sugerimos reducirlos con alguna herramienta digital (por ejemplo: <a href="https://www.ilovepdf.com/es/comprimir_pdf" target="_blank" class="external-link">ilovepdf</a>). Si el problema persiste podés comunicarte con <a href="mailto:deptocomercio@gesell.gob.ar" target="_blank" class="external-link">deptocomercio@gesell.gob.ar</a></p>
                  </div>
                </div>
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cómo cargo varias imágenes en un campo único del formulario?</p>
                    <p>En caso de que el archivo que vayas a subir tenga varias páginas (y, por ejemplo, vos las hayas fotografiado) deberás compilarlas en un único archivo pdf. Para ello existen diversas herramientas digitales (por ejemplo, <a href="https://www.ilovepdf.com/es/jpg_a_pdf" target="_blank" class="external-link">ilovepdf</a>) que te permiten hacerlo de manera sencilla y gratuita. </p>
                  </div>
                </div>
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Cómo puedo saber en qué estado se encuentra mi trámite?</p>
                    <p>Hacé click en el botón <a class="external-link" href="/consulta_tramite">consulta de trámites</a> que se encuentra en la página de inicio y escribí el número de trámite que te dio el sistema cuando completaste tu solicitud.</p>
                  </div>
                </div>
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">Para visualizar como realizar tu trámite, podés mirar este video tutorial</p>
                    <iframe class="videoTuto" width="560" height="315" src="https://www.youtube.com/embed/HJwZkfxsnOw?si=EszZ_Byjmv2-ysF8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                  </div>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card id="normas" class="section-card" v-bind:class="{ 'expanded': isCardExpanded(16) }">
            <h4 class="section-title" @click="toggleCard(16)">
              Condiciones legales
              <b-icon-chevron-compact-down v-if="!isCardExpanded(16)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(16)">
                <p class="first-li">
                  La habilitación de comercios/industrias o asimilables deberá adecuarse a lo determinado en concordancia con leyes nacionales, provinciales y
                  <a href="https://arvige.gob.ar/legislacion/pdf/12" target="_blank" class="external-link">el Digesto de Habilitaciones Comerciales (Ord.1958/04 (TO2024)</a>.
                </p>
              </div>
            </transition>
          </b-card>
        <b-button variant="success" class="float-right btn-form" @click="openPopup('Form')">Iniciar Trámite</b-button>
        <br />
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
              <a href="https://drive.google.com/file/d/11JlAeO_87e-mslA7W_VAAoDEfou48WrU/view" target="_blank"><img src="../../assets/ej-plano.jpg" width="100%" height="fit-content" /></a>
            </div>
          </div>
        </div>
        </b-modal>
    <b-modal v-model="showPopupD" title="" :hide-footer="true" @click-outside="showPopupD = false" :header-bg-variant="'success'" centered>
      <template #modal-header>
          <div class="modal-info">
            <h5>
                <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
                Información Adicional
            </h5>
          </div>
            <button type="button" aria-label="Close" class="close" @click="showPopupD = false">×</button>
      </template>
      <div class="modal-info">
        <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>En caso de ser positiva la inspección correspondiente deberá constituir domicilio fiscal electrónico de quien ejerza la actividad donde serán válidas las notificaciones efectuadas.</p>
      </div>
    </b-modal>
    <b-modal v-model="showPopupE" title="" :hide-footer="true" @click-outside="showPopupE = false" :header-bg-variant="'success'" centered>
      <template #modal-header>
          <div class="modal-info">
            <h5>
                <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
                Información Adicional
            </h5>
          </div>
            <button type="button" aria-label="Close" class="close" @click="showPopupE = false">×</button>
      </template>
      <div class="modal-info">
        <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Ingrese aqui.</p>
      </div>
    </b-modal>
    <b-modal v-model="showPopupConstanciaLibreDeudaSegHig" title="Libre deuda de Tasa de Inspección de Seguridad e Higiene" :hide-footer="true" @click-outside="showPopupConstanciaLibreDeudaSegHig = false" :header-bg-variant="'success'"  centered>
      <template #modal-header>
        <div class="modal-info">
          <h5>
              <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
              Información Adicional
          </h5>
        </div>
        <button type="button" aria-label="Close" class="close" @click="showPopupConstanciaLibreDeudaSegHig = false">×</button>
      </template>
      <div class="modal-info">
        <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podés solicitarlo enviando un correo electrónico a <a href="mailto:deptocomercio@gesell.gob.ar" target="_blank" >deptocomercio@gesell.gob.ar</a>, indicando <b>número de legajo comercial</b> y <b>nombre del titular de la habilitación</b>.</p>
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
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">La documentación presentada (certificaciones y libre deuda) deberá encontrarse actualizada, es decir que debe haber sido expedida dentro del plazo de los últimos 30 días.</div>
          </div>
          <div class="li-row">
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Recordá que los documentos deben ser legibles, estar subidos en formato imagen o pdf y tener un peso máximo de 15 mb.</div>
          </div>
          <div class="form-check">
              <input class="form-check-input" type="checkbox" id="documentCheckbox" v-model="documentCheckboxChecked"/>
              <label class="form-check-label" for="documentCheckbox">Ya tengo todos los documentos digitalizados y la información requerida.</label>
          </div>
          <div class="text-center mt-3">
              <nuxt-link :class="{ 'disabled': !documentCheckboxChecked }" :to="{path: '/comercio/form', query: { tramite: tramiteSeleccionado } }">
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
          <a href="http://haciendavgesell.gob.ar/_nuxt/img/ej-libredeuda.78769c7.jpg" target="_blank"><img src="../../assets/ej-libredeuda.jpg" width="100%" height="fit-content" /></a>
        </div>
      </div>
    </b-modal>
    <b-modal v-model="showPopupNroInmueble" title="" :hide-footer="true" @click-outside="showPopupNroInmueble = false" :header-bg-variant="'success'"  centered>
      <template #modal-header>
        <div class="modal-info">
          <h5>
              <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
              Información Adicional
          </h5>
        </div>
            <button type="button" aria-label="Close" class="close" @click="showPopupNroInmueble = false">×</button>
      </template>
      <div class="modal-info">
        <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Podés consultar el número enviando un correo electrónico a <a href="mailto:catatro@gesell.gob.ar" target="_blank">catastro@gesell.gob.ar</a>, indicando nomenclatura catastral del bien que se encuentra en la escritura del mismo.</p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import rubros from "@/plugins/rubros.js";
export default {
  data:function() {
    return {
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
      tramiteSeleccionado: '',
      rubroSeleccionado: {
                          id: null,
                          nombre: null,
                          descripcion: null,
                          requisitos: [],
                          especiales: [],
                          links: [],
                          pom: null,
                          inspeccion: false,
                          croquis: false,
                          croquisExpandido: true,
                        },
      solicitudLibreDeuda: {
        email: '',
        emailState: null,
        partidaMunicipal: '',
        partidaMunicipalState: null,
        partidaComercial: '',
        partidaComercialState: null,
        seccion: '',
        fraccion: '',
        quinta: '',
        manzana: '',
        loteParcela: '',
        subparcela: '',
        catastralDataState: null
      },
      captchaResponse: null,
      expandedCards: [],
    };
  },
  mounted() {
    this.filteredRubros.sort((a, b) => a.nombre.localeCompare(b.nombre));
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
        console.log("ShowPopup A")
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
      }
    },
    proceedToForm() {
      // Aquí puedes realizar alguna acción adicional si es necesario antes de redirigir al formulario
      this.showConfirmationPopup = false;
    },
    handleRubroChange() {
      if (this.rubroSeleccionado.id != null) {
      // Obtener los datos correspondientes al rubro seleccionado
      const i = this.filteredRubros.findIndex(rubro => rubro.id === this.rubroSeleccionado.id);
      this.rubroSeleccionado.nombre = this.filteredRubros[i].nombre;
      this.rubroSeleccionado.descripcion = this.filteredRubros[i].descripcion;
      this.rubroSeleccionado.links = this.filteredRubros[i].links;
      this.rubroSeleccionado.requisitos = this.filteredRubros[i].requisitos;
      this.rubroSeleccionado.especiales = this.filteredRubros[i].especiales;
      this.rubroSeleccionado.pom = this.filteredRubros[i].pom;
      this.rubroSeleccionado.inspeccion = this.filteredRubros[i].inspeccion;
      this.rubroSeleccionado.croquis = this.filteredRubros[i].croquis;
      this.rubroSeleccionado.croquisExpandido = this.filteredRubros[i].croquisExpandido;
      } else {
        // Si no se ha seleccionado ninguna opción, reiniciar las propiedades
        this.rubroSeleccionado.nombre = null;
        this.rubroSeleccionado.descripcion = null;
        this.rubroSeleccionado.links = [];
        this.rubroSeleccionado.requisitos = [];
        this.rubroSeleccionado.especiales = [];
        this.rubroSeleccionado.pom = null;
        this.rubroSeleccionado.inspeccion = false;
        this.rubroSeleccionado.croquis = false;
        this.rubroSeleccionado.croquisExpandido = false;
      }
    },
    resetForm() {
      // Lógica para resetear el formulario
    },
    submitLibreDeuda() {
      if ((!this.solicitudLibreDeuda.partidaMunicipal && !this.solicitudLibreDeuda.partidaComercial) || !this.hasCatastralData()) {
      // Si ni la partida municipal ni los datos catastrales están completos, mostrar un mensaje de error o realizar alguna acción apropiada.
      alert('Debes completar la partida municipal o los datos catastrales.');
      return;
    }else {
      //CAMBIAR EL SITEKEY POR UNO DE VERDAD
      grecaptcha.execute('6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', { action: 'submit' })
      .then((token) => {
        this.captchaResponse = token;
        alert('La solicitud fue enviada correctamente. En breve nos comunicaremos con usted con una respuesta.');
        this.showLibreDeudaPopup = false;
      });
    // Resto de la lógica para enviar la solicitud de libre deuda...
    }
  },
  hasCatastralData() {
    return (
      this.solicitudLibreDeuda.seccion &&
      this.solicitudLibreDeuda.fraccion &&
      this.solicitudLibreDeuda.quinta &&
      this.solicitudLibreDeuda.manzana &&
      this.solicitudLibreDeuda.loteParcela &&
      this.solicitudLibreDeuda.subparcela
    );
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
  seleccionarTramite(tramite){
    this.tramiteSeleccionado = tramite;
    // Obtener todas las imágenes de la botonera
    const imagenes = document.querySelectorAll('.botonera-container img');

    // Iterar sobre cada imagen
    imagenes.forEach((imagen) => {
      // Verificar si la imagen actual es la que se ha clickeado
      if (imagen.id === `btn-${tramite}`) {
        // Agregar la clase 'selected' a la imagen clickeada
        imagen.classList.add('selected');
      } else {
        // Eliminar la clase 'selected' de las demás imágenes
        imagen.classList.remove('selected');
      }
    });
    this.expandedCards.forEach((card) => {
      if( this.isCardExpanded(card)) this.toggleCard(card);
    });
  }
}
}
</script>
<style lang="sass">
#mainCarousel
  .carousel-control-prev-icon,
  .carousel-control-next-icon
    background-image: none
    background-size: 100%, 100%
    border-radius: 50%
    height: 100px
    width: 100px
  .carousel-control-next-icon::after
    color: #0c681a
    content: '>'
    font-size: 40px
    left: 10px
  .carousel-control-prev
    text-align: left
    background: rgba(#CCC, 0.3)
    width: 5%
  .carousel-control-next
    text-align: right
    background: rgba(#CCC, 0.3)
    width: 5%
  .carousel-control-prev-icon::after
    color: #0c681a
    content: '<'
    font-size: 40px
  .carousel-indicators
    bottom: -25px
  .carousel-indicators li
    background-color: #999999
    height: 6px
    margin: 0 5px
    opacity: 1
    padding: 3px
    position: relative
    width: 6px
    border-radius: 50%
  .carousel-indicators li::after
    bottom: -7px
    content: ""
    left: -7px
    padding: 5px
    position: absolute
    right: -7px
    top: -7px
  .carousel-indicators li.active
    background-color: 999999
    border: 3px solid #999999
    top: 6px
    border-radius: 50%
@media (max-width: 1200px)
  #mainCarousel
    .carousel-control-prev-icon::after,
    .carousel-control-next-icon::after
      font-size: 30px
    .carousel-indicators li
      background-color: #999999
      height: 3px
      margin: 0 5px
      opacity: 1
      padding: 3px
      position: relative
      width: 3px
      border-radius: 50%
    .carousel-indicators li::after
      bottom: -7px
      content: ""
      left: -7px
      padding: 5px
      position: absolute
      right: -7px
      top: -7px
    .carousel-indicators li.active
      background-color: 999999
      border: 3px solid #999999
      top: 6px
      border-radius: 50%
@media (max-width: 720px)
  #mainCarousel
    .carousel-control-prev-icon,
    .carousel-control-next-icon,
    .carousel-indicators li
      display: none
</style>
<style scoped>
.mainCarrousel{
    display: block;
  }
  .moblieCarrousel{
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
  .moblieCarrousel{
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
  .moblieCarrousel{
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
