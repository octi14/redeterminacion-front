<template>
  <div class="page">
    <Banner title="Habilitaciones comerciales" />
    <b-container>
      <b-row>
        <b-col>
          <br />
          <p class="texto-introd">Texto explicando que tipo de trámites se pueden hacer desde esta página, que pasos va a tener que seguir, y que resultado va a obtener.</p>
          <p class="texto-introd">Aclarar que va a tener que llevar los documentos fisicos en un plazo de 30 días y todo eso.</p>
          <b-card class="section-card" v-bind:class="{ 'expanded': isCardExpanded(1) }">
            <h4 class="section-title" @click="toggleCard(1)">
              ¿QUIEN PUEDE INICIAR EL TRAMITE?
              <b-icon-chevron-compact-down v-if="!isCardExpanded(1)"></b-icon-chevron-compact-down>
              <b-icon-chevron-compact-up v-else></b-icon-chevron-compact-up>
            </h4>
            <transition name="expand">
              <ul v-show="isCardExpanded(1)">
                <li><b-icon-person-circle variant="info"></b-icon-person-circle>El interesado futuro comerciante/industrial o afin mayor de 18 años.</li>
                <li><b-icon-person-circle variant="info"></b-icon-person-circle>El apoderado o autorizado del anterior con documentación que acredite el carácter de tal. <b-link class="popup-link" @click="openPopup('A')">(A)</b-link></li>
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
              <ul v-show="isCardExpanded(2)">
                <li><b-icon-check-circle-fill variant="info"></b-icon-check-circle-fill>DNI del solicitante</li>
                <li><b-icon-check-circle-fill variant="info"></b-icon-check-circle-fill>Copia de plano conforme a obra/aprobado o registrado del edificio donde se instalará el negocio que se solicita habilitar. <b-link class="popup-link" @click="openPopup('B')">(B)</b-link></li>
                <li><b-icon-check-circle-fill variant="info"></b-icon-check-circle-fill>Certificados de libre-deuda de las Tasas Municipales del local a habilitar. <b-link class="popup-link" @click="openPopup('LibreDeuda')">(C: ¿Como solicitar el libre deuda?)</b-link></li>
                <li><b-icon-check-circle-fill variant="info"></b-icon-check-circle-fill>Copia de Escritura traslativa de Dominio del inmueble donde se desarrollará la actividad, Contrato de locación, o Boleto de Compraventa con el correspondiente sellado de Ley y firma certificada por Entidad Policial, Entidad Bancaria, Escribano o firmado en presencia de Funcionarios Municipales.</li>
                <li><b-icon-check-circle-fill variant="info"></b-icon-check-circle-fill>Declaración Jurada indicando correo electrónico a fin de recibir notificaciones. <b-link class="popup-link" @click="openPopup('D')">(D)</b-link></li>
                <li><b-icon-check-circle-fill variant="info"></b-icon-check-circle-fill>Domicilio real y legal del establecimiento en el cual deberá constar calle y número respectivo dentro del Partido de Villa Gesell-donde en caso de carecer del primero- podrá notificarse con igual efecto jurídico</li>
                <li><b-icon-check-circle-fill variant="info"></b-icon-check-circle-fill>Certificación de Rubro Permitido <b-link class="popup-link" @click="openPopup('E')">(E)</b-link></li>
                <li><b-icon-check-circle-fill variant="info"></b-icon-check-circle-fill>Constancia de Inscripción de AFIP e IIBB actualizada al momento de la solicitud la que debe mantenerse activa mientras el comercio, industria o asimilable esté habilitado bajo pena de ser pasible de la clausura del establecimiento</li>
                <li><b-icon-check-circle-fill variant="info"></b-icon-check-circle-fill>Planilla de Autorización de Trámite en caso de realizarlo mediante apoderado</li>
              </ul>
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
                  <b-form-select v-model="rubroSeleccionado" :options="filteredRubros" value-field="id" text-field="nombre" @change="handleRubroChange" style="margin:10px 0;"></b-form-select>
                </b-form-group>                
                <p v-if="descripcionSeleccionada">{{ descripcionSeleccionada }}</p>                
                <br v-if="descripcionSeleccionada" />
                <h4 v-if="rubroSeleccionado">Requisitos especiales para el rubro: {{ nombreRubroSeleccionado }}</h4>
                <!--
                <ul v-if="rubroSeleccionado">
                  <li v-for="requisito in filteredRubros.find(rubro => rubro.id === rubroSeleccionado).requisitos" :key="requisito"><b-icon-check-circle-fill variant="info"></b-icon-check-circle-fill> {{ requisito }} </li>
                </ul>
                <br v-if="requisito in filteredRubros.find(rubro => rubro.id === rubroSeleccionado).requisitos" />
                -->
                <h4 v-if="rubroSeleccionado">Zonas permitidas para el rubro: {{ nombreRubroSeleccionado }}</h4>
                <p v-if="rubroSeleccionado">Descarga el Mapa con las zonas permitidas para el rubro {{ nombreRubroSeleccionado }}
                  <nuxt-link :to="`/static/PDFs/${filteredRubros.find(rubro => rubro.id === rubroSeleccionado).pom}.pdf`">AQUI</nuxt-link>
                </p>
                <br v-if="ordenanzasSeleccionadas.length" />
                <h4 v-if="ordenanzasSeleccionadas.length">Ordenanzas relacionadas:</h4>
                <ul v-if="ordenanzasSeleccionadas.length">
                  <li v-for="(ordenanza, index) in ordenanzasSeleccionadas" :key="index">
                    <b-icon-info-circle-fill variant="info"></b-icon-info-circle-fill><a :href="linksSeleccionados[index]"> {{ ordenanza }}</a>
                  </li>
                </ul>
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
                <li><b-icon-question-circle-fill variant="info"></b-icon-question-circle-fill>¿PORQUE TENGO QUE HABILITAR MI LOCAL?</li>
                <p>La municipalidad de Villa Gesell dispone que toda persona humana o jurídica que pretende ejercer el comercio industria o actividad asimilable deberá previo al desarrollo de las mismas dentro del Partido de Villa Gesell solicitar la habilitación pertinente.</p>

                <li><b-icon-question-circle-fill variant="info"></b-icon-question-circle-fill>¿QUÉ PASA SI ABRO UN LOCAL COMERCIAL SIN HABILITACIÓN?</li>
                <p>La omisión de la habilitación determinará la inmediata clausura del establecimiento debiendo abonar la multa establecida para aquellos que cometieran tal infracción. El establecimiento deberá permanecer cerrado hasta tanto regularice su trámite de habilitación.</p>

                <li><b-icon-question-circle-fill variant="info"></b-icon-question-circle-fill>¿COMO SE CALCULA LA TASA DE HABILITACIÓN?</li>
                <p>La tasa de habilitación depende de los siguientes factores: el rubro que se quiere habilitar, la zona donde se encuentra el local, la superficie total afectada a la actividad comercial (sector de atención al público, depósito, espacio de circulación, entrepiso, sanitarios, etc.) y la condición del plano de obra.</p>

                <li><b-icon-question-circle-fill variant="info"></b-icon-question-circle-fill>¿PARA FACILITAR LA BÚSQUEDA DE UN LOCAL: DONDE CONSULTO LA ZONA COMERCIAL APTA PARA HABILITAR Y LOS REQUISITOS EDILICIOS PARA SU INSTALACIÓN Y FUNCIONAMIENTO?</li>
                <p>Enviar mail a: ... informando rubro a habilitar, domicilio real del local (calle y número), localidad del Partido de Villa Gesell y acompañar datos catastrales (sección - manzana - parcela - unidad contributiva).</p>

                <li><b-icon-question-circle-fill variant="info"></b-icon-question-circle-fill>¿LAS HABILITACIONES COMERCIALES DEBEN RENOVARSE?</li>
                <p>Las habilitaciones se extienden por el periodo que abarca el contrato de locación y deben reempadronarse anualmente, según corresponda, teniendo en cuenta la normativa vigente. En el caso de ser propietario del inmueble la habilitación no tienen caducidad si no cambia la titularidad o las condiciones que acreditó al momento de la entrega del certificado de habilitación.</p>

                <li><b-icon-question-circle-fill variant="info"></b-icon-question-circle-fill>¿COMO OBTENGO EL REGISTRO PROVINCIAL PARA LA COMERCIALIZACIÓN DE BEBIDAS ALCOHÓLICAS (REBA)?</li>
                <p>Las actividades que comercializan bebidas alcohólicas deben tramitar el certificado del REBA correspondiente, el mismo tiene un costo según la actividad comercial. Para tramitarlo debe tener su habilitación comercial vigente.</p>
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
                <a href="https://hcdvillagesell.com.ar/3177-21-ordenanza-modificacion-ord-2156/" target="_blank" class="external-link">Ordenanza 2156/08 (TO)</a>
                y el <a href="/ordenanzas" target="_blank" class="external-link">Digesto Comercial Municipal</a> (Creado por el
                <span class="external-link">Decreto 1856/23</span>).
              </p>
            </transition>
          </b-card>
        <b-button variant="" class="float-right" @click="openPopup('Form')">Acceder al formulario</b-button>
        <br />
        </b-col>
      </b-row>
    </b-container>
    
    <!-- Popups -->
    <b-modal v-model="showPopupA" title="Información Adicional (A)" :hide-footer="true" @click-outside="showPopupA = false" centered>
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
    <b-modal v-model="showConfirmationPopup" title="Advertencia!" hide-footer centered>
        <p>Antes de continuar, tené en cuenta lo siguiente:</p>
        <ul>
        <li>El formulario al que estás a punto de acceder no se guarda automáticamente.</li>
        <li>Si no cuentas con toda la información requerida o los documentos digitalizados necesarios, no podrás completar el proceso y deberás comenzar desde cero.</li>
        </ul>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="documentCheckbox" v-model="documentCheckboxChecked"/>
            <label class="form-check-label" for="documentCheckbox">Ya tengo todos los documentos digitalizados y la información requerida</label>
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
      rubroSeleccionado: null,
      nombreRubroSeleccionado: "",      
      descripcionSeleccionada:'',
      ordenanzasSeleccionadas:[],
      linksSeleccionados:[],
      solicitudLibreDeuda: {
        email: '',
        emailState: null,
        partidaMunicipal: '',
        partidaMunicipalState: null,
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
      console.log("this.rubroSeleccionado: ");
      console.log(this.rubroSeleccionado );
      this.nombreRubroSeleccionado = this.filteredRubros.find(rubro => rubro.id === this.rubroSeleccionado).nombre;
      if (this.rubroSeleccionado) {
      // Obtener los datos correspondientes al rubro seleccionado
      const i = this.filteredRubros.findIndex(rubro => rubro.id === this.rubroSeleccionado);
      const descripcion = this.filteredRubros[i].descripcion;
      const ordenanzas = this.filteredRubros[i].ordenanzas;
      const links = this.filteredRubros[i].links;
      console.log("this.filteredRubros[i].descripcion: ");
      console.log(this.filteredRubros[i].descripcion );
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
      console.log("this.descripcionSeleccionada: ");
      console.log(this.descripcionSeleccionada );
    },
    resetForm() {
      // Lógica para resetear el formulario
    },
    submitLibreDeuda() {
      if (!this.solicitudLibreDeuda.partidaMunicipal && !this.hasCatastralData()) {
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
      this.solicitudLibreDeuda.seccion ||
      this.solicitudLibreDeuda.fraccion ||
      this.solicitudLibreDeuda.quinta ||
      this.solicitudLibreDeuda.manzana ||
      this.solicitudLibreDeuda.loteParcela ||
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
.bi-chevron-compact-up, .bi-chevron-compact-down{
  position: absolute;
  right: 20px;
}
.bi-check-circle-fill, .bi-question-circle-fill, .bi-person-circle{
  margin-right: 5px;
}
.FAQs li{
  font-weight: bold;
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