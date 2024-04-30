<template>
    <div>
    <transition name="flip">
    <b-card id="aaCard" ref="card" class="abierto-anual-card" style="max-width: 20rem;">
        <div class="icon-container">
            <b-icon-check-circle-fill v-if="estadoIcono ==='success'" scale="4" variant="success"></b-icon-check-circle-fill>
            <b-icon-arrow-clockwise v-else-if="estadoIcono ==='loading'" scale="5" animation="spin" variant="success"></b-icon-arrow-clockwise>
            <b-icon-x-circle-fill v-else-if="estadoIcono ==='invalid'" scale="5" variant="danger"></b-icon-x-circle-fill>
            <b-icon-arrow-up-circle-fill v-else-if="estadoIcono ==='available'" scale="4" variant="warning"></b-icon-arrow-up-circle-fill>
            <b-iconstack scale="4" v-else-if="estadoIcono ==='disabled'">
                <!-- <b-icon stacked icon="alarm" variant="dark" scale="0.5" shift-v="-1px"></b-icon> -->
                <!-- <b-icon stacked icon="clock-history" variant="dark" scale="0.5" shift-v="-1px"></b-icon> -->
                <b-icon stacked icon="hourglass-split" variant="dark" scale="0.5" shift-v="-1px"></b-icon>
                <b-icon stacked icon="calendar" variant="dark"></b-icon>
            </b-iconstack>
            <b-iconstack scale="4" v-else-if="estadoIcono ==='validating'">
                <!-- <b-icon stacked icon="alarm" variant="dark" scale="0.5" shift-v="-1px"></b-icon> -->
                <!-- <b-icon stacked icon="clock-history" variant="dark" scale="0.5" shift-v="-1px"></b-icon> -->
                <b-icon stacked icon="list-task" variant="success" scale="0.5" shift-v="-1px"></b-icon>
                <b-icon stacked icon="clipboard" variant="success"></b-icon>
                <b-icon stacked icon="search" variant="dark" scale="0.75" shift-v="-2px" animation="cylon" styl></b-icon>
            </b-iconstack>
        </div>
        <div class="periodo-header">
            <b-card-text><h2>Período {{ periodo }}</h2></b-card-text>
            <b-card-text><h3>{{ periodoTexto }}</h3></b-card-text>
        </div>
        <b-card-text v-if="estadoActual == 1" class="periodo-esperando-card">
        <!-- estadoActual == 1 => DESHABILITADO PARA SUBIR PORQUE NO ES EL MOMENTO --> 
            <b-row>
                <b-col class="li-row texto-exp"><b>Todavía no está habilitada la carga de documentación para este período.</b></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 2" class="ticket-disabled-card">
        <!-- estadoActual == 2 => DESHABILITADO PARA SUBIR POR OTROS MOTIVOS -->         
            <b-row>
                <b-col class="li-row texto-exp"><b>GAME OVER <br />TE PORTASTE MAL Y FUISTE CASTIGADO.</b></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 3" class="ticket-ok-card">
        <!-- estadoActual == 3 => DESHABILITADO PARA SUBIR POR ARCHIVO CORRECTO --> 
            <b-row>
                <b-col class="li-row texto-exp"><b>La factura cargada el día {{ fecha }} es correcta.</b></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 4" class="ticket-bad-card">
        <!-- estadoActual == 4 => DESHABILITADO PARA SUBIR POR ARCHIVO RECHAZADO --> 
            <b-row>
                <b-col class="li-row texto-exp"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill>La factura cargada el día {{ fecha }} es <b>incorrecta</b> porque <b>{{ observaciones }}</b></div></b-col>
            </b-row>
            <b-row>
                <b-col class="li-row texto-exp"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill><b>Rectificación:</b> Se habilitará la rectificación del documento el {{ maxDate }}</div></b-col>
            </b-row>
        <!-- Aquí puedes agregar más campos si los necesitas -->
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 5" class="periodo-vencido-card">
        <!-- estadoActual == 5 => DESHABILITADO PARA SUBIR POR FECHA VENCIDA -->         
            <b-row>
                <b-col class="li-row texto-exp"><b>El plazo de carga de documentación para este período ha concluido.</b></b-col>
            </b-row>   
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 6">
            <!-- estadoActual == 6 => HABILITADO PARA SUBIR POR PERIODO CORRECTO -->        
            <b-row>
                <b-col><div class="li-row"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill> Cargá aquí una factura emitida durante los meses indicados.</div></div></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 7" class="rectificacion-card">
        <!-- estadoActual == 7 => HABILITADO PARA SUBIR POR RECTIFICACIÓN -->  
        <b-row>
            <b-col class="li-row texto-exp"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill>La factura cargada el día {{ fecha }} es <b>incorrecta</b> porque <b>{{ observaciones }}</b></div></b-col>
        </b-row>
        <b-row>
            <b-col class="li-row texto-exp"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill><b>Rectificación:</b> Cargá nuevamente una factura emitida durante los meses indicados.<br />Tenés tiempo hasta el {{ maxDate }}</div></b-col>
        </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 8" class="ticket-enviando-card">
            <!-- estadoActual == 8 => ESPERANDO CONFIRMACION DE UPLOAD -->      
            <b-row class="texto-exp">
                <b-col class="li-row"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill> <b>Enviando archivo.</b> </div></b-col>
            </b-row>
            <b-row class="texto-exp">
                <b-col class="li-row"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill> <b>Esto puede tardar unos minutos.</b> </div></b-col>
            </b-row>
            <b-row class="texto-exp">
                <b-col class="li-row"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill> <b>No cierres esta ventana.</b> </div></b-col>
            </b-row>
            <!-- Aquí puedes agregar más campos si los necesitas -->
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 9">
        <!-- estadoActual == 9 => CONFIRMACION DE UPLOAD CORRECTA --> 
            <b-row class="texto-exp">
                <b-col class="li-row"><h2 class="icon-green">Archivo enviado correctamente!</h2></b-col>
            </b-row>
            <b-row class="texto-exp">
                <b-col class="li-row"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill> Nos comunicaremos a traves del DFE declarado para este legajo comercial. </div></b-col>
            </b-row>
            <b-row class="texto-exp">
                <b-col class="li-row"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill> En caso de no tener DFE vas a tener que volver a revisar cada tanto amigo. </div></b-col>
            </b-row>
            <!-- Aquí puedes agregar más campos si los necesitas -->
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 10">
        <!-- estadoActual == 10 => CONFIRMACION DE UPLOAD INCORRECTA: ERROR --> 
            <b-row class="texto-exp">
                <b-col class="li-row"><h2 class="icon-orange">Error enviando el archivo!</h2></b-col>
            </b-row>
            <b-row class="texto-exp">
                <b-col class="li-row"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill> Por favor, revisa tu conexión a internet y volvé a intentarlo en unos minutos. </div></b-col>
            </b-row>
            <b-row class="texto-exp">
                <b-col class="li-row"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill> Si el problema persiste comunicarse con <a href="#" class="icon-green">ARVIGE</a>. </div></b-col>
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
            <h5>
                <b-icon icon="question-circle" scale="1.25" variant="light"></b-icon>
                Completa para continuar
            </h5>
            </div>
            <button type="button" aria-label="Close" class="close" @click="showPopupCaptcha = false">×</button>
        </template>
        <div class="modal-info">
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
  export default {
    props: {
      id:{
        Type: Number,
        required: true,
      },
      periodo: Number,
      estado: Number,
      fecha: String,
      observaciones: String,
      maxDate: String
      // Puedes agregar más props según sea necesario
    },
    data() {
        return {
        archivo: null,
        futuroEstado: null,
        estadoActual: this.estado,
        
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
                "Abril / Mayo",
                "Junio / Julio",
                "Septiembre / Octubre"
            ];

            // Asegúrate de que el periodo esté dentro del rango del array
            if (this.periodo >= 1 && this.periodo <= periodosTextos.length) {
                return periodosTextos[this.periodo - 1];
            } else {
                // Si el periodo está fuera de rango, retorna un mensaje de error o un valor por defecto
                return "Periodo no válido";
            }
        },
        estadoIcono(){
            switch(this.estadoActual){
                case 1: return 'disabled';
                case 2: return 'invalid';
                case 3: return 'success';
                case 4: return 'invalid';
                case 5: return 'invalid';
                case 6: return 'available';
                case 7: return 'available';
                case 8: return 'loading';
                case 9: return 'validating';
                case 10: return 'invalid';
            }        
        },
        tramite(){
          return this.$store.state.abiertoAnual.single.id
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
            this.$v.$touch();
            if (!this.$v.archivo.$invalid && this.isCaptchaOK()) {
                const id = this.tramite;

                let facturaParaGuardar = {};

                // Convertir el archivo a un blob
                if (this.archivo instanceof Blob) {
                const fileBlob = this.archivo;

                // Agregar el archivo a documentosParaGuardar
                facturaParaGuardar = {
                    contenido: {
                    data: await this.blobToBase64(fileBlob),
                    contentType: fileBlob.type,
                    }
                };
                }

                // Iniciar primera animación
                this.playAnimation(async () => {
                try {
                    // Enviar la solicitud al store de Vuex
                    const response = await this.$store.dispatch('facturas/agregar', {
                    id: id,
                    factura: facturaParaGuardar,
                    periodo: this.periodo,
                    });

                    // Manejar la respuesta del backend
                    console.log(response);

                    // Determinar qué animación ejecutar en función de la respuesta
                    let animationState;
                    if (response.estado === 'ok') {
                    animationState = 9; // Archivo enviado correctamente
                    } else {
                    animationState = 10; // Falló el envío del archivo
                    }

                    // Iniciar segunda animación después de cambiar el estado
                    this.playAnimation(() => {}, animationState);
                } catch (error) {
                    // Manejar el error
                    console.error(error);

                    // Iniciar segunda animación después de cambiar el estado
                    this.playAnimation(() => {}, 10); // Falló el envío del archivo
                }
                }, 8);
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
    max-width: 22rem !important;
}
.g-recaptcha{
    margin-top: 2rem;
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
.texto-exp {
    margin-top: 1rem;
    text-align: left;
    font-size: 20px;
}
.rectificacion-card .texto-exp{
    font-size: 16px;
}
.periodo-esperando-card .texto-exp, .ticket-ok-card .texto-exp, .periodo-vencido-card .texto-exp, .ticket-disabled-card .texto-exp{
    font-size: 24px;
    text-align: center;
    margin: 4rem 8% 0;
}
.ticket-enviando-card .texto-exp{
    font-size: 24px;
    text-align: left;
    margin: 2rem auto 1rem;
}
.btn-abajo-container {
    width: 80%;
    position: absolute;
    bottom: 15px;
    left:10%;
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