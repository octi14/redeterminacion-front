<template>
  <div class="page">
    <Banner title="Habilitaciones comerciales" />
    <b-jumbotron bg-variant="#F8EFE5" text-variant="black" fluid >
            <template #lead>        
              <b-row>
                <b-col md="10">
                  <b-row><b-col>
                      <h3 class="icon-orange">¡Habilitá tu comercio en simples pasos!</h3>
                  </b-col></b-row>
                  <b-row>
                    <b-col md="4" style="display:flex">
                      <div>
                        <p class="text-circle-border">1</p>
                        <p>Leé la información y requisitos necesarios para iniciar el trámite.</p>
                      </div>                      
                      <div class="separador">
                      </div>
                    </b-col>
                    <b-col md="4" style="display:flex">
                      <div>
                      <p class="text-circle-border">2</p>
                      <p> Completá el formulario con los datos solicitados.</p>
                      </div>                      
                      <div class="separador">
                      </div>
                    </b-col>
                    <b-col md="4">
                      <p class="text-circle-border">3</p>
                      <p>Esperá la confirmación de aprobación de la solicitud.</p>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col md="2">
                  <div class="banner-icon">
                    <b-iconstack font-scale="5" shift-v="-7">                 
                        <b-icon-list-nested stacked shift-h="-8" shift-v="-4" scale="1" flip-v variant="info"></b-icon-list-nested>
                        <b-icon-list-nested stacked shift-h="-7" shift-v="4" scale="1" flip-v variant="info"></b-icon-list-nested>
                        <b-icon-exclamation-lg stacked></b-icon-exclamation-lg>
                        <b-icon-circle-fill stacked scale="1.25" variant="info" ></b-icon-circle-fill>
                        <b-icon-circle-fill stacked style="color:#EC93B1" ></b-icon-circle-fill>
                        <b-icon-pen-fill stacked scale="0.62" style="color:#000"></b-icon-pen-fill>
                        <b-icon-pen-fill stacked scale="0.6" style="color:#EB9929"></b-icon-pen-fill>
                    </b-iconstack>
                  </div>
                </b-col>
              </b-row>
            </template>
          </b-jumbotron>
    <b-container>
      <b-row>
        <b-col>
          <br />
<!--
          <p class="texto-introd">Texto explicando que tipo de trámites se pueden hacer desde esta página, que pasos va a tener que seguir, y que resultado va a obtener.</p>
          <p class="texto-introd">Aclarar que va a tener que llevar los documentos fisicos en un plazo de 30 días y todo eso.</p>
-->          
          
          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(1) }">
            <h4 class="section-title" @click="toggleCard(1)">
              ¿QUIEN PUEDE INICIAR EL TRAMITE?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(1)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <ul v-show="isCardExpanded(1)">
                <li><b-icon-person-circle font-scale="1.25" class="icon-orange"></b-icon-person-circle>El interesado futuro comerciante/industrial o afin mayor de 18 años.</li>
                <li><b-icon-person-circle font-scale="1.25" class="icon-orange"></b-icon-person-circle>El apoderado o autorizado del anterior con documentación que acredite el carácter de tal. <b-icon-question-circle-fill @click="openPopup('A')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></li>
              </ul>
            </transition>
          </b-card>

          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(2) }">
            <h4 class="section-title" @click="toggleCard(2)">
              ¿QUE NECESITO PARA INICIAR EL TRAMITE?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(2)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(2)">
              <ul>
                <li><b-icon-check-circle font-scale="1.25" class="icon-orange"></b-icon-check-circle> DNI del solicitante (imagen del frente y dorso).</li>
                <li><b-icon-check-circle font-scale="1.25" class="icon-orange"></b-icon-check-circle> Domicilio real y legal del establecimiento (deberá constar calle y número). <b-icon-question-circle-fill @click="openPopup('B')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></li>
                <li><b-icon-check-circle font-scale="1.25" class="icon-orange"></b-icon-check-circle> Copia de plano del edificio (conforme a obra/aprobado/registrado) donde se instalará el comercio que se solicita habilitar. Allí deberás señalar con una cruz sobre el plano la unidad funcional en donde se ubicará el establecimiento. <b-icon-question-circle-fill @click="openPopup('B')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></li>
                <li><b-icon-check-circle font-scale="1.25" class="icon-orange"></b-icon-check-circle> Certificado de libre-deuda de la <a href="https://arvige.gob.ar/lpagos" target="_blank" class="external-link">Tasa por Sevicios Urbanos</a> (ó útima factura de pago que indique que la Tasa municipal no registra deuda). <b-icon-question-circle-fill @click="openPopup('LibreDeuda')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></li>
                <li><b-icon-check-circle font-scale="1.25" class="icon-orange"></b-icon-check-circle> Copia de la Escritura traslativa de Dominio del inmueble donde se desarrollará la actividad / Contrato de locación / Boleto de Compraventa o afín, con el correspondiente Impuesto de Sellos Provincial y firma certificada por Escribano Publico, Entidad Bancaria o Autoridad Administrativa.</li>
                <li><b-icon-check-circle font-scale="1.25" class="icon-orange"></b-icon-check-circle> Constancia de <a href="https://seti.afip.gob.ar/padron-puc-constancia-internet/ConsultaConstanciaAction.do" target="_blank" class="external-link">CUIT</a> actualizada. </li>
                <li><b-icon-check-circle font-scale="1.25" class="icon-orange"></b-icon-check-circle> <a href="https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?tramite=582&categ=34" target="_blank" class="external-link">Constancia de Inscripción en Ingresos Brutos</a> (ARBA) actualizada al momento de la solicitud. Esta deberá mantenerse activa mientras el comercio, industria o asimilable esté habilitado, bajo pena de ser pasible de la clausura del establecimiento.</li>
                <li><b-icon-check-circle font-scale="1.25" class="icon-orange"></b-icon-check-circle> <a href="https://arvige.gob.ar/lpagos" target="_blank" class="external-link">Planilla de Autorización de Trámite</a> en caso de realizarlo mediante apoderado</li>
              </ul>
              <b-card border-variant="warning" align="center" >
                <b-card-text>                              
                  <b-row>
                    <b-col md="1">
                      <b-icon-exclamation-triangle variant="warning" font-scale="4"></b-icon-exclamation-triangle>
                    </b-col>
                    <b-col md="11">
                      <p><u><b>Importante!</b></u> Excepto el domicilio, el resto de los <b>documentos</b> deberán encontrarse <b>digitalizados</b> (podés escanearlos o sacarles una fotografía) y deben <b>ser legibles</b>. Pueden encontrarse en <b>formato pdf o imagen</b> y tener un <b>peso máximo de 15 Mb</b>.</p>
                    </b-col>
                  </b-row>
                </b-card-text>
              </b-card>
              </div>
            </transition>
          </b-card>

          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(3) }">
            <h4 class="section-title" @click="toggleCard(3)">
              REQUISITOS ESPECIALES POR RUBRO
              <b-icon-chevron-compact-down v-if="!isCardExpanded(3)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(3)">
                <p>Selecciona el rubro para consultar sus requisitos específicos y para ver en el mapa las zonas permitidas. Si no encontrás el rubro que querés consultar, es porque no tiene ningún requisito especial.</p>
                <b-form-group label="Seleccione el Rubro" label-for="rubro">
                  <b-form-select v-model="rubroSeleccionado.id" :options="filteredRubros" value-field="id" text-field="nombre" @change="handleRubroChange" style="margin:10px 0;"></b-form-select>
                </b-form-group>    
                <div v-if="rubroSeleccionado.id">            
                  <p>{{ rubroSeleccionado.descripcion }}</p>       
                  <h5 class="subtitle"><b-icon-card-checklist class="icon-orange" scale="1.5"></b-icon-card-checklist> <u>Requisitos especiales para el rubro: {{ rubroSeleccionado.nombre }}</u></h5>
                  <ul v-if="rubroSeleccionado.requisitos.length">
                    <li v-for="(req, index) in rubroSeleccionado.requisitos" :key="index">
                      <b-icon-caret-right-fill class="icon-orange" font-scale="1.25"></b-icon-caret-right-fill> {{ req }}
                    </li>
                  </ul>
                  <b-card v-if="rubroSeleccionado.inspeccion" border-variant="info" align="center" >
                    <b-card-text>                              
                      <b-row>
                        <b-col md="1">
                          <b-icon-calendar3 variant="info" font-scale="4"></b-icon-calendar3>
                        </b-col>
                        <b-col md="10">
                          <p><u><b>Importante!</b></u> Para habilitar un comercio del rubro <b>{{ rubroSeleccionado.nombre }}</b> necesitás solicitar turno para que nuestros inspectores realicen una visita al establecimiento. Los turnos se dan con <b>15 días de anticipación</b> una vez aprobado el formulario de habilitación.</p>
                        </b-col>
                        <b-col md="1">
                          <b-iconstack font-scale="4">
                            <b-icon-person-badge stacked variant="info"></b-icon-person-badge>
                            <b-icon-search stacked shift-h="-6" shift-v="-6" variant="danger" scale="0.5"></b-icon-search>
                          </b-iconstack>
                        </b-col>
                      </b-row>
                    </b-card-text>
                  </b-card>
                  <h5 class="subtitle"><b-icon-pin-map-fill class="icon-orange" scale="1.5"></b-icon-pin-map-fill> <u>Zonas permitidas para el rubro: {{ rubroSeleccionado.nombre }}</u></h5>
                  <iframe v-if="rubroSeleccionado.pom" :src="`${rubroSeleccionado.pom}`" width="100%" height="800" allow="autoplay"></iframe>          
                  <p v-if="rubroSeleccionado">Descarga el Mapa con las zonas permitidas para el rubro {{ rubroSeleccionado.nombre }}
                    <a :href="`${rubroSeleccionado.pom}`">AQUI</a>+
                  </p>
                  <h5 class="subtitle" v-if="rubroSeleccionado.ordenanzas.length"><b-icon-search class="icon-orange" scale="1.5"></b-icon-search> <u>Ordenanzas relacionadas:</u></h5>
                  <ul v-if="rubroSeleccionado.ordenanzas.length">
                    <li v-for="(ordenanza, index) in rubroSeleccionado.ordenanzas" :key="index">
                      <b-icon-info-circle-fill class="icon-orange" font-scale="1.25"></b-icon-info-circle-fill><a class="external-link" :href="rubroSeleccionado.links[index]"> {{ ordenanza }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(4) }">
            <h4 class="section-title" @click="toggleCard(4)">PREGUNTAS FRECUENTES PARA HABILITAR
              <b-icon-chevron-compact-down v-if="!isCardExpanded(4)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>            
            <transition name="expand">
              <ul v-show="isCardExpanded(4)" class="FAQs">
                <li><b-icon-question-circle font-scale="1.25" class="icon-orange"></b-icon-question-circle> ¿Por qué tengo que habilitar mi local?</li>
                <div class="sangria">
                  <p>La Municipalidad de Villa Gesell dispone que toda persona humana o jurídica que pretenda ejercer el comercio, industria o actividad asimilable deberá, previo a su desarrollo dentro del Partido, solicitar la habilitación pertinente.</p>
                </div>
                <li><b-icon-question-circle font-scale="1.25" class="icon-orange"></b-icon-question-circle> ¿Qué sucede si abro un local comercial sin realizar la habilitación correspondiente?</li>
                <div class="sangria">
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill>La omisión de la habilitación determinará la inmediata clausura del establecimiento, debiendo abonar la multa correspondiente para quienes cometieran tal infracción.</p>                  
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill>El establecimiento deberá permanecer cerrado hasta tanto regularice su trámite de habilitación.</p>
                </div>
                <li><b-icon-question-circle font-scale="1.25" class="icon-orange"></b-icon-question-circle> ¿Cómo se calcula la Tasa de Habilitación?</li>
                <div class="sangria">
                  <p>La Tasa de Habilitación depende de los siguientes factores:</p>
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill>El rubro que se quiere habilitar.</p>
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill>La zona donde se encuentra el local.</p>
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill>La superficie total afectada a la actividad comercial (que implican el sector de atención al público, depósito, espacio de circulación, entrepiso, sanitarios, entre otros).</p>
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill>La condición del plano de obra.</p>
                </div>
                <li><b-icon-question-circle font-scale="1.25" class="icon-orange"></b-icon-question-circle> Para facilitar la búsqueda de un local: ¿Dónde puedo consultar la Zona Comercial Apta para habilitar y los requisitos edilicios para su instalación y funcionamiento?</li>
                <div class="sangria">
                  <p>Para realizar tu consulta, podés enviar un correo electrónico a: ………….……, informando los siguientes datos: </p>
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill>Rubro a habilitar.</p>
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill>Domicilio real del local (Calle y Número).</p>
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill>Localidad de ubicación en el Partido de Villa Gesell.</p>
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill>Datos catastrales: Sección- Manzana - Parcela - Unidad Contributiva.</p>
                </div>
                <li><b-icon-question-circle font-scale="1.25" class="icon-orange"></b-icon-question-circle> ¿Deben renovarse las habilitaciones comerciales?</li>
                <div class="sangria">
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill><u>En caso de contrato de locación:</u> Las habilitaciones se extienden por el período que abarca el contrato de locación y deben reempadronarse anualmente, según corresponda, teniendo en cuenta la normativa vigente.</p>
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill><u>En caso de ser propietario/a del inmueble:</u> Las habilitaciones no tienen caducidad si la titularidad o las condiciones acreditadas al momento de la entrega del certificado de habilitación no cambian.</p>
                </div>
                <li><b-icon-question-circle font-scale="1.25" class="icon-orange"></b-icon-question-circle> ¿Cómo puedo obtener el Registro Provincial para la Comercialización de Bebidas Alcohólicas (REBA)?</li>
                <div class="sangria">
                  <p>Las actividades que comercializan bebidas alcohólicas deben tramitar el certificado del REBA correspondiente.</p>
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill>Para tramitarlo debés tener tu habilitación comercial vigente.</p>
                  <p><b-icon-caret-right-fill class="icon-orange"></b-icon-caret-right-fill>Su costo dependerá de la actividad comercial que se lleve a cabo.</p>
                </div>
              </ul>
            </transition>
          </b-card>

          <b-card id="normas" class="section-card" v-bind:class="{ 'expanded': isCardExpanded(0) }">
            <h4 class="section-title" @click="toggleCard(0)">
              NORMAS APLICABLES/CONDICIONES LEGALES
              <b-icon-chevron-compact-down v-if="!isCardExpanded(0)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <p v-show="isCardExpanded(0)">
                La habilitación de comercios/industrias o asimilables deberá adecuarse a lo determinado en concordancia con leyes nacionales, provinciales y la
                <a href="https://arvige.gob.ar/legislacion/pdf/12" target="_blank" class="external-link">Ordenanza 2156/08 (TO 2023)</a>
                y el 
                <a href="/ordenanzas" target="_blank" class="external-link">Digesto Comercial Municipal</a>
                 (Creado por el
                <b>Decreto 1856/23</b>).
              </p>
            </transition>
          </b-card>
        <b-button variant="" class="float-right" @click="openPopup('Form')">Iniciar Trámite</b-button>
        <br />
        </b-col>
      </b-row>
    </b-container>
    
    <!-- Popups -->
    <b-modal v-model="showPopupA" title="Información Adicional: Apoderado" :hide-footer="true" @click-outside="showPopupA = false" centered>
        <p>El apoderado del anterior con documentación que acredite el carácter de tal.</p>
        <p>Permite facultar a una persona para la realización de trámites, actos y gestiones, en representación del/la contribuyente o responsable solicitante.</p>
        <ol>
            <li><b>SUCESIONES INDIVISAS:</b> Casos en que, existiendo varios/as herederos/as, todos/as son propietarios/as de los bienes, pero aún no se ha realizado la división de los mismos en la proporción que cada uno/a tiene derecho a heredar.</li>
            <li><b>HEREDEROS/AS/ES O LEGATARIOS/AS/ES (Causahabientes):</b> Sucesor/a de una persona fallecida (actuación ante el Fisco previa al inicio de la sucesión o iniciada esta, previa a la declaratoria de herederos/as).</li>
            <li><b>REPRESENTANTE LEGAL:</b> Persona que actúa en nombre y por cuenta de una persona Jurídica en virtud del carácter que posee por integrar los órganos de mando. Asimismo, los padres que ejercen la patria potestad sobre sus hijos/as.</li>
            <li><b>REPRESENTANTE JUDICIAL:</b> Persona que actúa en nombre y por cuenta de otra (Humana o Jurídica) en virtud de una designación judicial, debido a una incapacidad legal que recae sobre aquella.</li>
            <li><b>REPRESENTANTE VOLUNTARIO:</b> Persona que actúa en nombre y por cuenta de otra, en virtud de la facultad que ella le confiere mediante un mandato (poder o autorización).</li>
        </ol>        
            <b-btn class="float-right" variant="primary" @click="showPopupA = false">OK</b-btn>
    </b-modal>
    <b-modal v-model="showPopupB" title="Información Adicional (B)" :hide-footer="true" @click-outside="showPopupB = false" centered>
        <p>En caso que el plano no se encuentre conforme a obra/aprobado o registrado iniciara via de excepcion.</p>
    </b-modal>
    <b-modal v-model="showPopupD" title="Información Adicional (D)" :hide-footer="true" @click-outside="showPopupD = false" centered>
      <p>En caso de ser positiva la inspección correspondiente deberá constituir domicilio fiscal electrónico de quien ejerza la actividad donde serán válidas las notificaciones efectuadas.</p>
    </b-modal>
    <b-modal v-model="showPopupE" title="Información Adicional (E)" :hide-footer="true" @click-outside="showPopupE = false" centered>
      <p>Ingrese aqui.</p>
    </b-modal>
    <!-- Popup de advertencia -->
    <b-modal v-model="showConfirmationPopup" hide-footer centered>
        <template #modal-header>
          <div><h3>
              <b-icon icon="exclamation-triangle" scale="1.5" variant="warning" style="margin: 0 20px 0 10px"></b-icon>
              <b>Advertencia!</b>
          </h3></div>
        </template>
        <p>Antes de continuar, tené en cuenta lo siguiente:</p>
        <ul>
          <li>El formulario al que estás a punto de acceder no se guarda automáticamente.</li>
          <li>Si no contás con toda la información requerida y/o los documentos digitalizados no podrás completar el proceso y deberás comenzarlo nuevamente una vez que tengas toda la documentación.</li>
          <li>Recordá que los documentos deben ser legibles, estar subidos en formato de imagen ó pdf y tener un peso máximo de 15 mb.</li>
        </ul>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="documentCheckbox" v-model="documentCheckboxChecked"/>
            <label class="form-check-label" for="documentCheckbox">Ya tengo todos los documentos digitalizados y la información requerida.</label>
        </div>
        <div class="text-center mt-3">
            <nuxt-link :class="{ 'disabled': !documentCheckboxChecked }" to="/comercio/form">
            <b-btn variant="primary" :disabled="!documentCheckboxChecked" @click="proceedToForm()" >
                Confirmar
            </b-btn>            
            </nuxt-link>
        </div>
    </b-modal>
    <!-- Popup de solicitud de libredeuda -->
    <b-modal v-model="showLibreDeudaPopup" title="SOLICITUD DE LIBRE DEUDA" @hide="resetForm" hide-footer centered>
      <p>Si no tienes el libre deuda, Puedes solicitarlo completando los datos a continuación:</p>
      <p>(HAY 2 TIPOS DE LIBRE DEUDA, AVERIGUAR SI SE NECESITAN LOS 2 O CUAL DE LOS 2 - URBANO Y COMERCIAL -)</p>
      <b-form @submit="submitLibreDeuda">
        <b-form-group label="Email" label-for="email" :state="solicitudLibreDeuda.emailState" description="Campo requerido">
          <b-form-input id="email" v-model="solicitudLibreDeuda.email" type="email" required></b-form-input>
        </b-form-group>
        <b-form-group label="Partida Municipal" label-for="partidaMunicipal" :state="solicitudLibreDeuda.partidaMunicipalState">
          <b-form-input id="partidaMunicipal" v-model="solicitudLibreDeuda.partidaMunicipal" type="text"></b-form-input>
        </b-form-group>
        <b-form-group label="Partida Comercial" label-for="partidaComercial" :state="solicitudLibreDeuda.partidaComercialState">
          <b-form-input id="partidaComercial" v-model="solicitudLibreDeuda.partidaComercial" type="text"></b-form-input>
        </b-form-group>
        <b-form-group label="Datos Catastrales" :state="solicitudLibreDeuda.catastralDataState" class="datosCatastralesContainer">
          <div class="row">
            <div class="col-sm">
              <label for="solicitudLibreDeuda.seccion">Sección</label>
              <b-form-input v-model="solicitudLibreDeuda.seccion" type="text" placeholder="S" title="Sección" maxlength="3"></b-form-input>
            </div>
            <div class="col-sm">
              <label for="solicitudLibreDeuda.fraccion">Fracción</label>
              <b-form-input v-model="solicitudLibreDeuda.fraccion" type="text" placeholder="F" title="Fracción" maxlength="3"></b-form-input>
            </div>
            <div class="col-sm">
              <label for="solicitudLibreDeuda.quinta">Quinta</label>
              <b-form-input v-model="solicitudLibreDeuda.quinta" type="text" placeholder="Q" title="Quinta" maxlength="3"></b-form-input>
            </div>
            <div class="col-sm">
              <label for="solicitudLibreDeuda.manzana">Manzana</label>
              <b-form-input v-model="solicitudLibreDeuda.manzana" type="text" placeholder="M" title="Manzana" maxlength="3"></b-form-input>
            </div>
            <div class="col-sm">
              <label for="solicitudLibreDeuda.loteParcela">Lote</label>
              <b-form-input v-model="solicitudLibreDeuda.loteParcela" type="text" placeholder="L" title="Lote/Parcela" maxlength="3"></b-form-input>
            </div>
            <div class="col-sm">
              <label for="solicitudLibreDeuda.subparcela">Sublote</label>
              <b-form-input v-model="solicitudLibreDeuda.subparcela" type="text" placeholder="S" title="Subparcela" maxlength="3"></b-form-input>
            </div>
          </div>
        </b-form-group>
        <b-form-group>
          <div id="captchaContainer" class=""></div>
        </b-form-group>
        <input type="hidden" id="captchaResponse" name="captchaResponse" v-model="captchaResponse">
        <b-button variant="primary" class="float-right" @click="submitLibreDeuda">Enviar</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import rubros from "@/plugins/rubros.js";
export default {
  data() {
    return {
      filteredRubros: rubros,//.filter(rubro => rubro.requisitos.length > 0),
      showPopupA: false,
      showPopupB: false,
      showPopupC: false,
      showPopupD: false,
      showPopupE: false,
      showConfirmationPopup: false,
      showLibreDeudaPopup: false,
      documentCheckboxChecked: false,
      rubroSeleccionado: {
                          id: null,
                          nombre: null,
                          descripcion: null,
                          ordenanzas: [],
                          links: [],
                          requisitos: [],
                          pom: null, 
                          inspeccion: false,
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
        //CAMBIAR EL SITEKEY POR UNO DE VERDAD
        grecaptcha.ready(() => {
        grecaptcha.render('captchaContainer', {
          sitekey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
          });
        });
        this.showLibreDeudaPopup = true;
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
      this.rubroSeleccionado.ordenanzas = this.filteredRubros[i].ordenanzas;
      this.rubroSeleccionado.links = this.filteredRubros[i].links;
      this.rubroSeleccionado.requisitos = this.filteredRubros[i].requisitos;
      this.rubroSeleccionado.pom = this.filteredRubros[i].pom;
      this.rubroSeleccionado.inspeccion = this.filteredRubros[i].inspeccion;
      } else {
        // Si no se ha seleccionado ninguna opción, reiniciar las propiedades        
        this.rubroSeleccionado.nombre = null;
        this.rubroSeleccionado.descripcion = null;
        this.rubroSeleccionado.ordenanzas = [];
        this.rubroSeleccionado.links = [];
        this.rubroSeleccionado.requisitos = [];
        this.rubroSeleccionado.pom = null;
        this.rubroSeleccionado.inspeccion = false;
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
  updateRubroData() {
    if (this.rubroSeleccionado) {
      // Obtener los datos correspondientes al rubro seleccionado
      const i = this.filteredRubros.findIndex(rubro => rubro.id === this.rubroSeleccionado);
      this.rubroPrueba = this.filteredRubros.find(rubro => rubro.id === this.rubroSeleccionado);
      const descripcion = this.filteredRubros[i].descripcion;
      const ordenanzas = this.filteredRubros[i].ordenanzas;
      const links = this.filteredRubros[i].links;
      // Actualizar las propiedades con los nuevos valores
      this.descripcionSeleccionada = descripcion;
      this.ordenanzasSeleccionadas = ordenanzas;
      this.linksSeleccionados = links;
      } else {
        // Si no se ha seleccionado ninguna opción, reiniciar las propiedades
        this.descripcionSeleccionada = '';
        this.ordenanzasSeleccionadas = [];
        this.linksSeleccionados = [];
      }
    },
  }
}
</script>
<style>
.jumbotron{
  margin: 2rem 0;
  padding: 1.5rem 0;
  text-align: center;
}
.banner-icon{
  width: 100%;
  height: 100%;
  margin: auto;

}
.jumbotron h3{
  margin-bottom: 2rem;
  font-size: 2.75rem;
}
.jumbotron p{
  font-weight: bold;
  color: black;
  padding: 0 10px;
}
.jumbotron .text-circle-border{
  border: 2px solid black;
  width: fit-content;
  margin: 0 auto 15px;
  border-radius: 300px;
  padding: 5px 20px;
  font-size: 2rem;
}
.jumbotron .separador {
    border-right: 2px solid black;
    height: 125px;
    display: inline-block;
    margin: auto;
    box-shadow: -2px 0px 2px #888;
}
.container{
  margin-bottom: 25px;
}
.sangria{
  margin-left: 25px;
}
.icon-orange{
  color: #E27910;
}
.icon-green{
  color: green;
}
.texto-introd{
  font-size: 1.3rem;
}
.external-link {
  color: #007bff;
  font-weight: bold;
}
.popup-link {
  color: green;
  font-weight: bold;
}
.disabled {
  pointer-events: none;
}
.datosCatastralesContainer *{
  text-align: center;
}
.section-card{
  margin: 10px 0;
  box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
  -webkit-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
  -moz-box-shadow: 0px 2px 5px 0px rgba(0,0,0,0.75);
}
.section-card ul{
  list-style-type: none; /* Elimina los puntos por defecto */
  padding: 0;
}
.section-title {
  color: green !important;
  cursor: pointer;
  width: 100%;
  display: inline-block;
  margin-bottom:0px;
  font-weight: bold;
}
.expanded h4{
  margin-bottom: 8px;
}
.subtitle{
  color: green !important;
  font-weight: bold;
  margin: 10px 0;
}
.bi-chevron-compact-up, .bi-chevron-compact-down{
  position: absolute;
  right: 20px;
}
.bi-check-circle-fill, .bi-question-circle-fill, .bi-person-circle{
  margin-right: 5px;
}
.FAQs li{
  font-weight: 600;
  color: green;
}
/* Estilos para Animaciones de Expansión/Contracción  */
.expanded {
  max-height: 1600px; /* Altura máxima cuando está expandido */
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
</style>