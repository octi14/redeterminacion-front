<template>
  <div class="page main-background">
    <Banner title="Habilitaciones comerciales" />
    <div class="col-10" style="margin: auto; margin-top: 2rem">
      <div class="row justify-content-center" >
        <img width="100%" src="../../assets/Habilitá en simples pasos.png" />
      </div>
    </div>
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
              <div v-show="isCardExpanded(1)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El interesado futuro comerciante/industrial o afin mayor de 18 años.</div>
                </div>
                <div class="li-row">
                  <div class="li-icon"><b-icon-check-lg font-scale="0.75" class="icon-orange"></b-icon-check-lg></div><div class="li-content"> El representante o apoderado/a de la persona interesada con documentación que acredite el carácter de tal. <b-icon-question-circle-fill @click="openPopup('A')" font-scale="1.25" variant="info"></b-icon-question-circle-fill></div>
                </div>
              </div>
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
                        <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Si en el lugar <b>donde vas a habilitar tu comercio existía otro antes, este último debe estar dado de baja. En caso contrario</b>, deberás concurrir personalmente al <b>Departamento Comercio Municipal</b> para <b>regularizar la situación</b> y poder iniciar el trámite de habilitación.</div></div>
                        <div class="li-row"><div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Tené en cuenta que <b>la iniciación y pago del trámite no implican la habilitación tácita</b>, ya que <b>la misma está sujeta a la entrega de la documentación original y al retiro del certificado de habilitación</b>. <u>Mientras tanto el local deberá permanecer cerrado.</u></div></div>
                    </b-col>
                  </b-row>
                </b-card-text>
              </b-card>
              </div>
            </transition>
          </b-card>

          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(3) }">
            <h4 class="section-title" @click="toggleCard(3)">
              Requisitos por rubros comerciales
              <b-icon-chevron-compact-down v-if="!isCardExpanded(3)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(3)">
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
          <b-card class="section-card FAQs-card" v-bind:class="{ 'expanded': isCardExpanded(4) }">
            <h4 class="section-title" @click="toggleCard(4)">Preguntas Frecuentes
              <b-icon-chevron-compact-down v-if="!isCardExpanded(4)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(4)">
                <div class="li-row first-li">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Por qué tengo que habilitar mi local?</p>
                    <p>La Municipalidad de Villa Gesell dispone que toda persona humana o jurídica que pretenda ejercer el comercio, industria o actividad asimilable deberá, previo a su desarrollo dentro del Partido, solicitar la habilitación pertinente.</p>
                  </div>
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
                <div class="li-row">
                  <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div>
                  <div class="li-content">
                    <p class="li-title">¿Qué sucede si en el local donde voy a habilitar mi comercio existía otro antes?</p>
                    <p>En este caso, el comercio anterior debe estar dado de baja. Dicho trámite se realiza personalmente en el Departamento de Comercio Municipal.</p>
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
                    <p class="li-title">Para visualizar como realizar tu trámite, podés mirar este video tutorial</p>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/HJwZkfxsnOw?si=EszZ_Byjmv2-ysF8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                  </div>
                </div>
              </div>
            </transition>
          </b-card>

          <b-card id="normas" class="section-card" v-bind:class="{ 'expanded': isCardExpanded(0) }">
            <h4 class="section-title" @click="toggleCard(0)">
              Condiciones legales
              <b-icon-chevron-compact-down v-if="!isCardExpanded(0)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <div v-show="isCardExpanded(0)">
                <p class="first-li">
                  La habilitación de comercios/industrias o asimilables deberá adecuarse a lo determinado en concordancia con leyes nacionales, provinciales y la
                  <a href="https://arvige.gob.ar/legislacion/pdf/12" target="_blank" class="external-link">Ordenanza 2156/08 (TO 2023)</a>
                  y el <a href="/ordenanzas" target="_blank" class="external-link">Digesto Comercial Municipal</a>
                  (creado por el Decreto 1856/23).
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
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Si no contás con toda la información requerida y/o digitalizada no podrás completar el proceso y deberás iniciarlo nuevamente una vez que cuentes con toda la documentación.</div>
          </div>
          <div class="li-row">
            <div class="li-icon"><b-icon-caret-right-fill font-scale="1" class="icon-orange"></b-icon-caret-right-fill></div><div class="li-content">Recordá que los documentos deben ser legibles, estar subidos en formato imagen o pdf y tener un peso máximo de 15 mb.</div>
          </div>
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
      filteredRubros: rubros,//.filter(rubro => rubro.requisitos.length > 0),
      showPopupA: false,
      showPopupB: false,
      showPopupC: false,
      showPopupD: false,
      showPopupE: false,
      showConfirmationPopup: false,
      showLibreDeudaPopup: false,
      showPopupNroInmueble: false,
      documentCheckboxChecked: false,
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
  }
}
</script>
<style scoped>
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
  max-height: 2000px; /* Altura máxima cuando está expandido */
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
