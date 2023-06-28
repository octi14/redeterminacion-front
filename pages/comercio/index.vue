<template>
  <div class="page">
    <Banner title="Habilitaciones comerciales" />
    <b-container>
      <b-row>
        <b-col>
          <h2>NORMAS APLICABLES</h2>
          <p>La habilitación de comercios/industrias o asimilables deberá adecuarse a lo determinado en concordancia con leyes <a href="URL_NACIONALES" target="_blank" class="external-link">nacionales</a>, <a href="URL_PROVINCIALES" target="_blank" class="external-link">provinciales</a> y la <a href="URL_ORDENANZA" target="_blank" class="external-link">Ordenanza 2156/08 (TO)</a> y el <a href="URL_DIGESTO" target="_blank" class="external-link">Digesto Comercial Municipal</a>.</p>
          <h2>QUIEN PUEDE INICIAR EL TRAMITE?</h2>
          <ol>
            <li>El interesado futuro comerciante/industrial o afin mayor de 21 años</li>
            <li>El apoderado del anterior con documentación que acredite el carácter de tal <b-link class="popup-link" @click="openPopup('A')">(A)</b-link></li>
          </ol>
          <h2>REQUISITOS GENERALES DE INICIO DE TRAMITE</h2>
          <ol>
            <li>DNI del solicitante</li>
            <li>Copia de plano conforme a obra/aprobado o registrado del edificio donde se instalará el negocio que se solicita habilitar <b-link class="popup-link" @click="openPopup('B')">(B)</b-link></li>
            <li>Certificados de libre-deuda de las Tasas Municipales del local a habilitar <b-link class="popup-link" @click="openPopup('LibreDeuda')">(C: ¿Como solicitar el libre deuda?)</b-link></li>
            <li>Copia de Escritura traslativa de Dominio del inmueble donde se desarrollará la actividad, Contrato de locación, o Boleto de Compraventa con el correspondiente sellado de Ley y firma certificada por Entidad Policial, Entidad Bancaria, Escribano o firmado en presencia de Funcionarios Municipales</li>
            <li>Declaración Jurada indicando correo electrónico a fin de recibir notificaciones <b-link class="popup-link" @click="openPopup('D')">(D)</b-link></li>
            <li>Domicilio real y legal del establecimiento en el cual deberá constar calle y número respectivo dentro del Partido de Villa Gesell-donde en caso de carecer del primero- podrá notificarse con igual efecto jurídico</li>
            <li>Certificación de Rubro Permitido <b-link class="popup-link" @click="openPopup('E')">(E)</b-link></li>
            <li>Constancia de Inscripción de AFIP e IIBB actualizada al momento de la solicitud la que debe mantenerse activa mientras el comercio, industria o asimilable esté habilitado bajo pena de ser pasible de la clausura del establecimiento</li>
            <li>Planilla de Autorización de Trámite en caso de realizarlo mediante apoderado</li>
          </ol>
          <h2>REQUISITOS ESPECIALES POR RUBRO</h2>
          <p>Selecciona el rubro para consultar sus requisitos específicos. Si no encontrás el rubro que querés consultar, es porque no tiene ningún requisito especial.</p>
          <p>(También podríamos poner el mapa del GIS?)</p>          
          <b-form-select v-model="rubroSeleccionado" :options="filteredRubros" value-field="id" text-field="nombre" @change="handleRubroChange"  style="margin:10px 0;"></b-form-select>
          <ul v-if="rubroSeleccionado">
            <li v-for="requisito in filteredRubros.find(rubro => rubro.id === this.rubroSeleccionado).requisitos" :key="requisito">{{ requisito }}</li>
          </ul>

        <b-button class="float-right" @click="openPopup('Form')">Acceder al formulario</b-button>

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
      filteredRubros: rubros.filter(rubro => rubro.requisitos.length > 0),
      showPopupA: false,
      showPopupB: false,
      showPopupC: false,
      showPopupD: false,
      showPopupE: false,
      showConfirmationPopup: false,
      showLibreDeudaPopup: false,
      documentCheckboxChecked: false,
      rubroSeleccionado: null,
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
      }
    };
  },
  mounted() {
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
      }
    },
    proceedToForm() {
      // Aquí puedes realizar alguna acción adicional si es necesario antes de redirigir al formulario
      this.showConfirmationPopup = false;
    },
    handleRubroChange() {
      //console.log("this.rubroSeleccionado: ");
      //console.log(this.filteredRubros.find(rubro => rubro.id === this.rubroSeleccionado).requisitos );
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
      this.showLibreDeudaPopup = false;
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
  }
  }
}
</script>
<style scoped>
.external-link {
  color: #007bff;
  font-weight: bold;
}

.popup-link {
  color: #dc3545;
  font-weight: bold;
}

.disabled {
  pointer-events: none;
}

.datosCatastralesContainer *{
  text-align: center;
}
</style>