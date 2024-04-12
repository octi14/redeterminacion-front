<template>
    <div class="page main-background">
        <Banner title="Comercio Abierto Anual"/>
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
                <b-carousel-slide img-src="../../assets/habilita-en-simples-pasos-2.png"></b-carousel-slide>
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
                    Es un descuento del 60% (sesenta por ciento) del valor de la Tasa por Inspección y/o de la verificación de la Seguridad
                     y la Higiene, otorgado en virtud del Artículo 182 de la</div>
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
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">
                    Los/las contribuyentes que ante evaluacion del Municipio acrediten que:</div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">
                    Sus establecimientos hayan permanecido con actividad en forma permanente durante el ejercicio fiscal anterior y no 
                    posean deudas con la Municipalidad.</div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">
                    Sus establecimientos hayan permanecido con actividad en forma permanente durante los fines de semana del ejercicio anterior y
                     no posean deudas con la Municipalidad. <b-icon-question-circle-fill @click="openPopup('A')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div>
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
                <div class="li-row first-li"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content"> Están excluídos del Beneficio: </div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content">Aquellos/as contribuyentes que no hayan acreditado, ante la evaluación del Municipio, contar con un comercio con
                   actividad permanente durante el ejercicio fiscal anterior. <b-icon-question-circle-fill @click="openPopup('ConstanciaLibreDeudaSegHig')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content"> Los Mayores Contribuyentes incluídos en los Artículos 181 bis a 181 noveno del a Ordenanza Fiscal 2156/08 c/ Mod. <b-icon-question-circle-fill @click="openPopup('LibreDeuda')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></div>
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
            <h4 class="section-title" @click="toggleCard(3)">¿Qué requisitos se necesitan para obtener el beneficio de Abierto Anual?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(3)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(3)">
                <div class="li-row first-li"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content">Poseer una Habilitación Comercial en el Partido de Villa Gesell.</div></div>
                <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content">No encontrarse en mora en la Tasa de Seguridad e Higiene. <b-icon-question-circle-fill @click="openPopup('ConstanciaLibreDeudaSegHig')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></div>
                  <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content"> No ser un contribuyente excluido del beneficio acorde Ord. 2156/08 c/ Mod. <b-icon-question-circle-fill @click="openPopup('LibreDeuda')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></div>
                  <div class="li-row"><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div>
                  <div class="li-content"> Realizar el procedimiento de carga de datos según lo previsto por la Autoridad de Aplicación. <b-icon-question-circle-fill @click="openPopup('LibreDeuda')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></div>
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
      <div class="mx-auto">
        <div class="mt-3" v-if="page === 1">
          <b-card class="section-card col-md-6 mx-auto">
            <div class="li-row">
              <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p>Estás a punto de seleccionar un turno de inspección para tu comercio.</p></div>
            </div>
            <div class="li-row">
              <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p>Para iniciar, ingresá el <b>número de trámite</b> que recibiste luego de haber enviado el Formulario de Solicitud de Habilitaciones.</p></div>
            </div>
            <b-form>
              <b-form-input :disabled="enterKeyPressed" @keydown.enter.native="onNextPage" v-model="nroTramiteIngresado" type="number" size="lg" class="col-md-6 col-sm-10 mt-4 mx-auto" placeholder="Número de trámite" no-wheel></b-form-input>
            </b-form>
            <div class="btn-container">
              <b-button class="btn-cancel" @click="onResetParams">Cancelar</b-button>
              <b-button @click="onNextPage">Aceptar</b-button>
            </div>
          </b-card>
        </div>
        <b-form class="mt-3">
          <div v-if="page === 1">
            <div class="row justify-content-center" style="width: 100%">
              <img src="../../assets/turnera-banner-2.png" style="max-width: 100%"/>
            </div>
            <b-card class="section-card col-md-6 mx-auto">
              <h5>
                <b-icon-calendar-check class="icon-orange" />
                Selección de fecha
              </h5>
              <div class="li-row">
                <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p>Elegí una fecha dentro de los días señalados.</p></div>
              </div>
              <div class="li-row">
                <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p>Tené en cuenta que las inspecciones se llevan a cabo en diferentes días de la semana dependiendo del lugar donde se encuentre tu comercio. Por eso, sólo podrás elegir los días correspondientes a la localidad que informaste al iniciar el trámite de habilitación:</p></div>
              </div>
              <div class="col-md-10 mx-auto">
                <div class="li-row">
                  <div class="li-icon"><b-icon-check font-scale="2" class="icon-green"></b-icon-check></div><div class="li-content sub-li"><p><b>Villa Gesell:</b> Lunes, Martes y Miércoles</p></div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check font-scale="2" class="icon-green"></b-icon-check></div><div class="li-content sub-li"><p><b>Mar de Las Pampas / Colonia Marina / Las Gaviotas / Mar Azul:</b>  Jueves y Viernes.</p></div>
                </div>
              </div>
              <b-calendar
                class="col-8 mx-auto mt-3"
                block hide-header
                :date-format-options="{ year: 'numeric', day: '2-digit', weekday: 'short' }"
                :min="addDays(new Date(),2)"
                :max="daysFromNow()"
                locale="es"
                value-as-date
                :date-disabled-fn="dateDisabled"
                v-model="datePicked"
              />
              <div class="btn-container">
                <b-button @click="page-= 1" class="btn-cancel">Volver</b-button>
                <b-button @click="onNextPage">Continuar</b-button>
              </div>
            </b-card>
          </div>
          <div v-if="page === 2">
            <div class="row justify-content-center" style="width: 100%">
              <img src="../../assets/turnera-banner-3.png" style="max-width: 100%"/>
            </div>
            <b-card class="section-card col-md-6 mx-auto">            
              <h5>
                <b-icon-clock class="icon-orange"></b-icon-clock>
                Selección de horario
              </h5>
              <div class="li-row">
                <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p>Seleccioná una franja horaria para recibir la visita de inspección.</p></div>
              </div>
              <b-form-select v-model="timePicked" class="col-11 mx-auto">
                <!-- <b-form-select-option
                  v-for="(_, index) in horariosDisponibles"
                  :key="index"
                  :value="horario"
                >
                  Franja horaria: {{ horariosDisponibles[index] }} - <span class="icon-orange">{{ horariosDisponibles[index]+ }}</span>
                </b-form-select-option> -->
                <b-form-select-option :value="horariosDisponibles[0]" :disabled="timeDisabled(horariosDisponibles[0])" 
                  :class="{ 'disabled-option': timeDisabled(horariosDisponibles[0]) }">
                  Franja horaria: {{ horariosDisponibles[0] }} - <span class="icon-orange">{{ horariosDisponibles[1] }}</span>
                </b-form-select-option>
                <b-form-select-option :value="horariosDisponibles[1]" :disabled="timeDisabled(horariosDisponibles[1])" 
                  :class="{ 'disabled-option': timeDisabled(horariosDisponibles[1]) }">
                  Franja horaria: {{ horariosDisponibles[1] }} - <span class="icon-orange"> 13:30 </span>
                </b-form-select-option>
              </b-form-select>
              <div class="btn-container">
                <b-button @click="page-= 1" class="btn-cancel">Volver</b-button>
                <b-button @click="onNextPage">Continuar</b-button>
              </div>
            </b-card>
          </div>
          <div v-if="page === 3">
            <div class="row justify-content-center" style="width: 100%">
              <img src="../../assets/turnera-banner-4.png" style="max-width: 100%"/>
            </div>
            <b-card class="section-card col-md-6 mx-auto">
              <h5><img class="bi-ticket" src="../../assets/icon-num-rifa.png" /> Confirmación de turno</h5>
              <div class="li-row">
                <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p>Completá los datos que te solicitamos a continuación.</p></div>
              </div>
              <div class="li-row">
                <div class="li-icon"><b-icon-caret-right-fill font-scale="1.5" class="icon-green"></b-icon-caret-right-fill></div><div class="li-content"><p> Al finalizar se emitirá un comprobante que deberás mostrar el día de la inspección.</p></div>
              </div>
              <div class="col-10 mx-auto">
                 <b-form-group>
                  <label for="nombre">Nombre</label>
                  <b-form-input id="nombre" v-model="nombre" required></b-form-input>
                  <label for="dni">Nro. de documento</label>
                  <b-form-input id="dni" v-model="dni" type="number" required></b-form-input>
                  <label for="domicilio">Domicilio del comercio</label>
                  <b-form-input id="domicilio" v-model="domicilio" required></b-form-input>
                </b-form-group>
              </div>
              <b-card border-variant="warning" align="center" class="importante-card" >
                <b-card-text>
                  <b-row class="v-align">
                    <b-col md="2">
                      <b-icon-exclamation-triangle variant="warning" font-scale="4"></b-icon-exclamation-triangle>
                      <p class="li-title"><u><b>¡Importante!</b></u></p>
                    </b-col>
                    <b-col  md="10">
                      <p>Es importante que el día de la inspección haya alguien presente en el local. En caso contrario perderás el turno y deberás solicitar uno nuevo.</p>
                    </b-col>
                  </b-row>
                </b-card-text>
              </b-card>
              <div class="btn-container">
                <b-button @click="page-= 1" class="btn-cancel">Volver</b-button>
                <b-button :disabled="sendingForm || !areAllFieldsComplete"  @click="onSelectTurno">Continuar</b-button>
              </div>            
              <div v-if="!areAllFieldsComplete" class="validation-error">
                <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Falta completar información.
              </div>
            </b-card>
          </div>
        </b-form>
          <!-- Comprobante (página 4) -->
          <div v-if="page === 4">
            <b-card no-body border-variant="success" style="margin-top: 80px" class="shadow col-md-5 col-sm-8 mx-auto">
              <b-card-header class="row" header-class="green text-light">
                <h5><b>Comprobante de turno - </b> Inspección</h5>
              </b-card-header>
              <b-card-body class="text-center">
                <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Día: </b> {{ formattedDate }}</h5> </div>
                <div class="row" v-if="time === '08.30'"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Horario: </b> {{ time }} - 11.30 </h5> </div>
                <div class="row" v-if="time === '11.30'"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Horario: </b> {{ time }} - 13.30 </h5> </div>
                <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Nro de trámite:</b> {{ nroTramite }}</h5> </div>
                <div class="row"><b-icon-check scale="1.2" class="icon-orange mt-1"/><h5><b class="text-green ml-1">Solicitante: </b> {{ nombre }}</h5> </div>
                <hr/>
               <div class="text-left">
                <div class="row">
                  <b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill>          
                  <p class="small"><small>Para consultar el estado de tu trámite ingresá en <a class="text-success">haciendavgesell.gob.ar</a>, hacé click en el ícono
                    correspondiente y escribí <br/>el número asignado en este comprobante. </small></p>
                </div>
                <div class="row">
                  <b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill>          
                  <p class="small"><small>Podés cancelar tu turno enviando un correo a divinspectores@gesell.gob.ar. </small></p>
                </div>
  
                <b-button class="mt-2 btn-orange" v-if="endButton === true" @click="onResetParams">Volver</b-button>
              </div>
              </b-card-body>
            </b-card>
          </div>
        </div>
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
              <nuxt-link :class="{ 'disabled': !documentCheckboxChecked }" :to="{path: '/abierto_anual/form', query: { tramite: tramiteSeleccionado } }">
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
        <!-- Modal enviando turno -->
        <b-modal v-model="sendingForm" title="" no-close-on-backdrop :header-bg-variant="'success'" hide-footer  centered>
          <template #modal-header>
            <h5 class="centeredContainer text-light"> <b>Solicitando turno</b></h5>
          </template>
          <div class="centeredContainer">
            <p class="popup-link">Tu solicitud se está procesando.</p>
            <b-spinner variant="success" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
            <p>No cierres esta página</p>
          </div>
        </b-modal>
  
        <!-- Modal Solicitud exitosa -->
        <b-modal v-model="formOk" v-if="date && time && formOk && !printing" no-close-on-backdrop :header-bg-variant="'success'" hide-footer centered>
          <template #modal-header>
            <div class="centeredContainer"><h3>
                <b-icon icon="check-circle-fill" scale="1.5" variant="light"></b-icon>
            </h3></div>
          </template>
          <div class="text-center modal-success">
            <p><b>{{ nombre }}</b>, solicitaste un turno para el día <b>{{ formattedDate }}</b> para la dirección especificada: <b>{{ domicilio }}</b>, en la franja horaria de las <b>{{ time }}.</b></p>
            <p>Tu número de trámite es: <b>{{nroTramite}} </b></p>
            <div class="btn-container">
              <b-button @click="onResetParams" class="btn-cancel">Volver</b-button>
              <b-button @click="onPrintTicket">Imprimir</b-button>
            </div>
          </div>
        </b-modal>
  
        <!-- Modal número de trámite incorrecto -->
        <b-modal v-model="showPopupFormError" @click-outside="showPopupFormError = false" :header-bg-variant="'danger'" centered>
          <template #modal-header>
            <div class="centeredContainer"><h3>
                <b-icon-exclamation-octagon scale="1.5" variant="light"></b-icon-exclamation-octagon>
            </h3></div>
          </template>
          <div class="centeredContainer modal-error">
            <p class="modal-subtitle">No hemos podido encontrar tu número de trámite</p>
            <p class="">Por favor, corroborá que los datos ingresados sean correctos. Recordá que el número de trámite que te solicitamos fue enviado a tu correo electrónico.</p>
            <p class="minitext">Si el problema persiste, envianos un correo a <a target="_blank" href="mailto:deptocomercio@gesell.gob.ar" class="icon-green">deptocomercio@gesell.gob.ar</a>.</p>
          </div>
          <template #modal-footer>
            <div class="" style="margin: auto">
              <b-button @click="showPopupFormError = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
            </div>
          </template>
        </b-modal>
  
        <!-- Modal No estás habilitado a sacar turno todavía -->
        <b-modal v-model="showPopupNotAllowed" @click-outside="showPopupNotAllowed = false" :header-bg-variant="'secondary'" centered>
          <template #modal-header>
            <div class="centeredContainer">
              <b-icon-exclamation-octagon scale="3" variant="light"></b-icon-exclamation-octagon>
            </div>
          </template>
          <div class="centeredContainer modal-warning">
            <p class="modal-subtitle text-secondary">Tu trámite no está habilitado para reservar un turno.</p>
            <p class="">Tu solicitud no ha sido aprobada o bien tu comercio no necesita inspección para ser habilitado.</p>
            <p class="">Revisá tu correo electrónico para corroborar si tu solicitud fue aprobada sin necesitar inspección.</p>
            <p class="minitext">Si tenés dudas, envianos un correo a <a target="_blank" href="mailto:deptocomercio@gesell.gob.ar" class="icon-green">deptocomercio@gesell.gob.ar</a>.</p>
          </div>
          <template #modal-footer>
            <div style="margin: auto">
              <b-button @click="showPopupNotAllowed = false" variant="primary">Aceptar</b-button>
            </div>
          </template>
        </b-modal>
  
        <!-- Modal No ha ingresado un número de trámite -->
        <b-modal v-model="showPopupNoEntry" @click-outside="showPopupNoEntry = false" :header-bg-variant="'danger'" centered>
          <template #modal-header>
            <div class="centeredContainer"><h3>
                <b-icon-exclamation-octagon scale="1.5" variant="light"></b-icon-exclamation-octagon>
            </h3></div>
          </template>
          <div class="centeredContainer modal-error">
            <p class="modal-subtitle">No has ingresado un número de trámite.</p>
            <p class="">Por favor, completá este campo para continuar.</p>
          </div>
          <template #modal-footer>
            <div class="" style="margin: auto">
              <b-button @click="showPopupNoEntry = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
            </div>
          </template>
        </b-modal>
  
        <!-- Modal Usted ya ha solicitado un turno -->
        <b-modal v-model="showPopupAlready" @click-outside="showPopupAlready = false" :header-bg-variant="'danger'" centered>
          <template #modal-header>
            <div class="centeredContainer"><h3>
                <b-icon-exclamation-octagon scale="1.5" variant="light"></b-icon-exclamation-octagon>
            </h3></div>
          </template>
          <div class="centeredContainer modal-error">
            <p class="modal-subtitle">Ya has solicitado un turno.</p>
            <p class="">Si deseas cancelarlo o reprogramarlo, debes comunicarte con divinspectores@gesell.gob.ar.</p>
            <p class="">Recordá que podés cancelar el turno sólo hasta 5 días antes del momento de inspección. </p>
          </div>
          <template #modal-footer>
            <div class="" style="margin: auto">
              <b-button @click="showPopupAlready = false" variant="danger" class="btn-cancel" >Aceptar</b-button>
            </div>
          </template>
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
