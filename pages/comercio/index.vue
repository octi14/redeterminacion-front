<template>
  <div class="page">
    <Banner title="Habilitaciones comerciales" />
    <div class="col-8" style="margin: auto">
      <div class="row justify-content-center" style="width: 100%">
        <img src="../../assets/Habilitá en simples pasos.png"/>
      </div>
    </div>
    <!-- <b-jumbotron bg-variant="#F8EFE5" text-variant="black" fluid >
            <template #lead>
              <b-row>
                <b-col md="10">
                  <b-row><b-col>
                      <h4 class="icon-orange">¡Habilitá tu comercio en simples pasos!</h4>
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
          </b-jumbotron> -->
    <b-container class="col-8">
      <b-row>
        <b-col>
          <br />
          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(1) }">
            <h4 class="section-title" @click="toggleCard(1)">
              ¿Quién puede iniciar el trámite?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(1)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <ul v-show="isCardExpanded(1)">
                <li><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El interesado futuro comerciante/industrial o afin mayor de 18 años.</div></li>
                <li><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El representante o apoderado/a de la persona interesada con documentación que acredite el carácter de tal. <b-icon-question-circle-fill @click="openPopup('A')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></li>
              </ul>
            </transition>
          </b-card>

          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(2) }">
            <h4 class="section-title" @click="toggleCard(2)">
              ¿Qué necesito para iniciar el trámite?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(2)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(2)">
              <ul>
                <li><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> DNI del solicitante <i>(imagen del frente y dorso)</i>.</div></li>
                <li><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Domicilio real y legal del establecimiento <i>(deberá constar calle y número)</i>. <b-icon-question-circle-fill @click="openPopup('B')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></li>
                <li><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Copia de plano (en alguna de sus dos posibilidades: <i>1. Conforme a obra o Medición aprobado / 2. Conforme a obra o Medición registrado).</i> En caso de no poseerlo, se requerirá el Informe Técnico debidamente visado por el Colegio Profesional correspondiente. <b-icon-question-circle-fill @click="openPopup('B')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div></li>
                <li><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Libre deuda de <a href="https://arvige.gob.ar/lpagos" target="_blank" class="external-link">Tasa por Sevicios Urbanos</a> <i>(o última factura de pago que indique que la Tasa municipal no registra deuda)</i>. </div></li>
                <li><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Copia de la Escritura traslativa de Dominio del inmueble donde se desarrollará la actividad / Contrato de locación / Boleto de Compraventa o afín, con el correspondiente Impuesto de Sellos Provincial y firma certificada por Escribano Público, Entidad Bancaria o Autoridad Administrativa.</div></li>
                <li><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <a href="https://seti.afip.gob.ar/padron-puc-constancia-internet/ConsultaConstanciaAction.do" target="_blank" class="external-link">Constancia de CUIT</a> actualizada.</div></li>
                <li><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <a href="https://www.arba.gov.ar/GuiaTramites/TramiteSeleccionado.asp?tramite=582&categ=34" target="_blank" class="external-link">Constancia de Inscripción en Ingresos Brutos</a> (ARBA) actualizada al momento de la solicitud. Esta deberá mantenerse activa mientras el comercio, industria o asimilable esté habilitado, bajo pena de ser pasible de la clausura del establecimiento.</div></li>
                <li><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Certificado de domicilio Ingresos Brutos - Punto de venta Villa Gesell.</div></li>
                <li><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <a href="https://drive.google.com/file/d/1-ipJMlrR0wEA38MSykC5eZWfjVil3S6P/view?usp=sharing" target="_blank" class="external-link">Planilla de Autorización de Trámite</a> o poder autorizado por escribano <i>(únicamente si el trámite es iniciado mediante representante o apoderado/a)</i>.</div></li>
                <li><div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> <b>Personas Jurídicas:</b> Escritura constitutiva de la misma con designación actual de sus representantes.</div></li>
              </ul>
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
                      <ul>
                        <li><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Si en el lugar <b>donde vas a habilitar tu comercio existía otro antes, este último debe estar dado de baja. En caso contrario</b>, deberás concurrir personalmente al <b>Departamento Comercio Municipal</b> para <b>regularizar la situación</b> y poder iniciar el trámite de habilitación.</div></li>
                        <li><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Tené en cuenta que <b>la iniciación y pago del trámite no implican la habilitación tácita</b>, ya que <b>la misma está sujeta a la entrega de la documentación original y al retiro del certificado de habilitación</b>. <u>Mientras tanto el local deberá permanecer cerrado.</u></div></li>
                      </ul>
                    </b-col>
                  </b-row>
                </b-card-text>
              </b-card>
              </div>
            </transition>
          </b-card>

          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(3) }">
            <h4 class="section-title" @click="toggleCard(3)">
              Requisitos especiales por rubro
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
                  <h5 class="subtitle"><u>¿A que nos referimos cuando hablamos de "{{ rubroSeleccionado.nombre }}"?</u></h5>          
                  <p>{{ rubroSeleccionado.descripcion }}</p>       
                  <h5 v-if="rubroSeleccionado.requisitos.length" class="subtitle"><div class="li-icon"><b-icon-card-checklist class="icon-orange" scale="1.5"></b-icon-card-checklist></div><div class="li-content"> <u>Requisitos especiales para el rubro: {{ rubroSeleccionado.nombre }}</u></div></h5>
                  <ul v-if="rubroSeleccionado.requisitos.length">
                    <li v-for="(req, index) in rubroSeleccionado.requisitos" :key="index">
                      <div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1.25"></b-icon-caret-right-fill></div><div class="li-content"> {{ req }}</div>
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
                  <h5 class="subtitle"><div class="li-icon"><b-icon-pin-map-fill class="icon-orange" scale="1.5"></b-icon-pin-map-fill></div> <div class="li-content"><u>Zonas permitidas para el rubro: {{ rubroSeleccionado.nombre }}</u></div></h5>
                  <iframe v-if="rubroSeleccionado.pom" :src="`${rubroSeleccionado.pom}`" width="100%" height="800" allow="autoplay"></iframe>          
                  <p v-if="rubroSeleccionado">Descarga el Mapa con las zonas permitidas para el rubro <b>{{ rubroSeleccionado.nombre }}</b>
                    <a class="external-link" :href="`${rubroSeleccionado.pom}`">AQUI</a>
                  </p>
                  <h5 class="subtitle" v-if="rubroSeleccionado.ordenanzas.length"><div class="li-icon"><b-icon-search class="icon-orange" scale="1.5"></b-icon-search></div> <div class="li-content"><u>Ordenanzas relacionadas:</u></div></h5>
                  <ul v-if="rubroSeleccionado.ordenanzas.length">
                    <li v-for="(ordenanza, index) in rubroSeleccionado.ordenanzas" :key="index">
                      <div class="li-icon"><b-icon-info-circle-fill class="icon-orange" font-scale="1.25"></b-icon-info-circle-fill></div><div class="li-content"><a class="external-link" :href="rubroSeleccionado.links[index]"> {{ ordenanza }}</a></div>
                    </li>
                  </ul>
                </div>
              </div>
            </transition>
          </b-card>
          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(4) }">
            <h4 class="section-title" @click="toggleCard(4)">Preguntas Frecuentes
              <b-icon-chevron-compact-down v-if="!isCardExpanded(4)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <ul v-show="isCardExpanded(4)" class="FAQs">
                <li>
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content li-title">¿Por qué tengo que habilitar mi local?</div>
                  <div class="li-icon"></div><div class="li-content">La Municipalidad de Villa Gesell dispone que toda persona humana o jurídica que pretenda ejercer el comercio, industria o actividad asimilable deberá, previo a su desarrollo dentro del Partido, solicitar la habilitación pertinente.</div>
                </li>
                <li>
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content li-title">¿Qué sucede si abro un local comercial sin realizar la habilitación correspondiente?</div>
                  <div class="li-icon"></div><div class="li-content">
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">La omisión de la habilitación determinará la inmediata clausura del establecimiento, debiendo abonar la multa correspondiente para quienes cometieran tal infracción.</div>
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El establecimiento deberá permanecer cerrado hasta tanto regularice su trámite de habilitación.</div>
                  </div>
                </li>
                <li>
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content li-title">¿Qué sucede si en el local donde voy a habilitar mi comercio existía otro antes?</div>
                  <div class="li-icon"></div><div class="li-content">En este caso, el comercio anterior debe estar dado de baja. Dicho trámite se realiza personalmente en el Departamento de Comercio Municipal.</div>
                </li>
                <li>
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content li-title">¿Cómo se calcula la Tasa de Habilitación?</div>              
                  <div class="li-icon"></div><div class="li-content li-p">La Tasa de Habilitación depende de los siguientes factores:</div>
                  <div class="li-icon"></div><div class="li-content">                  
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El rubro que se quiere habilitar.</div>
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> La zona donde se encuentra el local.</div>
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> La superficie total afectada a la actividad comercial (que implican el sector de atención al público, depósito, espacio de circulación, entrepiso, sanitarios, entre otros).</div>
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> La condición del plano de obra (aprobado o registrado).</div>
                  </div>
                </li>
                <li>
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content li-title">Para facilitar la búsqueda de un local: ¿Dónde puedo consultar la Zona Comercial Apta para habilitar y los requisitos edilicios para su instalación y funcionamiento?</div>
                  <div class="li-icon"></div><div class="li-content li-p">Para realizar tu consulta, podés enviar un correo electrónico a: <a class="external-link" href="mailto:deptocomercio@gesell.gob.ar" target="_blank">deptocomercio@gesell.gob.ar</a> informando los siguientes datos:</div>
                  <div class="li-icon"></div><div class="li-content">                  
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Rubro a habilitar.</div>
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Domicilio real del local (Calle y Número).</div>
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Localidad de ubicación en el Partido de Villa Gesell.</div>
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> Datos catastrales: Chacra- Quinta- Manzana - Parcela - Unidad Contributiva.</div>
                  </div> 
                </li>
                <li>
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content li-title">¿Deben renovarse las habilitaciones comerciales?</div>
                  <div class="li-icon"></div><div class="li-content">                   
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"><b>En caso de contrato de locación:</b> Las habilitaciones se extienden por el período que abarca el contrato de locación y deben reempadronarse anualmente, según corresponda, teniendo en cuenta la normativa vigente.</div>
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"><b>En caso de ser propietario/a del inmueble:</b> Las habilitaciones no tienen caducidad si la titularidad o las condiciones acreditadas al momento de la entrega del certificado de habilitación no cambian.</div>
                  </div>
                </li> 
                <li>
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content li-title">¿Cómo puedo obtener el Registro Provincial para la Comercialización de Bebidas Alcohólicas (REBA)?</div>
                  <div class="li-icon"></div><div class="li-content li-p">Las actividades que comercializan bebidas alcohólicas deben tramitar el certificado del REBA correspondiente.</div>
                  <div class="li-icon"></div><div class="li-content">                  
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">Para tramitarlo debés tener tu habilitación comercial vigente.</div>
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">Su costo dependerá de la actividad comercial que se lleve a cabo.</div>
                    <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content">El trámite se lleva a cabo <b>personalmente</b> en la Municipalidad una vez iniciado el trámite online. </div>
                  </div>
                  </li>
              </ul>
            </transition>
          </b-card>

          <b-card id="normas" class="section-card" v-bind:class="{ 'expanded': isCardExpanded(0) }">
            <h4 class="section-title" @click="toggleCard(0)">
              Condiciones legales
              <b-icon-chevron-compact-down v-if="!isCardExpanded(0)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <p v-show="isCardExpanded(0)">
                La habilitación de comercios/industrias o asimilables deberá adecuarse a lo determinado en concordancia con leyes nacionales, provinciales y la
                <a href="https://arvige.gob.ar/legislacion/pdf/12" target="_blank" class="external-link">Ordenanza 2156/08 (TO 2023)</a>
                y el 

                <a href="/ordenanzas" target="_blank" class="external-link">Digesto Comercial Municipal</a>
                 (creado por el
                Decreto 1856/23).
              </p>
            </transition>
          </b-card>
        <b-button variant="success" class="float-right btn-form" @click="openPopup('Form')">Iniciar Trámite</b-button>
        <br />
        </b-col>
      </b-row>
    </b-container>

    <!-- Popups -->
    <b-modal v-model="showPopupA" title="" :hide-footer="true" @click-outside="showPopupA = false" :header-bg-variant="'success'" centered>
        <template #modal-header>
          <div class="modal-info">
            <h5>
                <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
                Información Adicional
            </h5>
          </div>
        </template>
        <div class="modal-info">
          <h3>Representante o Apoderado/a</h3>
          <p class="destacado"><b-icon-caret-right-fill ></b-icon-caret-right-fill>Esta figura permite facultar a una persona para la realización de trámites, actos y gestiones en representación del/la contribuyente o responsable solicitante.</p>
          <h6>Casos de Representación:</h6>
          <ol>
            <li><b>Representante Voluntario:</b> Persona que actúa en nombre y por cuenta de otra, en virtud de la facultad que ella le confiere mediante un mandato (poder o autorización).</li>
            <li><b>Representante Legal:</b> Persona que actúa en nombre y por cuenta de una Persona Jurídica en virtud del carácter que posee por integrar los órganos de mando. Asimismo, los padres que ejercen la patria potestad sobre sus hijos/as.</li>
            <li><b>Representante Judicial:</b> Persona que actúa en nombre y por cuenta de otra (Humana o Jurídica) en virtud de una designación judicial, debido a una incapacidad legal que recae sobre aquella.</li>
            <li><b>Sucesiones Indivisas:</b> Casos en que, existiendo varios/as herederos/as, todos/as son propietarios/as de los bienes, pero aún no se ha realizado la división de los mismos en la proporción que cada uno/a tiene derecho a heredar.</li>
            <li><b>Herederos/as o Legatarios/as (Causahabientes):</b> Sucesor/a de una persona fallecida (actuación ante el Fisco previa al inicio de la sucesión o iniciada ésta, previa a la declaratoria de herederos/as).</li>
          </ol>
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
        </template>
        <div class="modal-info">
          <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>En caso que el plano no se encuentre conforme a obra/aprobado o registrado iniciara via de excepcion.</p>
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
      </template>
      <div class="modal-info">
        <p><b-icon-caret-right-fill ></b-icon-caret-right-fill>Ingrese aqui.</p>
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
          <ul>
            <li><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Si no contás con toda la información requerida y/o digitalizada no podrás completar el proceso y deberás iniciarlo nuevamente una vez que cuentes con toda la documentación.</div></li>
            <li><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Recordá que los documentos deben ser legibles, estar subidos en formato imagen o pdf y tener un peso máximo de 15 mb.</div></li>
          </ul>
          <div class="form-check">
              <input class="form-check-input" type="checkbox" id="documentCheckbox" v-model="documentCheckboxChecked"/>
              <label class="form-check-label" for="documentCheckbox">Ya tengo todos los documentos digitalizados y la información requerida.</label>
          </div>
          <div class="text-center mt-3">
              <nuxt-link :class="{ 'disabled': !documentCheckboxChecked }" to="/comercio/form">
              <b-btn variant="success" :disabled="!documentCheckboxChecked" @click="proceedToForm()" >
                  Aceptar
              </b-btn>
              </nuxt-link>
          </div>
        </div>
    </b-modal>
    <!-- Popup de solicitud de libredeuda -->
    <b-modal v-model="showLibreDeudaPopup" title="SOLICITUD DE LIBRE DEUDA" @hide="resetForm" :header-bg-variant="'success'" hide-footer centered>
      <p>Si no tienes el libre deuda, Puedes solicitarlo</p>
    </b-modal>
  </div>
</template>

<script>
import rubros from "@/plugins/rubros.js";
export default {
  data:function() {
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
<style scoped>
.importante-card li{
  text-align: left;
  margin-bottom: 1rem;
}
.separador-top{
  border-top: 1px solid #ccc;
  padding: 2rem 0;
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
  font-size: 3rem;
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
.confirmation-popup-body ul{
  width: 90%;
  margin: auto;
  margin-bottom: 1rem;
}
.confirmation-popup-body .li-icon{
  margin-right: 2%;
}
.confirmation-popup-body .li-content{
  width: 95%;
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
.modal-info h3{
  color: #0c681a !important;
  font-weight: bold;
  font-size: 2rem;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: #ccc 2px solid;
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
  padding-bottom: 1rem;
  width: 100%;
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
  color: #0c681a;
  vertical-align: top;
  margin-top: 0.35rem;
  font-size: 1.05rem;
}
.modal-info p{
  font-size: 1.05rem;
  font-weight: 600;
  width: 90%;
  color: #666;
}
.modal-info ol b, .modal-info a{
  color: #0c681a;
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
  margin: 10px 0;
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
.expanded h4{
  margin-bottom: 20px;
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
.FAQs li{
  margin-bottom:15px;
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
  width: 2%;
  margin-right: 1%;
  vertical-align: top;
}
.li-content{
  width: 96%;
}
.li-p{
  margin-bottom: 1rem;
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
