<template>
    <div>
    <transition name="flip">
    <b-card id="aaCard" ref="card" class="abierto-anual-card" style="max-width: 20rem;">
        <div class="icon-container">
            <b-icon-arrow-up-circle-fill v-if="estadoIcono ==='habilitado-subir'" scale="4" variant="warning"></b-icon-arrow-up-circle-fill>
            <b-icon-clock-history v-else-if="estadoIcono ==='esperando-periodo'" scale="4" variant="warning"></b-icon-clock-history>
            <b-icon-arrow-clockwise v-else-if="estadoIcono ==='loading'" scale="5" animation="spin" variant="success"></b-icon-arrow-clockwise>
            <b-icon-x-circle-fill v-else-if="estadoIcono ==='incorrecto'" scale="5" variant="danger"></b-icon-x-circle-fill>
            <b-icon-check-circle-fill v-else-if="estadoIcono ==='correcto'" scale="4" variant="success"></b-icon-check-circle-fill>
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
                    <div class="li-row"><b-icon-exclamation-circle variant="dark" font-scale="1" shift-v="-2" class="li-icon"></b-icon-exclamation-circle><p class="li-content titulo-exp">Si la factura presenta errores</p></div>
                    <div class="li-row"><b-icon-caret-right-fill class="icon-orange li-icon" font-scale="1"></b-icon-caret-right-fill><p class="li-content texto-exp">Recibirás una <b>notificación a tu Domicilio Fiscal Electrónico</b> (DFE) indicando fecha y farma de <b>rectificación</b>.</p></div>
                    <div class="li-row"><b-icon-caret-right-fill class="icon-orange li-icon" font-scale="1"></b-icon-caret-right-fill><p class="li-content texto-exp"><b>Si aún no tenés DFE</b>, podés <a href="#" class="icon-green">tramitarlo aquí</a>. En caso contrario, <b>no se te notificará el error</b> y deberás <b>revisar periodicamente la información en esta página</b> (volviendo a introducir los datos del comercio).</p></div>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <div class="li-row"><b-icon-exclamation-circle variant="dark" font-scale="1" shift-v="-2" class="li-icon"></b-icon-exclamation-circle><p class="li-content titulo-exp">Si la factura es correcta</p></div>
                    <div class="li-row"><b-icon-caret-right-fill class="icon-orange li-icon" font-scale="1"></b-icon-caret-right-fill><p class="li-content texto-exp">Si el archivo no presenta errores, no recibirás notificación de confirmación.</p></div>
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
                <b-col><div class="li-row"><b-icon-caret-right-fill class="icon-orange li-icon" font-scale="1" shift-v="-2"></b-icon-caret-right-fill><p class="li-content sub-texto-exp">La <b>carga</b> realizada el día {{ fecha }} es <b>incorrecta</b>, porque <b>{{ observaciones }}.</b></p></div></b-col>
            </b-row>
            <b-row>
                <b-col><div class="li-row"><b-icon-caret-right-fill class="icon-orange li-icon" font-scale="1" shift-v="-2"></b-icon-caret-right-fill><p class="li-content sub-texto-exp">Recibirás una notificación a tu Domicilio Fiscal Electrónico (DFE) indicando fecha y forma de rectificación.</p></div></b-col>
            </b-row>
            <b-row>
                <b-col><div class="li-row"><b-icon-caret-right-fill class="icon-orange li-icon" font-scale="1" shift-v="-2"></b-icon-caret-right-fill><p class="li-content sub-texto-exp">Si aún no tenés DFE, podés <a href="#" class="icon-green">tramitarlo aquí</a>. En caso contrario, se te notificará el error y deberás revisar periódicamente está página para obtener dicha información.</p></div></b-col>
            </b-row>
        <!-- Aquí puedes agregar más campos si los necesitas -->
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 5" class="periodo-vencido-card">
        <!-- estadoActual == 5 => DESHABILITADO PARA SUBIR POR FECHA VENCIDA -->
            <b-row>
                <b-col><p class="texto-exp"><b>El plazo de carga de documentación para este período ha concluido.</b></p></b-col>
            </b-row>
            <b-row>
                <b-col><p class="sub-texto-exp">Recibirás una notificación a tu Domicilio Fiscal Electrónico (DFE) indicando fecha y forma de rectificación.</p></b-col>
            </b-row>
            <b-row>
                <b-col class="li-row"><b-icon-caret-right-fill class="icon-orange li-icon" font-scale="1" shift-v="-3"></b-icon-caret-right-fill><p class="li-content mini-texto-exp"><b>Si aún no tenés DFE</b>, podés <a href="#" class="icon-green">tramitarlo aquí</a>. En caso contrario <b>no se te notificará el error</b> y deberás <b>revisar periodicamente la información en esta página</b> (Volviendo a introducir los datos del comercio).</p></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 6" class="upload-card">
            <!-- estadoActual == 6 => HABILITADO PARA SUBIR POR PERIODO CORRECTO -->
            <b-row>
                <b-col><div class="li-row"><b-icon-caret-right-fill class="icon-orange li-icon" font-scale="1" shift-v="-3"></b-icon-caret-right-fill><p class="texto-exp li-content"> Cargá aquí una factura emitida durante <b>el mes de {{ periodoTexto }}</b>.</p></div></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 7" class="rectificacion-card">
        <!-- estadoActual == 7 => HABILITADO PARA SUBIR POR RECTIFICACIÓN -->
            <b-row class="importante-box">
                <b-col><p><b>Rectificación</b></p></b-col>
            </b-row>
            <b-row>
                <b-col><div class="li-row"><b-icon-caret-right-fill class="icon-orange li-icon" font-scale="1" shift-v="-3"></b-icon-caret-right-fill><p class="texto-exp li-content"> Cargá aquí una factura emitida durante <b>el mes de {{ periodoTexto }}</b>.</p></div></b-col>
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
                    <p class="texto-exp"><b>Error enviando el archivo!</b></p>
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
        <div v-if="estadoActual == 6 || estadoActual == 7"  >
            <div class="btn-abajo-container">
            <div v-if="$v.archivo.$error" class="text-danger"><b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe seleccionar un archivo válido.</div>
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
            <b-button @click="openCaptchaPopup" variant="success" ><span v-if="estadoActual == 6 ">Enviar</span><span v-else><b-icon-exclamation-circle></b-icon-exclamation-circle> Rectificar</span></b-button>
        </div>
    </div>
    </b-card>
    </transition>
    <b-modal v-model="showPopupCaptcha" @shown="loadRecaptcha" title="Completa para continuar" :hide-footer="true" :header-bg-variant="'success'"  centered>
        <template #modal-header>
            <div class="modal-info">
                <b-icon icon="exclamation-circle" scale="2" variant="light"></b-icon>
            </div>
        </template>
        <div class="modal-info">
            <h5>Completá para continuar</h5>
            <b-form-group>
                <div :id="'captchaContainer-' + id" class="g-recaptcha" :data-sitekey="recaptchaSiteKey"></div>
                <div v-if="captchaError" class="text-danger">
                    <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Por favor completa la verificación para continuar.
                </div>
            </b-form-group>
            <b-button @click="enviarArchivo" variant="success" :disabled="!captchaCompleted" class="mt-3 float-right"><span v-if="estadoActual == 6 ">Enviar</span><span v-else><b-icon-exclamation-circle></b-icon-exclamation-circle> Rectificar</span></b-button>
        </div>
    </b-modal>
    </div>
</template>

  <script>
  import { requiredIf } from 'vuelidate/lib/validators';
  import abiertoAnualConfig from '~/plugins/abiertoAnualConfig';
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
      // Puedes agregar más props según sea necesario
    },
    data() {
        return {
        config: abiertoAnualConfig,
        archivo: null,
        futuroEstado: null,

        recaptchaSiteKey: "6LfNxggoAAAAANyfZ5a2Lg_Rx28HX_lINDYX7AU-",
        captchaCompleted: null,
        captchaError: false,

        showPopupCaptcha: false,
        contenedor: null,
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
        estadoActual() {
          const now = new Date();
          console.log("FECHA ACTUAL: " + now.toLocaleDateString("Es-AR"));
          console.log("this.maxDate: " + this.config.maxDates[this.periodo]);
          console.log("this.minDate: " + this.config.minDates[this.periodo]);
          console.log("this.estado: " + this.estado);

          switch (this.estado) {
              case "Correcto":
                  return 3;
              case "Incorrecto":
                  if (this.tramite.facturas[this.periodo] && this.tramite.facturas[this.periodo].rectificando) return 7;
                  return 4;
              case "Incompleto":
                const now = new Date();
                const maxDateParts = this.config.maxDates[this.periodo].split('/');
                const minDateParts = this.config.minDates[this.periodo].split('/');
                const maxDate = new Date(maxDateParts[2], maxDateParts[1] - 1, maxDateParts[0]);
                const minDate = new Date(minDateParts[2], minDateParts[1] - 1, minDateParts[0]);
                if (now > maxDate) return 5;
                if (now <= maxDate && now <= minDate) return 1;
                return 6;
              case "En revisión":
                  return 2;
              default:
                  return 0;
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
            return this.$store.state.facturas.all
        },
        tramite(){
            return this.$store.state.abiertoAnual.single
        },
    },
    validations: {
        archivo: {
            requiredIf: requiredIf(function () {
                return this.estadoActual === 6 || this.estadoActual === 7;
            })
        }
    },
    mounted() {


    this.contenedor = document.getElementById('aaCard');

    // Detecta el evento de inicio de la animación
    this.contenedor.addEventListener('animationstart', () => {
    // En el punto deseado de la animación, cambia el estado
    const nuevoEstado = event.target.dataset.futuroEstado; // Obtiene el nuevo estado desde el atributo data
    setTimeout(() => {
        // Cambia el estado aquí
        cambiarEstado(nuevoEstado); // Cambia al estado deseado
    }, 510); // Espera medio segundo (en milisegundos) para cambiar el estado
    });

    // Agrega un evento de transición para detectar el final de la animación
    this.contenedor.addEventListener('animationend', () => {
    // En este punto, la animación ha terminado y puedes realizar más acciones si es necesario
    });
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
            this.captchaError = (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0);
            console.log("this.captchaError: " + this.captchaError);
            return this.captchaError;
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
              await this.$store.dispatch('facturas/agregar', {
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
.abierto-anual-card {
  margin-bottom: 20px; /* Espacio entre las tarjetas */
  margin: 0px auto 2rem;
}
.abierto-anual-card p{
    color: #353535;
    font-size: 18px;
}
.text-danger{
    color: red;
    font-size: 10px;
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
    padding: 1rem 0.5rem;
}
.ticket-revision-card .importante-box p{
    margin: inherit auto;
    font-size: 20px;
}
.ticket-revision-card .row, .ticket-bad-card .row, .periodo-vencido-card .row, .upload-card .row, .rectificacion-card .row, .ticket-enviando-fail-card .row{
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
