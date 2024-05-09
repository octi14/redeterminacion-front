<template>
    <transition name="flip">
    <b-card id="aaCard" ref="card" class="abierto-anual-card" style="max-width: 20rem;">
        <div class="icon-container">
            <b-icon-clock-history v-if="estadoIcono ==='esperando-periodo'" scale="4" variant="warning"></b-icon-clock-history>
            <b-icon-x-circle-fill v-else-if="estadoIcono ==='incorrecto'" scale="5" variant="danger"></b-icon-x-circle-fill>
            <b-icon-exclamation-circle v-else-if="estadoIcono ==='rectificacion'" scale="5" variant="warning"></b-icon-exclamation-circle>
            <b-icon-check-circle-fill v-else-if="estadoIcono ==='correcto'" scale="4" variant="success"></b-icon-check-circle-fill>
            <b-icon-arrow-clockwise v-else-if="estadoIcono ==='loading'" scale="5" animation="spin" variant="success"></b-icon-arrow-clockwise>
            <b-iconstack scale="4" v-else-if="estadoIcono ==='revision'">
                <b-icon stacked icon="list-task" variant="warning" scale="0.5" shift-v="-1px"></b-icon>
                <b-icon stacked icon="clipboard" variant="warning"></b-icon>
                <b-iconstack stacked shift-v="-7px" shift-h="7px">
                    <b-icon stacked icon="circle-fill" scale="0.35" shift-h="-1px" shift-v="1px" style="color: white;"></b-icon>
                    <b-icon stacked icon="search" variant="warning" scale="0.5"></b-icon>
                </b-iconstack>
            </b-iconstack>
        </div>
        <div class="periodo-header">
            <b-card-text><h2>Período {{ periodo + 1 }}</h2></b-card-text>
            <b-card-text><h3>{{ periodoTexto }}</h3></b-card-text>
        </div>
        <b-card-text v-if="estadoActual == 1" class="periodo-esperando-card">
        <!-- estadoActual == 1 => DESHABILITADO PARA SUBIR PORQUE NO ES EL MOMENTO -->
            <b-row>
                <b-col><p class="sub-texto-exp">Estado: Incompleto</p></b-col>
            </b-row>
            <b-row>
                <b-col><p class="texto-exp"><b>Todavía no está habilitada la carga de documentación para este período.</b></p></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 2" class="ticket-revision-card">
        <!-- estadoActual == 2 => EN REVISION -->
            <b-row>
                <b-col><p class="sub-texto-exp">Estado: En Revisión</p></b-col>
            </b-row>
            <b-row>
                <b-col><p class="texto-exp"><b>Fecha de Carga:</b> {{ fecha }}</p></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 3" class="ticket-ok-card">
        <!-- estadoActual == 3 => DESHABILITADO PARA SUBIR POR ARCHIVO CORRECTO -->
            <b-row>
                <b-col><p class="sub-texto-exp">Estado: Correcto</p></b-col>
            </b-row>
            <b-row>
                <b-col><p class="texto-exp">La factura cargada el día {{ fecha }} es correcta.</p></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 4" class="ticket-bad-card">
        <!-- estadoActual == 4 => DESHABILITADO PARA SUBIR POR ARCHIVO RECHAZADO -->
            <b-row>
                <b-col><p class="sub-texto-exp">Estado: Incorrecto</p></b-col>
            </b-row>
            <b-row>
                <b-col><div class="li-row"><b-icon-caret-right-fill class="icon-orange li-icon" font-scale="1" shift-v="-3px"></b-icon-caret-right-fill><p class="texto-exp li-content">La <b>carga</b> realizada el día {{ fecha }} es <b>incorrecta</b>, porque <b>{{ motivo }}</b>.</p></div></b-col>
            </b-row>
            <b-row>
                <b-col><div class="importante-box">
                    <b-icon-exclamation-triangle variant="warning" font-scale="1"></b-icon-exclamation-triangle>
                    <p class="texto-exp">Recordá notificar por DFE el período de rectificación.</p>
                </div></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 5" class="periodo-vencido-card">
        <!-- estadoActual == 5 => DESHABILITADO PARA SUBIR POR FECHA VENCIDA -->
            <b-row>
                <b-col><p class="sub-texto-exp">Estado: Incompleto</p></b-col>
            </b-row>
            <b-row>
                <b-col><p class="texto-exp">No se han cargado documentos.</p></b-col>
            </b-row>
            <b-row>
                <b-col><div class="importante-box">
                    <b-icon-exclamation-triangle variant="warning" font-scale="1"></b-icon-exclamation-triangle>
                    <p class="texto-exp">Recordá notificar por DFE el período de rectificación.</p>
                </div></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 6" class="periodo-correcto-card">
        <!-- estadoActual == 6 => HABILITADO PARA SUBIR POR PERIODO CORRECTO -->
            <b-row>
                <b-col><p class="sub-texto-exp">Estado: Incompleto</p></b-col>
            </b-row>
            <b-row>
                <b-col><p class="texto-exp"><b>Aún no se han cargado documentos.</b></p></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 7" class="rectificacion-card">
        <!-- estadoActual == 7 => HABILITADO PARA SUBIR POR RECTIFICACIÓN -->
            <b-row class="importante-box">
                <b-col><p><b>Rectificación</b></p></b-col>
            </b-row>   
            <b-row>
                <b-col><p class="texto-exp"><b>Aún no se han cargado documentos.</b></p></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 8" class="ticket-revision-card">
        <!-- estadoActual == 8 => EN REVISION POR RECTIFICACION -->
            <b-row class="importante-box">
                <b-col><p><b>Rectificación</b></p></b-col>
            </b-row>   
            <b-row>
                <b-col><p class="sub-texto-exp">Estado: En Revisión</p></b-col>
            </b-row>
            <b-row>
                <b-col><p class="texto-exp"><b>Fecha de Carga:</b> {{ fecha }}</p></b-col>
            </b-row>
        </b-card-text>        
        <b-card-text v-else-if="estadoActual == 9" class="action-confirmation-card">
        <!-- estadoActual == 9 => CONFIRMAR RECTIFICACION MANUAL -->
            <b-row>
                <b-col><p class="texto-exp"><b>Estas a punto de dar una rectificación manual.<br />¿Deseas continuar?</b></p></b-col>
            </b-row>
            <b-row>
                <b-col><div class="importante-box">
                    <b-icon-exclamation-triangle variant="warning" font-scale="1"></b-icon-exclamation-triangle>
                    <p class="texto-exp">Opción habilitada para casos excepecionales.</p>
                </div></b-col>
            </b-row>
        </b-card-text>        
        <b-card-text v-else-if="estadoActual == 10" class="action-confirmation-card">
        <!-- estadoActual == 9 => CONFIRMAR APROBACION -->
            <b-row>
                <b-col><p class="texto-exp"><b>Estas por indicar que la factura es correcta.</b></p></b-col>
            </b-row>
            <b-row>
                <b-col><p class="texto-exp"><b>¿Deseas continuar?</b></p></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 11" class="comment-pick-card">
            <!-- estadoActual == 8 => Seleccionar Motivo -->      
            <b-row>
                <b-col><div class="li-row"><b-icon-caret-right-fill class="li-icon icon-orange" font-scale="1" shift-v="-3px"></b-icon-caret-right-fill><p class="li-content texto-exp"><b>Seleccioná los motivos por los que la carga es incorrecta:</b></p></div></b-col>
            </b-row>
            <b-row><b-radio-group>
                <b-form-radio :id="'motivo-1-' + id" :name="'radio-motivo-' + id" v-model="motivo" value="La factura no corresponde al período solicitado."> La factura no corresponde al período solicitado.</b-form-radio>
                <b-form-radio :id="'motivo-2-' + id" :name="'radio-motivo-' + id" v-model="motivo" value="La factura no corresponde al Legajo y/o CUIT/CUIM."> La factura no corresponde al Legajo y/o CUIT/CUIM.</b-form-radio>
                <b-form-radio :id="'motivo-3-' + id" :name="'radio-motivo-' + id" v-model="motivo" value="El documento no es legible."> El documento no es legible.</b-form-radio>
                <b-form-radio :id="'motivo-4-' + id" :name="'radio-motivo-' + id" v-model="motivo" value="El documento no es una factura."> El documento no es una factura.</b-form-radio>
            </b-radio-group></b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 12" class="action-confirmation-card">
        <!-- estadoActual == 9 => CONFIRMACION DE RECHAZO -->
            <b-row>
                <b-col><p class="texto-exp">Estas por indicar que la factura es incorrecta porque <b>{{ motivo }}</b></p></b-col>
            </b-row>
            <b-row>
                <b-col><p class="texto-exp"><b>¿Deseas continuar?</b></p></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 13" class="ticket-enviando-card">
            <!-- estadoActual == 8 => ESPERANDO CONFIRMACION DE UPLOAD -->     
            <b-row>
                <b-col>
                    <p class="texto-exp"><b>Cargando, esto puede demorar unos minutos.</b></p>
                    <p class="sub-texto-exp">Por favor, no cierres esta página.</p>
                </b-col>
            </b-row>
            <!-- Aquí puedes agregar más campos si los necesitas -->
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 14" class="ticket-enviando-fail-card">
        <!-- estadoActual == 9 => CONFIRMACION DE UPLOAD INCORRECTA: ERROR --> 
            <b-row>
                <b-col>
                    <p class="texto-exp"><b>Error conectando con el servidor!</b></p>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <p class="sub-texto-exp"> Por favor, revisa tu conexión a internet y volvé a intentarlo en unos minutos.</p>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <p class="mini-texto-exp"> Si el problema persiste comunicarse con <a href="#" class="icon-green">ARVIGE</a>.</p>
                </b-col>
            </b-row>
        </b-card-text>        
            <b-row v-if="estadoActual == 2 || estadoActual == 3 || estadoActual == 4 || estadoActual == 8">    
                <b-col class="row justify-content-center" v-if="facturas && facturas[periodo]">
                    <b-button class="btn-show-ticket" variant="outline-primary" @click="openDocumento(facturas[periodo])"><b-icon-eye></b-icon-eye></b-button>
                </b-col>
            </b-row>
        <div class="btn-abajo-container">
            <div class="btn-group">
                <div v-if="estadoActual == 9 || estadoActual == 10 || estadoActual == 11 || estadoActual == 12" style="width: 100%;">
                    <b-button @click="AvanzarPaso" variant="success" class="btn-approve float-left"><span>Aceptar</span></b-button>
                    <b-button @click="RetrocederPaso" variant="danger" class="btn-cancel float-right"><span>Cancelar</span></b-button>
                </div>
                <div v-else-if="estadoActual == 2 || estadoActual == 8" style="width: 100%;">
                    <b-button @click="AprobarTicket" variant="success" class="btn-approve float-left"><span>Aprobar</span></b-button>
                    <b-button @click="RechazarTicket" variant="danger" class="btn-cancel float-right"><span>Rechazar</span></b-button>
                </div>
                <div v-else-if="estadoActual == 4 || estadoActual == 5" style="width: 100%;">
                    <b-icon-pencil-square variant="dark" scale="2" @click="RectificarTicket" class="btn-rectific"></b-icon-pencil-square>
                </div>
            </div>
        </div>
    </b-card>
    </transition>
</template>

  <script>
  import { requiredIf } from 'vuelidate/lib/validators';
  export default {
    props: {
      id: {
        type: Number,
        required: true
        },
      periodo: Number,
      estado: String,
      fecha: String,
      observaciones: String,
      // Puedes agregar más props según sea necesario
    },
    data() {
        return {

        archivo: null,
        estadoActual: null,
        estadoPrevio: null,
        factura: null,
        motivo: '',
        recaptchaSiteKey: "6LfNxggoAAAAANyfZ5a2Lg_Rx28HX_lINDYX7AU-",
        captchaResponse: null,
        captchaError: false,
        maxDate: "12/05/2024",
        minDate: "3/05/2024",
        isRectificacion: false,
        periodoActivo: false,
        };
    },
    computed: {
      periodoTexto() {
        // Lógica para asignar un texto al periodo
        // Por ejemplo, puedes tener un array de textos correspondientes a cada periodo
        const periodosTextos = [
          "Mayo",
          "Agosto",
          "Octubre"
        ];
            // Asegúrate de que el periodo esté dentro del rango del array
            if (this.periodo >= 0 && this.periodo <= periodosTextos.length) {
                return periodosTextos[this.periodo];
            } else {
                // Si el periodo está fuera de rango, retorna un mensaje de error o un valor por defecto
                return "Periodo no válido";
            }
        },
        estadoIcono(){              
            switch(this.estadoActual){
                case 1: return 'esperando-periodo';
                case 2: return 'revision';
                case 3: return 'correcto';
                case 4: return 'incorrecto';
                case 5: return 'incorrecto';
                case 6: return 'esperando-periodo';
                case 7: return 'esperando-periodo';
                case 8: return 'revision';
                case 9: return 'rectificacion';
                case 10: return 'correcto';
                case 11: return 'incorrecto';
                case 12: return 'incorrecto';
                case 13: return 'loading';
                case 14: return 'incorrecto';
            }
        },
        facturas(){
            return this.$store.state.facturas.all
      }
    },
    validations: {
        factura: {
            requiredIf: requiredIf(function () {
                return this.estadoActual === 6 || this.estadoActual === 7;
            })
        }
    },
    fetchOnServer: false,
    mounted() {

        const contenedor = document.getElementById('aaCard');
        if( this.$store.state.facturas.all && this.$store.state.facturas.all.length <= this.periodo){
            this.factura = this.$store.state.facturas.all[this.periodo-1]
        }else{
            console.log("Mounted no se pudo traer nada para el período " + this.periodo)
            console.log("A pesar de que el store tiene: " + this.$store.state.facturas.all)
        }
        console.log(this.factura);
        
                    
        //DETERMINAR ESATDO INICIAL    
        console.log("this.estado: " + this.estado);     
        const now = new Date();
        const maxDate = new Date(this.maxDate.split("/").reverse().join("-"));
        const minDate = new Date(this.minDate.split("/").reverse().join("-"));
        console.log("FECHA ACTUAL: " + now);              
        console.log("maxDate: " + maxDate);
        console.log("minDate: " + minDate);  
        console.log("if (now > this.maxDate)" + (now > maxDate));
        console.log("if (now < this.minDate)" + (now < minDate));
        switch(this.estado){
            case "Correcto": {
                    console.log("this.estado Correcto: " + this.estado);   
                    this.estadoActual = 3;
                    break;
                };
            case "Incorrecto": {
                    console.log("this.estado Incorrecto: " + this.estado);   
                    if (this.esRectificacion)
                        this.estadoActual =  7;
                    this.estadoActual =  4;
                    break;
                };
            case "Incompleto": {
                    console.log("this.estado Incompleto: " + this.estado);   
                    if (now > maxDate)
                        this.estadoActual =  5;
                    if (now < minDate)
                        this.estadoActual =  1;
                    this.estadoActual =  6;
                    break;
                };
            case "En revisión":{
                console.log("this.estado revisión: " + this.estado);   
                this.estadoActual =  2;
                break;
            } 
        }
       this.estadoPrevio = this.estadoActual;
       this.motivo = this.observaciones;
    },
    methods: {
        RechazarTicket() {
        // Validar que el archivo no esté vacío antes de enviarlo
            var nextCard = null;
            if (this.estadoActual == 2 || this.estadoActual == 8){
                nextCard = 11;
                this.estadoPrevio = this.estadoActual;
            }
            else 
                nextCard = this.estadoActual;
            console.log("Rechazar Ticket: nextCard -> " + nextCard);
            this.playAnimation(() => {                
                },nextCard);
        },
        RectificarTicket() {
            var nextCard = null;
            if (this.estadoActual == 4 || this.estadoActual == 5){
                nextCard = 9;
                this.estadoPrevio = this.estadoActual;                
            }
            else 
                nextCard = this.estadoActual;
            console.log("Rectificar Ticket: nextCard -> " + nextCard);
            this.playAnimation(() => {                
                },nextCard);
        },
        AprobarTicket() {
            var nextCard = null;
            if (this.estadoActual == 2 || this.estadoActual == 8){
                nextCard = 10;
                this.estadoPrevio = this.estadoActual;
            }
            else 
                nextCard = this.estadoActual;
            console.log("Aprobar Ticket: nextCard -> " + nextCard);
            this.playAnimation(() => {                
                },nextCard);
        },
        AvanzarPaso() {
            var nextCard = null;
            if (this.estadoActual == 9)
                nextCard = 7;
            else 
            if (this.estadoActual == 10)
                nextCard = 3;
            else 
            if (this.estadoActual == 11)
                nextCard = 12;
            else 
            if ( this.estadoActual == 12)
                nextCard = 4;
            else 
                nextCard = this.estadoActual;
            console.log("AvanzarPaso : nextCard -> " + nextCard);
            this.playAnimation(() => {                
                },nextCard);
        },
        RetrocederPaso() {
            var nextCard = null;
            if (this.estadoActual == 9 || this.estadoActual == 10 || this.estadoActual == 11)
                nextCard = this.estadoPrevio;
            else 
            if (this.estadoActual == 12)
                nextCard = 11;
            else 
                nextCard = this.estadoPrevio;
            console.log("RetrocederPaso : nextCard -> " + nextCard);
            this.playAnimation(() => {                
                },nextCard);
        },
        isCaptchaOK(){
            console.log("isCAPTCHAOK?? = " + (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0));
            this.captchaError = !(typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0);
            if(this.TEST_submit) return true;
            return !this.captchaError;
        },
        isValidBase64(str) {
            try {
                return btoa(atob(str)) == str;
            } catch (e) {
                return false;
            }
        },

        openDocumento(documento) {
          if (!this.isValidBase64(documento.data)) {
              console.error('La cadena Base64 no es válida');
              return;
          }

          const decodedData = atob(documento.data); // Decodificar la data de Base64
          // Verificar la decodificación Base64
          console.log('Contenido decodificado:', decodedData);
          const arrayBuffer = new Uint8Array(decodedData.length);

          for (let i = 0; i < decodedData.length; i++) {
              arrayBuffer[i] = decodedData.charCodeAt(i);
          }

          const blob = new Blob([arrayBuffer], { type: documento.contentType });
          // Verificar la creación del Blob
          console.log('Blob creado:', blob);
          const fileURL = URL.createObjectURL(blob);
          // Verificar la creación del objeto URL
          console.log('URL del archivo:', fileURL);
          const newWindow = window.open('', '_blank');

          if (!newWindow) return; // Check if the new window was successfully opened.

          if (documento.contentType === 'application/pdf') {
              newWindow.location.href = fileURL; // Open the PDF in a new tab using href
          } else if (documento.contentType.startsWith('image/')) {
              const img = document.createElement('img');
              img.src = fileURL;
              img.style.width = '100%';
              img.style.height = 'auto';
              newWindow.document.body.appendChild(img);
              newWindow.document.title = documento.filename; // Change the title of the tab
          } else {
              // If the file type is not supported, try downloading the file
              const a = document.createElement('a');
              a.href = fileURL;
              a.download = documento.filename;
              a.style.display = 'none';
              document.body.appendChild(a);
              a.click();
              URL.revokeObjectURL(fileURL);
          }
      },




        playAnimation(callback, newState) {
            // Agregar clase para iniciar la animación
            this.$refs.card.classList.add('playing-animation');
            setTimeout(() => {
                // Cambiar el estado a mitad de la animación
                this.estadoActual = newState;

                // Esperar a que termine la animación
                setTimeout(() => {
                    // Remover la clase para detener la animación
                    this.$refs.card.classList.remove('playing-animation');
                    // Llamar al callback después de la animación
                    if (callback) {
                        callback();
                    }
                }, 1000); // Cambia 1000ms por la duración de tu animación
            }, 500); // Cambia 500ms por la mitad de la duración de tu animación
        }
    }
}
</script>
<style scoped>
h2, h3{
    color: #353535;
    font-size: 28px;
    font-weight: bold;
    text-align: center;
}
h3{
    font-size: 20px;
    font-weight: 500;
    min-height:48px
}
.periodo-header {
    margin: 1rem 15%;
    border-bottom: #353535 1px solid;
}
.periodo-header h3 {
    margin-bottom: 2rem;
}
#aaCard{
    min-height: 775px;
    max-width: 26rem !important;
}
#aaCard .card-body{
    padding: 1rem 3rem;
}
.modal-content div{
    text-align: center;
}
.modal-info{
    width: 100%;
    margin: 0.5rem auto;
}
.modal-info h5{
    color: #353535;
    margin-bottom: 1.5rem;
}
.abierto-anual-card {
  margin-bottom: 20px; /* Espacio entre las tarjetas */
  margin: 0px auto 2rem;
}
.abierto-anual-card p{
    color: #353535;
    font-size: 20px;
}
.text-danger{
    color: red;
    font-size: 12px;
}
.icon-container{
    margin: 3rem auto;
    width: fit-content;
}
.playing-animation {
  animation: play-animation 1s forwards;
}
.hidden {
  display: none;
}
.btn-success{
    width: 100%;
}
.btn-confirmar{
    margin: 2rem auto !important;
    width: 100% !important;
}
.icon-orange{
  color: #E27910;
}
.icon-green{
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
.periodo-esperando-card, .ticket-ok-card, .ticket-enviando-card, .ticket-enviando-fail-card, .ticket-revision-card, .rectificacion-card, .action-confirmation-card{
    margin-top: 4rem;
}
.ticket-bad-card .importante-box, .periodo-vencido-card .importante-box, .action-confirmation-card .importante-box{
    border: 1px solid #EAE89B;
    text-align: center;
    margin-left: 5%;
    margin-right: 5%;
    padding: 1rem 2rem;
}
.rectificacion-card .importante-box p, .ticket-revision-card .importante-box p{
    background-color: #EAE89B;
    text-align: center;
    font-size: 20px;
    padding: 1rem 0.5rem;
}
.ticket-revision-card .importante-box p{
    margin: inherit auto;
    font-size: 20px;
}
.action-confirmation-card .row, .periodo-correcto-card .row, .ticket-revision-card .row, .ticket-bad-card .row, .periodo-vencido-card .row, .upload-card .row, .rectificacion-card .row, .ticket-enviando-fail-card .row, .periodo-esperando-card .row, .ticket-ok-card .row{
    margin-top: 2rem;
}
.ticket-revision-card .texto-exp, .ticket-revision-card .titulo-exp{
    margin: 0 auto;
}
.ticket-revision-card .titulo-exp{
    text-decoration: underline;
    font-weight: 600;
    width: 100%;
}
.action-confirmation-card .texto-exp, .periodo-correcto-card .texto-exp, .rectificacion-card .texto-exp, .periodo-esperando-card .texto-exp, .ticket-ok-card .texto-exp, .periodo-vencido-card .texto-exp, .ticket-enviando-fail-card .texto-exp, .ticket-revision-card .texto-exp{
    text-align: center;
}
.periodo-esperando-card .texto-exp, .ticket-ok-card .texto-exp, .periodo-vencido-card .texto-exp, .ticket-enviando-card .texto-exp, .ticket-enviando-fail-card .texto-exp, .ticket-revision-card .texto-exp{
    font-size: 20px;
}
.ticket-bad-card .texto-exp, .comment-pick-card .texto-exp{
    font-size: 18px;
}
.action-confirmation-card .importante-box .texto-exp, .periodo-vencido-card .importante-box .texto-exp, .ticket-bad-card .importante-box .texto-exp, .comment-pick-card .custom-radio, .periodo-correcto-card .sub-texto-exp, .ticket-revision-card .sub-texto-exp, .ticket-ok-card .sub-texto-exp, .periodo-esperando-card .sub-texto-exp, .ticket-revision-card .titulo-exp, .ticket-enviando-card .sub-texto-exp, .periodo-vencido-card .sub-texto-exp, .ticket-bad-card .sub-texto-exp, .ticket-enviando-fail-card .sub-texto-exp {
    font-size: 15px;
}
.periodo-correcto-card .sub-texto-exp, .periodo-vencido-card .sub-texto-exp, .ticket-enviando-fail-card .sub-texto-exp, .ticket-revision-card .sub-texto-exp, .ticket-bad-card .sub-texto-exp, .periodo-esperando-card .sub-texto-exp, .ticket-ok-card .sub-texto-exp{
    text-align: center;
}
.ticket-enviando-fail-card .mini-texto-exp{
    font-size: 12px;
    text-align: center;
}
.periodo-vencido-card .mini-texto-exp{
    font-size: 12px;
    text-align: left;
}
.ticket-enviando-card .row{
    text-align: center;
}
.ticket-enviando-card .sub-texto-exp{
    margin-top: 2rem;
}
.ticket-enviando-card, .rectificacion-card, .periodo-esperando-card {
    margin-left: 5%;
    margin-right: 5%;
}
.btn-abajo-container{
    width: 80%;
    position: absolute;
    bottom: 15px;
    left: 10%;
}
.btn-abajo-container button{
    margin-top: 2rem;
}
.btn{
    padding: 0.5rem 3rem;
    font-weight: 500;
    font-size: 1rem;
    padding-right: 0;
    padding-left: 0;
    width: 8rem;
}
.btn-show-ticket{
    width: 100%;
    margin-top: 2rem;
}
.btn-group{
    width: 100%;
    margin: 1rem auto;
    text-align: center;
}
.btn-approve{
    background-color: #0c681a;
    border-color: #0c681a;
}
.btn-approve:hover{
    background-color: green;
    border-color: green;
}
.btn-rectific{
    cursor: pointer;
}
.btn-cancel:hover{
    background-color: #f09658;
    border-color: #f09658;
}
.btn-cancel{
    background-color: #e53749;
    border-color: #e53749;
}
.custom-radio{
    width: 100%;
    padding: 0.5rem 20%;
    line-height: 20px;
}
@keyframes play-animation {
    0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(90deg);
    opacity: 0; /* Desaparece el contenido actual */
  }
  51% {
    opacity: 0; /* Se asegura que el contenido anterior esté oculto durante la rotación */
  }
  100% {
    transform: rotateY(0deg);
    opacity: 1; /* Aparece el nuevo contenido */
  }
}
</style>
