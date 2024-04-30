<template>
    <transition name="flip">
    <b-card id="aaCard" ref="card" class="abierto-anual-card shadow-card" style="max-width: 20rem;">
        <div v-if="estadoActual != 1 && estadoActual != 6" class="btn-group"  >
            <div v-if="estadoActual == 2 || estadoActual == 4 || estadoActual == 7">
                 <b-button @click="aprobarTicket" variant="success" class="btn-approve mr-2"><span>Aprobar</span></b-button>
            </div>
            <div v-if="estadoActual == 3">
                <b-button @click="rectificarTicket" variant="warning" class="btn-rectific mr-2"><span>Rectificar</span></b-button>
            </div>
            <div v-if="estadoActual == 7">
                <b-button @click="rectificarTicket" variant="warning" class="btn-rectific mr-2"><span>Rectificar</span></b-button>
            </div>
            <div v-if="estadoActual == 2 || estadoActual == 3 || estadoActual == 4">
                 <b-button @click="rechazarTicket" variant="danger" class="btn-cancel mr-2"><span>Rechazar</span></b-button>
            </div>
        </div>
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
        </div>
        <div class="periodo-header">
            <b-card-text><h2>Período {{ periodo }}</h2></b-card-text>
            <b-card-text><h3>{{ periodoTexto }}</h3></b-card-text>
        </div>
        <div class="row justify-content-center" v-if="factura">
          <b-button variant="outline-primary" class="col-10" @click="openDocumento(factura)"><b-icon-eye></b-icon-eye></b-button>
        </div>
        <b-card-text v-if="estadoActual == 1" class="periodo-esperando-card">
        <!-- estadoActual == 1 => DESHABILITADO PARA SUBIR PORQUE NO ES EL MOMENTO -->
            <b-row>
                <b-col><b>Todavía no está habilitada la carga de documentación para este período.</b></b-col>
            </b-row>
            <b-row>
                <b-col class="li-row texto-exp"><b>Todavía no está habilitada la carga de documentación para este período.</b></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 2" class="ticket-disabled-card">
        <!-- estadoActual == 2 => DESHABILITADO PARA SUBIR POR OTROS MOTIVOS -->
            <b-row>
                <b-col class="li-row texto-exp"><b>DEFINIR ESTADOS INTERNOS. <br />NO SE CARGÓ NADA EN ESTE PERÍODO.</b></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 3" class="ticket-ok-card">
        <!-- estadoActual == 3 => DESHABILITADO PARA SUBIR POR ARCHIVO CORRECTO -->
            <b-row>
                <b-col class="li-row texto-exp"><b>Aca se podría cargar el ticket en chiquito, y si lo clickean que se agrande o cargue en una nueva pestaña.</b></b-col>
            </b-row>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 4" class="ticket-bad-card">
        <!-- estadoActual == 4 => DESHABILITADO PARA SUBIR POR ARCHIVO RECHAZADO -->
            <b-row>
                <b-col class="li-row texto-exp"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill>Aca podríamos poner la fecha en la que se lo subió y/o la fecha en la que se aprobó o rechazó</div></b-col>
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
            <!--
            <b-row>
                <b-col><div class="li-row"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill> Período Vencido</div></div></b-col>
            </b-row>
            <b-form-file
                disabled="disabled"
                v-model="factura"
                :state="!$v.factura.$error && factura ? true : null"
                placeholder="Selecciona un archivo"
                accept="image/*, .pdf"
                :max-size="5 * 1024 * 1024"
                class="mt-3"
                style="font-size: 16px;"
                browse-text="Examinar"
            ></b-form-file>
            <b-row class="texto-exp">
                <b-col class="li-row"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill> Seguinos en IG como <a href="#" class="icon-green">ARVIGE</a> y enterate cuando se habilitará el plazo de rectificación. </div></b-col>
            </b-row>
            -->
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 6">
        <!-- estadoActual == 6 => HABILITADO PARA SUBIR POR PERIODO CORRECTO -->
        <b-row>
            <b-col><div class="li-row"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill> Cargá aquí una factura emitida durante los meses indicados.</div></div></b-col>
        </b-row>
        <b-form-file
            v-model="factura"
            :state="!$v.factura.$error && factura ? true : null"
            placeholder="Selecciona un archivo"
            accept="image/*, .pdf"
            :max-size="5 * 1024 * 1024"
            class="mt-3"
            style="font-size: 16px;"
            browse-text="Examinar"
        ></b-form-file>
        <div v-if="$v.factura.$error" class="text-danger"><b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe seleccionar un archivo válido.</div>
        </b-card-text>
        <b-card-text v-else-if="estadoActual == 7" class="rectificacion-card">
        <!-- estadoActual == 7 => HABILITADO PARA SUBIR POR RECTIFICACIÓN -->
        <b-row>
            <b-col class="li-row texto-exp"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill>Aca podríamos poner la fecha en la que se lo subió y/o la fecha en la que se aprobó o rechazó</div></b-col>
        </b-row>
        <b-row>
            <b-col class="li-row texto-exp"><div class="li-icon"><b-icon-caret-right-fill class="icon-orange" font-scale="1"></b-icon-caret-right-fill><b>Rectificación:</b> Cargá nuevamente una factura emitida durante los meses indicados.<br />Tenés tiempo hasta el {{ maxDate }}</div></b-col>
        </b-row>
        <b-form-file
            v-model="factura"
            placeholder="Selecciona un archivo"
            :state="!$v.factura.$error && factura ? true : null"
            accept="image/*, .pdf"
            :max-size="5 * 1024 * 1024"
            class="mt-3"
            style="font-size: 16px;"
            browse-text="Examinar"
        ></b-form-file>
        <div v-if="$v.factura.$error" class="text-danger"><b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe seleccionar un archivo válido.</div>
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
        <b-form-group>
            <div id="captchaContainer" class="g-recaptcha" :data-sitekey="recaptchaSiteKey"></div>
            <div v-if="captchaError" class="text-danger">
                <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Por favor completa la verificación para continuar.
            </div>
        </b-form-group>
        <b-button @click="enviarArchivo" variant="success" class="mt-3 float-right"><span v-if="estadoActual == 6 ">Enviar</span><span v-else><b-icon-exclamation-circle></b-icon-exclamation-circle> Rectificar</span></b-button>
    </div>
    </b-card>
    </transition>
</template>

  <script>
  import { requiredIf } from 'vuelidate/lib/validators';
  export default {
    props: {
      periodo: Number,
      estado: Number,
      fecha: String,
      observaciones: String,
      maxDate: String
      // Puedes agregar más props según sea necesario
    },
    data() {
        return {
        factura: null,
        futuroEstado: null,
        estadoActual: this.estado,
        recaptchaSiteKey: "6LfNxggoAAAAANyfZ5a2Lg_Rx28HX_lINDYX7AU-",
        captchaResponse: null,
        captchaError: false,
        };
    },
    computed: {
        periodoTexto() {
            // Lógica para asignar un texto al periodo
            // Por ejemplo, puedes tener un array de textos correspondientes a cada periodo
            const periodosTextos = [
                "Mayo",
                "Julio",
                "Octubre"
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
                case 9: return 'success';
                case 10: return 'invalid';
            }
        },
        // factura(){
        //   if( this.$store.state.facturas.all && this.$store.state.facturas.all.length <= this.periodo){
        //     return this.$store.state.facturas.all[this.periodo-1]
        //   }else{
        //     return null
        //   }

        // }
    },
    validations: {
        factura: {
            requiredIf: requiredIf(function () {
                return this.estadoActual === 6 || this.estadoActual === 7;
            })
        }
    },
    mounted() {

    
    if( this.$store.state.facturas.all && this.$store.state.facturas.all.length <= this.periodo){
        this.factura = this.$store.state.facturas.all[this.periodo-1]
    }else{
        console.log("Mounted no se pudo traer nada para el período " + this.periodo)
        console.log("A pesar de que el store tiene: " + this.$store.state.facturas.all)
    }
    console.log(this.factura)
    // grecaptcha.ready(() => {
    //     grecaptcha.render('captchaContainer', {
    //         sitekey: this.recaptchaSiteKey,
    //         size: 'normal',
    //     });
    // });
    // const contenedor = document.getElementById('aaCard');

    // // Detecta el evento de inicio de la animación
    // contenedor.addEventListener('animationstart', () => {
    // // En el punto deseado de la animación, cambia el estado
    // const nuevoEstado = event.target.dataset.futuroEstado; // Obtiene el nuevo estado desde el atributo data
    // setTimeout(() => {
    //     // Cambia el estado aquí
    //     cambiarEstado(nuevoEstado); // Cambia al estado deseado
    // }, 510); // Espera medio segundo (en milisegundos) para cambiar el estado
    // });

    // // Agrega un evento de transición para detectar el final de la animación
    // contenedor.addEventListener('animationend', () => {
    // // En este punto, la animación ha terminado y puedes realizar más acciones si es necesario
    // });
    },
    methods: {
        isCaptchaOK(){
            console.log("isCAPTCHAOK?? = " + (typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0));
            this.captchaError = !(typeof grecaptcha !== 'undefined' && grecaptcha.getResponse().length > 0);
            if(this.TEST_submit) return true;
            return !this.captchaError;
        },
        enviarArchivo() {
        // Validar que no esté vacío antes de enviarlo
            this.$v.$touch();
            if (!this.$v.factura.$invalid && this.isCaptchaOK()) {
                this.playAnimation(() => {
                    // Simular el envío
                    // Generar un número aleatorio entre 1 y 10
                    const randomState = Math.floor(Math.random() * 2) + 9;
                    console.log("randomState: " + randomState);
                    setTimeout(() => {
                        // Iniciar segunda animación después de cambiar el estado
                        this.playAnimation(() => {


                        },randomState);
                    }, 3000); // Esperar 5 segundos
                },8);
            }
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

            const arrayBuffer = new ArrayBuffer(decodedData.length);
            const arrayBufferView = new Uint8Array(arrayBuffer);

            for (let i = 0; i < decodedData.length; i++) {
                arrayBufferView[i] = decodedData.charCodeAt(i);
            }
            const blob = new Blob([arrayBuffer], { type: documento.contentType });
            const fileURL = URL.createObjectURL(blob);
            console.log('File URL:', fileURL);


            const newWindow = window.open('', '_blank');

            let newWindowTitle = "Documento: " + documento.filename; // Título predeterminado

            if (documento.contentType === 'application/pdf') {
                // Abrir el PDF en una nueva pestaña utilizando <embed>
                const embed = document.createElement('embed');
                embed.setAttribute('type', 'application/pdf');
                embed.setAttribute('src', fileURL);
                embed.setAttribute('width', '100%');
                embed.setAttribute('height', '100%');
                newWindow.document.body.appendChild(embed);
            } else if (documento.contentType.startsWith('image/')) {
                // Abrir la imagen en una nueva pestaña utilizando <img>
                const img = document.createElement('img');
                img.setAttribute('src', fileURL);
                img.setAttribute('width', 'auto');
                img.setAttribute('height', 'auto');
                newWindow.document.body.appendChild(img);
            } else {
                console.log('Formato de contenido no compatible');
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
    },
    aprobarTicket(){
    },
    rechazarTicket(){

    },
    rectificarTicket(){},
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
    min-height: 675px;
    max-width: 25rem !important;
}
#captchaContainer{
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
.btn{
    padding: 0.5rem 3rem;
    font-weight: 500;
    font-size: 1rem;
    padding-right: 0;
    padding-left: 0;
    width: 8rem;
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
    background-color: #a2ff00;
    border-color: #a2ff00;
}
.btn-rectific:hover{
    background-color: rgb(156, 139, 7);
    border-color: rgb(156, 139, 7);
}
.btn-cancel:hover{
    background-color: #f09658;
    border-color: #f09658;
}
.btn-cancel{
    background-color: #e53749;
    border-color: #e53749;
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
