<template>
    <div>
    <div ref="card" class="abierto-anual-card-shell">
    <transition name="flip" mode="out-in">
    <b-card id="aaCard" :key="estadoActual" class="abierto-anual-card">
        <div class="icon-container">
            <i v-if="estadoIcono === 'habilitado-subir'" class="bi bi-arrow-up-circle-fill text-warning" style="font-size: 4rem"></i>
            <i v-else-if="estadoIcono === 'esperando-periodo'" class="bi bi-clock-history text-warning" style="font-size: 4rem"></i>
            <i v-else-if="estadoIcono === 'loading'" class="bi bi-arrow-clockwise text-success" style="font-size: 5rem"></i>
            <i v-else-if="estadoIcono === 'incorrecto'" class="bi bi-x-circle-fill text-danger" style="font-size: 6rem"></i>
            <i v-else-if="estadoIcono === 'correcto'" class="bi bi-check-circle-fill text-success" style="font-size: 4rem"></i>
            <i v-else-if="estadoIcono === 'revision'" class="bi bi-clipboard2-check text-warning" style="font-size: 4rem"></i>
            
        </div>
        <div class="periodo-header">
            <b-card-text><h2>Período {{ periodo + 1 }}</h2></b-card-text>
            <b-card-text><h3>{{ periodoTexto }}</h3></b-card-text>
        </div>
        <b-card-text v-if="estadoActual == 1" class="periodo-esperando-card">
        <!-- estadoActual == 1 => DESHABILITADO PARA SUBIR PORQUE NO ES EL MOMENTO -->
            <b-row>
                <b-col class="li-row"><p class="texto-exp"><b>Todavía no está habilitada la carga de documentación para este período.</b></p></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 2" class="ticket-revision-card">
        <!-- estadoActual == 2 => DESHABILITADO PARA SUBIR POR OTROS MOTIVOS -->
            <b-row class="envio-ok">
                <b-col><p class="sub-texto-exp">La documentación ha subido con éxito.</p></b-col>
            </b-row>
            <b-row class="importante-box">
                <b-col><p><b>En el curso de la semana ARVIGE verificará que la factura cargada sea correcta.</b></p></b-col>
            </b-row>
            <b-row>
                <b-col>
                    <div class="li-row"><i class="bi bi-exclamation-circle text-dark" style="font-size: 1em"></i><p class="li-content titulo-exp">Si la factura presenta errores</p></div>
                    <div class="li-row"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i><p class="li-content texto-exp">Recibirás una <b>notificación a tu Domicilio Fiscal Electrónico</b> (DFE) indicando fecha y forma de <b>rectificación</b>.</p></div>
                    <div class="li-row" v-if="!DFE"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i><p class="li-content texto-exp"><b>Si aún no tenés DFE, no se te notificará el error</b> y deberás <b>revisar periódicamente la información en esta página</b> (volviendo a introducir los datos del comercio).</p></div>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <div class="li-row"><i class="bi bi-exclamation-circle text-dark" style="font-size: 1em"></i><p class="li-content titulo-exp">Si la factura es correcta</p></div>
                    <div class="li-row"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i><p class="li-content texto-exp">No recibirás notificación de confirmación.</p></div>
                </b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 3" class="ticket-ok-card">
        <!-- estadoActual == 3 => DESHABILITADO PARA SUBIR POR ARCHIVO CORRECTO -->
            <b-row>
                <b-col class="li-row"><p class="texto-exp"><b>La factura cargada el día {{ fecha }} es correcta.</b></p></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 4" class="ticket-bad-card">
        <!-- estadoActual == 4 => DESHABILITADO PARA SUBIR POR ARCHIVO RECHAZADO -->
            <b-row v-if="observaciones && observaciones != ''">
                <b-col><div class="li-row"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i><p class="li-content sub-texto-exp">La <b>carga</b> realizada el día {{ fecha }} es <b>incorrecta</b>, porque <b>{{ observaciones }}</b></p></div></b-col>
            </b-row>
            <b-row>
                <b-col><div class="li-row"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i><p class="li-content sub-texto-exp">Recordá que en el mes de Noviembre podés rectificar las facturas de los períodos indicados como incorrectos.</p></div></b-col>
            </b-row>
            <b-row>
                <b-col><div class="li-row" v-if="!DFE"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i><p class="li-content sub-texto-exp">Si aún no tenés DFE, tramitalo enviando un mail a <a href="mailto:arvige@gesell.gob.ar" class="icon-green">dirarvige@gesell.gob.ar</a>. En caso contrario, no se te notificará el error y deberás revisar periódicamente esta página para obtener dicha información.</p></div></b-col>
            </b-row>
        <!-- Aquí puedes agregar más campos si los necesitas -->
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 5" class="periodo-vencido-card">
        <!-- estadoActual == 5 => DESHABILITADO PARA SUBIR POR FECHA VENCIDA -->
            <b-row>
                <b-col><p class="texto-exp"><b>El plazo de carga de documentación para este período ha concluido.</b></p></b-col>
            </b-row>
            <b-row>
                <b-col><p class="sub-texto-exp">Recordá que en el mes de Noviembre podés rectificar las facturas de los períodos indicados como incorrectos.</p></b-col>
            </b-row>
            <b-row>
                <b-col class="li-row" v-if="!DFE"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i><p class="li-content mini-texto-exp"><b>Si aún no tenés DFE</b>, tramitalo enviando un mail a <a href="mailto:dirarvige@gesell.gob.ar" class="icon-green">dirarvige@gesell.gob.ar</a>. En caso contrario <b>no se te notificará el error</b> y deberás <b>revisar periodicamente la información en esta página</b> (Volviendo a introducir los datos del comercio).</p></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 6" class="upload-card">
            <!-- estadoActual == 6 => HABILITADO PARA SUBIR POR PERIODO CORRECTO -->
            <b-row>
                <b-col><div class="li-row"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i><p class="texto-exp li-content"> Cargá aquí una factura emitida durante <b>el mes de {{ periodoTexto }}</b>.</p></div></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 7" class="rectificacion-card">
        <!-- estadoActual == 7 => HABILITADO PARA SUBIR POR RECTIFICACIÓN -->
            <b-row class="importante-box">
                <b-col><p><b>Rectificación</b></p></b-col>
            </b-row>
            <b-row v-if="tramite.facturas[periodo]">
              <b-col><div class="li-row"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i><p class="li-content sub-texto-exp">La <b>carga</b> realizada el día {{ fecha }} es <b>incorrecta</b>, porque <b>{{ observaciones }}</b></p></div></b-col>
            </b-row>
            <b-row>
                <b-col><div class="li-row"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i><p class="texto-exp li-content"> Cargá aquí una factura emitida durante <b>el mes de {{ periodoTexto }}</b>.</p></div></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 8" class="ticket-enviando-card">
            <!-- estadoActual == 8 => ESPERANDO CONFIRMACION DE UPLOAD -->
            <b-row>
                <b-col>
                    <p class="texto-exp"><b>Tu archivo se está cargando, esto puede demorar unos minutos.</b></p>
                    <p class="sub-texto-exp">Por favor, no cierres esta página.</p>
                </b-col>
            </b-row>
            <!-- Aquí puedes agregar más campos si los necesitas -->
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 9" class="ticket-enviando-fail-card">
        <!-- estadoActual == 9 => CONFIRMACION DE UPLOAD INCORRECTA: ERROR -->
            <b-row>
                <b-col>
                    <p class="texto-exp"><b>¡Error enviando el archivo!</b></p>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <p class="sub-texto-exp"> Por favor, revisa tu conexión a internet y volvé a intentarlo en unos minutos.</p>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <p class="mini-texto-exp"> Si el problema persiste comunicarse con <a href="mailto:dirarvige@gesell.gob.ar" class="icon-green">ARVIGE</a>.</p>
                </b-col>
            </b-row>
        </b-card-text>
        <div v-if="estadoActual == 6 || estadoActual == 7"  >
            <div class="btn-abajo-container">
            <b-form-file
                v-model="archivo"
                placeholder="Selecciona un archivo"
                :state="!$v.archivo.$error && archivo ? true : null"
                accept="image/*, .pdf"
                :max-size="5 * 1024 * 1024"
                class="mt-3"
                style="font-size: 16px;"
                browse-text="Examinar"
            ></b-form-file>
            <div v-if="$v.archivo.$error" class="text-danger"><i class="bi bi-exclamation-octagon text-danger"></i> Debe seleccionar un archivo válido.</div>
            <b-button @click="openCaptchaPopup" variant="success" ><span v-if="estadoActual == 6 ">Enviar</span><span v-else><i class="bi bi-exclamation-circle"></i> Rectificar</span></b-button>
        </div>
    </div>
    </b-card>
    </transition>
    </div>
    <BModal v-model="showPopupCaptcha" @shown="loadRecaptcha" title="Completa para continuar" :no-footer="true" :header-bg-variant="'success'"  centered>
        <template #header>
            <div class="modal-info">
                <i class="bi bi-exclamation-circle text-light"></i>
            </div>
        </template>
        <div class="modal-info">
            <h5>Completá para continuar</h5>
            <b-form-group>
                <div :id="'captchaContainer-' + id" class="g-recaptcha" :data-sitekey="recaptchaSiteKey"></div>
                <div v-if="!captchaCompleted" class="text-danger">
                    <i class="bi bi-exclamation-octagon text-danger"></i> Por favor completa la verificación para continuar.
                </div>
            </b-form-group>
            <b-button @click="enviarArchivo" variant="success" :disabled="!captchaCompleted" class="mt-3 float-right"><span v-if="estadoActual == 6 ">Enviar</span><span v-else><i class="bi bi-exclamation-circle"></i> Rectificar</span></b-button>
        </div>
    </BModal>
    </div>
</template>

  <script>
  import { requiredIf } from '@vuelidate/validators';
  export default {
    props: {
      id:{
        Type: Number,
        required: true,
      },
      periodo: Number,
      estado: String,
      fecha: String,
      observaciones: String,
      hardEstado: Number,
      DFE: Boolean,
      // Puedes agregar más props según sea necesario
    },
    data() {
        return {
        archivo: null,
        estadoActual: null,

        recaptchaSiteKey: "6LfNxggoAAAAANyfZ5a2Lg_Rx28HX_lINDYX7AU-",
        captchaCompleted: false,
        //captchaError: false,

        showPopupCaptcha: false,
        contenedor: null,
        };
    },
    computed: {
        config() {
          return useConfigStore().abiertoAnualPeriodos;
        },
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
                case 6: return 'habilitado-subir';
                case 7: return 'habilitado-subir';
                case 8: return 'loading';
                case 9: return 'incorrecto';
            }
        },
        facturas(){
            return useFacturasStore().all
        },
        tramite(){
            return useAbiertoAnualStore().single
        },
    },
    validations: {
        archivo: {
            requiredIf: requiredIf(function () {
                return this.estadoActual === 6 || this.estadoActual === 7;
            })
        }
    },
    async created() {
        var now
        switch (this.estado) {
            case "Correcto": {
                this.estadoActual = 3;
                break;
            }
            case "Incorrecto":{
                if (this.tramite.facturas[this.periodo] && (this.tramite.facturas[this.periodo].rectificando || this.config.rectificacion)){
                    this.estadoActual = 7;
                    break;
                }
                this.estadoActual = 4;
                break;
            }
            case "Incompleto":{
                await useFechasStore().get()
                now = new Date(useFechasStore().fecha.fecha);
                const maxDateParts = this.config.maxDates[this.periodo].split('/');
                const minDateParts = this.config.minDates[this.periodo].split('/');
                const maxDate = new Date(maxDateParts[2], maxDateParts[1] - 1, maxDateParts[0], 23, 59, 59, 999);
                const minDate = new Date(minDateParts[2], minDateParts[1] - 1, minDateParts[0]);
            if (now > maxDate){
                if(this.config.rectificacion){
                    this.estadoActual = 7;
                    break;
                }
                this.estadoActual = 5;
                break;
            }
            if (now <= maxDate && now <= minDate){
                this.estadoActual = 1;
                break
            }
                this.estadoActual = 6;
                break;
            }
            case "En revisión":{
                this.estadoActual = 2;
                break;
            }
            default:{
                this.estadoActual = 0;
                break;
            }
        }
        this.estadoPrevio = this.estadoActual;
        if (this.hardEstado != null)
            this.estadoActual = this.hardEstado;
    },
    methods: {
        loadRecaptcha() {
            grecaptcha.render('captchaContainer-' + this.id, {
            sitekey: this.recaptchaSiteKey,
            size: 'normal',
            callback: this.onCaptchaCompleted
            });
        },
        openCaptchaPopup(){
            this.$v.$touch();
            if(!this.$v.archivo.$invalid){
                this.showPopupCaptcha = true;
            }
        },
        onCaptchaCompleted() {
            this.captchaCompleted = true;
        },
        isCaptchaOK(){
            console.log("isCaptchaOK: ");
            console.log("this.id: " + this.id);
            //this.captchaError = (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0);
            //console.log("this.captchaError: " + this.captchaError);
            console.log("this.captchaCompleted: " + this.captchaCompleted);
            return this.captchaCompleted;
        },
        blobToBase64(blob) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              resolve(reader.result.split(',')[1]);
            };
            reader.onerror = (error) => reject(error);
          });
        },
        async enviarArchivo() {
            // Validar que el archivo no esté vacío antes de enviarlo
            this.showPopupCaptcha = false;
            this.playAnimation(() => {
                    console.log("playiing animation: ");
            },8);
            this.$v.$touch();
            if (!this.$v.archivo.$invalid && this.isCaptchaOK()) {
                const id = this.tramite.id;

              let facturaParaGuardar = {};

              let fileBlob = null
              // Convertir el archivo a un blob
              if (!this.archivo instanceof Blob) {
                  fileBlob = new Blob([this.archivo], { type: this.archivo.type });
                  // Agregar el archivo
                  facturaParaGuardar = {
                      contenido: {
                          data: await this.blobToBase64(fileBlob),
                          contentType: fileBlob.type,
                      }
                  };
              }

              // Agregar el archivo
              facturaParaGuardar = {
                contenido: {
                    data: await this.blobToBase64(this.archivo),
                    contentType: this.archivo.type,
                }
              }

              // Enviar la solicitud al store de Vuex
              await useFacturasStore().agregar({
                  id: id,
                  factura: facturaParaGuardar,
                  periodo: this.periodo,
              }).then(response => {
                  // Manejar la respuesta del backend

                    this.playAnimation(() => {
                            console.log(response + "playiing animation: 2 ");
                    },2);
                  console.log(response);
              }).catch(error => {
                  // Manejar el error
                    this.playAnimation(() => {
                            console.log("playiing animation: ");
                    },9);
                  console.error(error);
              });
          }
      },
        getCardRootEl() {
            const card = this.$refs.card
            if (!card) return null
            if (card instanceof HTMLElement) return card
            return card.$el ?? null
        },
        playAnimation(callback, newState) {
            const cardEl = this.getCardRootEl()
            const applyState = () => {
                this.estadoActual = newState
                if (typeof callback === 'function') callback()
            }

            if (!cardEl?.classList) {
                applyState()
                return
            }

            cardEl.classList.add('playing-animation')
            setTimeout(() => {
                applyState()
                setTimeout(() => {
                    cardEl.classList.remove('playing-animation')
                }, 1000)
            }, 500)
        }
    }
}

  </script>
<style scoped>
@import "~/assets/css/abierto-anual-card-shared.css";

@media (max-width: 1200px){
    #aaCard .card-body{
        padding-left: 10% !important;
        padding-right: 10% !important;
    }
    .envio-ok {
        text-align: center;
    }
    .ticket-revision-card .importante-box p{
        font-size: 20px;
    }
    .ticket-revision-card .titulo-exp{
        text-decoration: underline;
        font-weight: 600;
        width: 100%;
    }
    .periodo-esperando-card .texto-exp, .ticket-ok-card .texto-exp, .periodo-vencido-card .texto-exp, .ticket-enviando-fail-card .texto-exp{
        text-align: center;
    }
    .rectificacion-card .importante-box b, .ticket-revision-card .importante-box p, .periodo-esperando-card .texto-exp, .ticket-ok-card .texto-exp, .periodo-vencido-card .texto-exp, .ticket-enviando-card .texto-exp, .ticket-enviando-fail-card .texto-exp{
        font-size: 20px !important;
    }
    .ticket-revision-card .titulo-exp, .ticket-enviando-card .sub-texto-exp, .periodo-vencido-card .sub-texto-exp, .ticket-bad-card .sub-texto-exp, .ticket-enviando-fail-card .sub-texto-exp {
        font-size: 15px;
    }
    .periodo-vencido-card .sub-texto-exp, .ticket-enviando-fail-card .sub-texto-exp{
        text-align: center;
    }
    .ticket-enviando-fail-card .mini-texto-exp{
        font-size: 12px;
    }
    .ticket-revision-card .texto-exp, .periodo-vencido-card .mini-texto-exp{
        font-size: 12px;
    }
}
@media (max-width: 720px){
    #aaCard .card-body{
        padding-left: 5% !important;
        padding-right: 5% !important;
    }
}

.envio-ok {
    text-align: center;
}
#aaCard{
    min-height: 725px;
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
.g-recaptcha :first-child{
    margin: auto;
}
.abierto-anual-card p{
    color: #353535;
    font-size: 16px;
}
.text-danger{
    color: red;
    font-size: 10px;
}
.hidden {
  display: none;
}
.btn-success{
    width: 100%;
}
.li-title{
  margin-bottom: 0.3rem;
}
.periodo-esperando-card, .ticket-ok-card, .ticket-enviando-card, .ticket-enviando-fail-card{
    margin-top: 4rem;
}
.rectificacion-card .importante-box p{
    text-align: center;
    margin: auto;
}
.rectificacion-card .importante-box b, .ticket-revision-card .importante-box p{
    background-color: #EAE89B;
    text-align: center;
    font-size: 22px;
    padding: 0.25rem 0.5rem;
}
.ticket-revision-card .importante-box p{
    margin: inherit auto;
    font-size: 20px;
}
.ticket-revision-card .row, .ticket-bad-card .row, .periodo-vencido-card .row, .upload-card .row, .rectificacion-card .row, .ticket-enviando-fail-card .row{
    margin-top: 2rem;
}
.ticket-revision-card .texto-exp, .ticket-revision-card .titulo-exp{
    margin: 0;
}
.ticket-revision-card .titulo-exp{
    text-decoration: underline;
    font-weight: 600;
    width: 100%;
}
.periodo-esperando-card .texto-exp, .ticket-ok-card .texto-exp, .periodo-vencido-card .texto-exp, .ticket-enviando-fail-card .texto-exp{
    text-align: center;
}
.periodo-esperando-card .texto-exp, .ticket-ok-card .texto-exp, .periodo-vencido-card .texto-exp, .ticket-enviando-card .texto-exp, .ticket-enviando-fail-card .texto-exp{
    font-size: 22px;
}
.ticket-revision-card .titulo-exp, .ticket-enviando-card .sub-texto-exp, .periodo-vencido-card .sub-texto-exp, .ticket-bad-card .sub-texto-exp, .ticket-enviando-fail-card .sub-texto-exp {
    font-size: 15px;
}
.periodo-vencido-card .sub-texto-exp, .ticket-enviando-fail-card .sub-texto-exp{
    text-align: center;
}
.ticket-enviando-fail-card .mini-texto-exp{
    font-size: 12px;
    text-align: center;
}
.ticket-revision-card .texto-exp, .periodo-vencido-card .mini-texto-exp{
    font-size: 12px;
    text-align: left;
}
.ticket-enviando-card .row{
    text-align: center;
}
.ticket-enviando-card .sub-texto-exp{
    margin-top: 2rem;
}
.btn-abajo-container, .ticket-enviando-card, .rectificacion-card, .periodo-esperando-card {
    margin-left: 5%;
    margin-right: 5%;
}
.btn-abajo-container button{
    margin-top: 2rem;
}
</style>

