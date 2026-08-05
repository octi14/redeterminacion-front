<template>
  <div>
  <div ref="card" class="abierto-anual-card-shell">
  <transition name="flip" mode="out-in">
  <b-card id="aaCard" :key="estadoActual" class="abierto-anual-card shadow-card">
      <div class="icon-container">
          <i v-if="estadoIcono === 'esperando-periodo'" class="bi bi-clock-history text-warning" style="font-size: 4rem"></i>
          <i v-else-if="estadoIcono === 'incorrecto'" class="bi bi-x-circle-fill text-danger" style="font-size: 5rem"></i>
          <i v-else-if="estadoIcono === 'rectificacion'" class="bi bi-exclamation-circle text-warning" style="font-size: 5rem"></i>
          <i v-else-if="estadoIcono === 'correcto'" class="bi bi-check-circle-fill text-success" style="font-size: 4rem"></i>
          <i v-else-if="estadoIcono === 'loading'" class="bi bi-arrow-clockwise text-success" style="font-size: 5rem"></i>
          <i v-else-if="estadoIcono === 'revision'" class="bi bi-clipboard2-check text-warning" style="font-size: 4rem"></i>
          
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
              <b-col><div class="li-row"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i><p class="texto-exp li-content">La <b>carga</b> realizada el día {{ fecha }} es <b>incorrecta</b>, porque <b>{{ motivo || observacionPeriodo || 'No se seleccionó ningún motivo.' }}</b></p></div></b-col>
          </b-row>
          <b-row>
              <b-col><div class="importante-box">
                  <i class="bi bi-exclamation-triangle text-warning" style="font-size: 1em"></i>
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
                  <i class="bi bi-exclamation-triangle text-warning" style="font-size: 1em"></i>
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
          <b-row v-if="facturaPeriodo">
            <b-col>
              <div class="li-row"><i class="bi bi-caret-right-fill icon-orange li-icon"></i><p style="text-align: justify;" class="texto-exp li-content">Motivo de rechazo: <b>{{ observaciones || observacionPeriodo || 'No se seleccionó ningún motivo.' }}</b></p></div>
            </b-col>
          </b-row>
          <b-row v-else>
            <b-col v-if="estado === 'Rechazado'">
              <div class="li-row"><i class="bi bi-caret-right-fill icon-orange li-icon"></i><p style="text-align: justify;" class="texto-exp li-content">Motivo de rechazo: <b>{{ observacionPeriodo || "No se seleccionó ningún motivo." }}</b></p></div>
            </b-col>
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
              <b-col><p class="texto-exp"><b>Estás a punto de dar una rectificación manual.<br />¿Deseas continuar?</b></p></b-col>
          </b-row>
          <b-row>
              <b-col><div class="importante-box">
                  <i class="bi bi-exclamation-triangle text-warning" style="font-size: 1em"></i>
                  <p class="texto-exp">Opción habilitada para casos excepcionales.</p>
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
              <b-col><div class="li-row"><i class="bi bi-caret-right-fill" style="font-size: 1em"></i><p class="li-content texto-exp"><b>Seleccioná los motivos por los que la carga es incorrecta:</b></p></div></b-col>
          </b-row>
          <b-row>
            <b-col>
            <b-radio-group class="motivos-rechazo-group">
              <b-form-radio
                v-for="(opcion, idx) in motivosRechazoVisibles"
                :id="'motivo-' + (idx + 1) + '-' + id"
                :key="'motivo-' + opcion"
                class="motivo-rechazo-option"
                :name="'radio-motivo-' + id"
                v-model="motivo"
                :value="opcion"
              >
                {{ opcion }}
              </b-form-radio>
              <b-button
                v-if="hayMasMotivosRechazo"
                variant="link"
                class="btn-ver-mas-motivos"
                @click="mostrarTodosMotivos = !mostrarTodosMotivos"
              >
                {{ mostrarTodosMotivos ? 'Ver menos' : 'Ver más' }}
              </b-button>
            </b-radio-group>
            </b-col>
          </b-row>
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
      </b-card-text>
      <b-row v-if="estadoActual == 2 || estadoActual == 3 || estadoActual == 4 || estadoActual == 8">
          <b-col v-if="facturas && facturas[periodo]">
              <b-button class="btn-show-ticket" variant="outline-primary" @click="openDocumento(facturas[periodo])"><i class="bi bi-eye"></i></b-button>
          </b-col>
      </b-row>
      <div class="btn-abajo-container">
          <div class="btn-group card-actions-row">
              <div v-if="estadoActual == 9 || estadoActual == 10 || estadoActual == 11 || estadoActual == 12" class="card-actions-row">
                  <b-button @click="AvanzarPaso" variant="success" class="btn-approve" :disabled="(estadoActual == 11) && (!motivo)" v-if="(estadoActual == 11) && (!motivo)"><span>Aceptar</span></b-button>
                  <b-button @click="AvanzarPaso" variant="success" class="btn-approve" v-else><span>Aceptar</span></b-button>
                  <b-button @click="RetrocederPaso" variant="danger" class="btn-cancel"><span>Cancelar</span></b-button>
              </div>
              <div v-else-if="estadoActual == 2 || estadoActual == 8" class="card-actions-row">
                  <b-button @click="AprobarTicket" variant="success" class="btn-approve"><span>Aprobar</span></b-button>
                  <b-button @click="RechazarTicket" variant="danger" class="btn-cancel"><span>Rechazar</span></b-button>
              </div>
              <div v-else-if="estadoActual == 3 || estadoActual == 4 || estadoActual == 5" class="card-actions-row card-actions-row-center">
                  <i class="bi bi-pencil-square text-dark btn-rectific" role="button" tabindex="0" @click="RectificarTicket"></i>
              </div>
          </div>
      </div>
  </b-card>
  </transition>
  </div>

  <!-- Modal para archivos HEIC -->
  <BModal v-model="showHeicModal" header-bg-variant="warning" title="Archivo no compatible" title-class="text-light" no-footer centered>
    <div class="text-center">
      <i class="bi bi-exclamation-triangle-fill text-warning"></i>
      <h5 class="my-3">Este archivo no pudo ser abierto desde el navegador</h5>
      <p class="mb-4">El formato HEIC no es compatible con tu navegador.<br/> Podés descargar el archivo para visualizarlo en tu dispositivo.</p>
      <b-button @click="downloadHeicFile" variant="success" class="mr-2 btn-download-heic">
        <i class="bi bi-download"></i> Descargar
      </b-button>
      <b-button @click="showHeicModal = false" variant="secondary">
        Cerrar
      </b-button>
    </div>
  </BModal>
  </div>
</template>

<script>
import { requiredIf } from '@vuelidate/validators';
export default {
  setup(){ const { showToast } = useProjectToast(); return { showToast } },
  props: {
    id: {
      type: Number,
      required: true
      },
    periodo: Number,
    estado: String,
    fecha: String,
    observaciones: String,
    hardEstado: Number,
    // Puedes agregar más props según sea necesario
  },
  data() {
      return {
      archivo: null,
      estadoActual: null,
      estadoPrevio: null,
      factura: null,
      motivo: '',
      mostrarTodosMotivos: false,
      maxMotivosIniciales: 5,
      motivosRechazo: [
        'La factura no corresponde al período solicitado.',
        'La factura no corresponde al Legajo y/o CUIT/CUIM.',
        'El documento no es legible o está dañado.',
        'El documento no es una factura.',
        'El contribuyente cambió de categoría tributaria.',
        'La facturación no es compatible con las reglamentaciones de AFIP.',
        'La factura no corresponde a una venta efectivamente efectuada.',
        'La CUIT registra uno o más impuestos con baja de oficio según ARCA.',
        'La facturación no constituye punto de Venta en Villa Gesell.',
      ],
      recaptchaSiteKey: "6LfNxggoAAAAANyfZ5a2Lg_Rx28HX_lINDYX7AU-",
      captchaResponse: null,
      captchaError: false,
      periodoActivo: false,
      showHeicModal: false,
      currentDocumento: null,
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
              case 6: return 'esperando-periodo';
              case 7: return 'esperando-periodo';
              case 8: return 'revision';
              case 9: return 'rectificacion';
              case 10: return 'correcto';
              case 11: return 'incorrecto';
              case 12: return 'incorrecto';
              case 13: return 'loading';
          }
      },
    facturas(){
      return useFacturasStore().all
    },
    tramite(){
      return useAbiertoAnualStore().single
    },
    hayMasMotivosRechazo() {
      return this.motivosRechazo.length > this.maxMotivosIniciales
    },
    motivosRechazoVisibles() {
      if (this.mostrarTodosMotivos) return this.motivosRechazo
      return this.motivosRechazo.slice(0, this.maxMotivosIniciales)
    },
    facturaPeriodo() {
      return Array.isArray(this.tramite?.facturas) ? this.tramite.facturas[this.periodo] : null
    },
    observacionPeriodo() {
      return this.facturaPeriodo?.observaciones || ''
    },
  },
  validations: {
      factura: {
          requiredIf: requiredIf(function () {
              return this.estadoActual === 6 || this.estadoActual === 7;
          })
      }
  },
  /**
   * Hook created(): inicializa la tarjeta del período de Abierto Anual.
   * 1) Calcula estadoActual (1-13) a partir del estado del trámite y las fechas.
   * 2) Guarda estadoPrevio y motivo; si viene hardEstado por prop, fuerza ese estado.
   * (Las facturas/documentos se cargan en Pinia y se leen desde la computed facturas.)
   */
  async created() {
    await this.syncEstadoFromData(true)
  },
  watch: {
    estado() {
      void this.syncEstadoFromData()
    },
    observaciones(newValue) {
      this.motivo = newValue || ''
    },
    facturaPeriodo: {
      handler() {
        void this.syncEstadoFromData()
      },
      deep: true,
    },
    config: {
      handler() {
        void this.syncEstadoFromData()
      },
      deep: true,
    },
  },
  methods: {
      async syncEstadoFromData(force = false) {
        // No pisar estados de confirmación/transición en curso salvo fuerza explícita.
        const transientStates = [9, 10, 11, 12, 13]
        if (!force && transientStates.includes(this.estadoActual)) return

        let nextState = this.estadoActual || 1
        switch (this.estado) {
          case 'Correcto':
            nextState = 3
            break
          case 'Incorrecto':
            nextState = (this.facturaPeriodo && (this.facturaPeriodo.rectificando || this.config?.rectificacion))
              ? 7
              : 4
            break
          case 'Incompleto': {
            await useFechasStore().get()
            const now = new Date(useFechasStore().fecha?.fecha || Date.now())
            const maxDateParts = this.config?.maxDates?.[this.periodo]?.split('/') || []
            const minDateParts = this.config?.minDates?.[this.periodo]?.split('/') || []
            if (maxDateParts.length !== 3 || minDateParts.length !== 3) {
              nextState = 1
              break
            }
            const maxDate = new Date(maxDateParts[2], maxDateParts[1] - 1, maxDateParts[0], 23, 59, 59, 999)
            const minDate = new Date(minDateParts[2], minDateParts[1] - 1, minDateParts[0])
            if (now > maxDate) {
              nextState = this.config?.rectificacion ? 7 : 5
            } else if (now < minDate) {
              nextState = 1
            } else {
              nextState = 6
            }
            break
          }
          case 'En revisión':
            nextState = 2
            break
          default:
            nextState = 1
        }

        this.estadoPrevio = nextState
        this.motivo = this.observaciones || ''
        this.estadoActual = this.hardEstado != null ? this.hardEstado : nextState
      },
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
          if (this.estadoActual == 3 || this.estadoActual == 4 || this.estadoActual == 5){
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
      async AvanzarPaso() {
        var nextCard = null;
        var facturas = JSON.parse(JSON.stringify(this.tramite.facturas)); // Clonar el objeto para no mutar el estado Vuex
        var status = JSON.parse(JSON.stringify(this.tramite.status)); // Clonar el objeto para no mutar el estado Vuex
        switch (this.estadoActual) {
            case 9:
                nextCard = 7;
                status[this.periodo] = "Incorrecto";
                if (facturas[this.periodo]) {
                    facturas[this.periodo] = {
                        ...facturas[this.periodo],
                        rectificando: true,
                    };
                } else {
                    facturas[this.periodo] = { rectificando: true };
                }
                break;
            case 10:
                nextCard = 3;
                status[this.periodo] = "Correcto";
                break;
            case 11:
                nextCard = 12;
                break;
            case 12:
                nextCard = 4;
                status[this.periodo] = "Incorrecto";
                facturas[this.periodo].observaciones = this.motivo;
                console.log(facturas)
                break;
            default:
                nextCard = this.estadoActual;
        }
        const id = this.tramite.id;
        if (this.estadoActual != 11) {
            await useAbiertoAnualStore().update({
                id,
                tramite: {
                    facturas: facturas,
                    status: status,
                }
            }).then(response => {
                this.playAnimation(() => { }, nextCard);
            }).catch(error => {
                this.playAnimation(() => { console.log("13") }, 13);
            });
        }else{
          this.playAnimation(() => { }, nextCard);
        }
        console.log("AvanzarPaso : nextCard -> " + nextCard);
    },

      RetrocederPaso() {
        var nextCard = null;
            if (this.estadoActual == 9 || this.estadoActual == 10 || this.estadoActual == 11){
                nextCard = this.estadoPrevio;
                if(this.estadoActual == 11)
                    this.motivo = null;
                }
            else
            if (this.estadoActual == 12){
                nextCard = 11;
                this.motivo = null;
                }
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

        // Verificar si es un archivo HEIC
        if (documento.contentType === 'image/heic' || documento.contentType === 'image/heif' ||
            (documento.filename && documento.filename.toLowerCase().endsWith('.heic'))) {
            this.showHeicModal = true;
            this.currentDocumento = documento;
            return;
        }

        const decodedData = atob(documento.data); // Decodificar la data de Base64
        const arrayBuffer = new Uint8Array(decodedData.length);

        for (let i = 0; i < decodedData.length; i++) {
            arrayBuffer[i] = decodedData.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: documento.contentType });
        const fileURL = URL.createObjectURL(blob);
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
      },

      downloadHeicFile() {
          if (!this.currentDocumento) {
              console.error('No hay documento HEIC para descargar');
              return;
          }

          try {
              // Decodificar la data de Base64
              const decodedData = atob(this.currentDocumento.data);
              const arrayBuffer = new Uint8Array(decodedData.length);

              for (let i = 0; i < decodedData.length; i++) {
                  arrayBuffer[i] = decodedData.charCodeAt(i);
              }

              // Crear el blob con el tipo MIME correcto para HEIC
              const blob = new Blob([arrayBuffer], {
                  type: this.currentDocumento.contentType || 'image/heic'
              });

              // Crear el enlace de descarga
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = this.currentDocumento.filename || 'archivo.heic';
              a.style.display = 'none';

              // Agregar al DOM, hacer clic y limpiar
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);

              // Liberar la URL del objeto
              URL.revokeObjectURL(a.href);

              // Cerrar el modal
              this.showHeicModal = false;

          } catch (error) {
              console.error('Error al descargar el archivo HEIC:', error);
              this.showToast('Error al descargar el archivo', {
                  variant: 'danger',
                  title: 'Error'
              });
          }
      },
  }
}
</script>
<style scoped>
@import "~/assets/css/abierto-anual-card-shared.css";

.abierto-anual-card-shell {
  max-width: 30rem;
  width: 100%;
}

@media (max-width: 1200px){
  #aaCard .card-body{
      padding-left: 5% !important;
      padding-right: 5% !important;
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
  .rectificacion-card .importante-box b, .ticket-revision-card .importante-box p, .periodo-esperando-card .texto-exp, .ticket-ok-card .texto-exp, .ticket-bad-card .texto-exp, .periodo-vencido-card .texto-exp, .ticket-enviando-card .texto-exp, .ticket-enviando-fail-card .texto-exp{
      font-size: 16px !important;
  }
  .ticket-revision-card .titulo-exp, .ticket-enviando-card .sub-texto-exp, .periodo-vencido-card .sub-texto-exp, .ticket-bad-card .sub-texto-exp, .ticket-enviando-fail-card .sub-texto-exp {
      font-size: 14px !important;
  }
  .comment-pick-card .custom-radio,
  .comment-pick-card :deep(.form-check){
      font-size: 14px !important;
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
  .btn-approve, .btn-cancel{
      width: 45% !important;
  }
}
@media (max-width: 720px){
  #aaCard .card-body{
      padding-left: 5% !important;
      padding-right: 5% !important;
  }
}
#aaCard{
  min-height: 780px;
  max-width: 100% !important;
  width: 100%;
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
.abierto-anual-card p{
  color: #353535;
  font-size: 20px;
}
.text-danger{
  color: red;
  font-size: 12px;
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
.li-title{
margin-bottom: 0.3rem;
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

.comment-pick-card {
  margin-top: 2rem;
  padding: 0 0.75rem 6.5rem;
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
.card-actions-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}
.card-actions-row-center {
  justify-content: center;
}
.card-actions-row .btn {
  flex: 0 1 45%;
  max-width: 8rem;
  margin-top: 0;
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
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 1rem auto;
  text-align: center;
}
.btn-rectific{
  cursor: pointer;
}
.btn-cancel{
  background-color: #e53749;
  border-color: #e53749;
}
.comment-pick-card .custom-radio,
.comment-pick-card :deep(.form-check) {
  width: 100%;
  padding: 0.35rem 0;
  line-height: 1.35;
}

.motivos-rechazo-group {
  width: 100%;
  margin: 1rem 0;
  padding: 0 0.25rem;
}

.motivo-rechazo-option {
  font-size: 14px;
  line-height: 1.35;
  margin-bottom: 0.5rem;
  padding: 0.35rem 0;
}

.motivo-rechazo-option :deep(.form-check-label),
.motivo-rechazo-option .custom-control-label {
  font-size: 14px;
  line-height: 1.35;
  padding-left: 0.5rem;
  text-align: left;
}

.btn-ver-mas-motivos {
  display: block;
  width: fit-content !important;
  margin-top: 0.25rem;
  margin-left: 1.75rem;
  padding: 0 !important;
  font-size: 14px;
  line-height: 1.3;
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  text-decoration: underline;
}

.btn-ver-mas-motivos:focus,
.btn-ver-mas-motivos:active,
.btn-ver-mas-motivos:hover {
  border: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}
</style>

