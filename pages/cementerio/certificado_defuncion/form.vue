<template>
<div class="page main-background">
  <Banner title="Cementerio" />
  <LoadingOverlay :show="procesando" :message="mensajeEspera" />

  <b-form @submit.prevent="onSubmitForm" class="my-3" style="margin-left:10px;margin-right:10px" :class="{ 'form-disabled': procesando }">
    <b-alert show variant="info" class="col-8 mx-auto">
      El ingreso se asociará automáticamente a la funeraria seleccionada y a su período mensual abierto.
    </b-alert>

    <b-card no-body class="col-8 mt-1 section-card"  style="margin: 0px auto 2rem">
      <fieldset>
        <legend><h3>Datos del óbito</h3></legend>
      </fieldset>
      <b-row>
        <b-col lg="6">
          <b-form-group label="Apellido *" label-for="obi-apellido">
            <b-form-input id="obi-apellido" v-model="obito.apellido" @blur="$v.obito.apellido.$touch()"></b-form-input>
            <div v-if="$v.obito.apellido.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Campo requerido.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Nombre *" label-for="obi-nombre">
            <b-form-input id="obi-nombre" v-model="obito.nombre" @blur="$v.obito.nombre.$touch()"></b-form-input>
            <div v-if="$v.obito.nombre.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Campo requerido.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Tipo de sepultura *" label-for="obi-sepultura">
            <b-form-select id="obi-sepultura" v-model="tipoSepultura" :options="tiposSepultura"></b-form-select>
            <small v-if="tipoSepultura" class="text-muted">
              Importe aplicado: {{ moneda(precioAplicado) }}
            </small>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group label="Tipo de documento *" label-for="obi-tipo">
            <b-form-select id="obi-tipo" v-model="obito.tipoDocumento" @change="$v.obito.tipoDocumento.$touch()">
              <option value="" disabled>Selecciona un tipo</option>
              <option>DNI</option>
              <option>Pasaporte</option>
              <option>Otro</option>
            </b-form-select>
            <div v-if="$v.obito.tipoDocumento.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Campo requerido.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Nro de documento *" label-for="obi-num">
            <b-form-input id="obi-num" v-model="obito.numeroDocumento" @blur="$v.obito.numeroDocumento.$touch()"></b-form-input>
            <div v-if="$v.obito.numeroDocumento.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe ser numérico.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group label="Fecha de defunción *" label-for="obi-fecha">
            <b-form-input id="obi-fecha" type="date" v-model="obito.fechaDefuncion" @blur="$v.obito.fechaDefuncion.$touch()"></b-form-input>
            <div v-if="$v.obito.fechaDefuncion.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Campo requerido.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>

    <b-card no-body class="col-8 mt-1 section-card"  style="margin: 0px auto 2rem">
      <fieldset>
        <legend><h3>Documentación</h3></legend>
        <p>Subí archivos legibles en formato imagen o PDF (máx. 15 Mb).</p>
      </fieldset>
      
      <b-row>
        <b-col lg="12" style="margin-bottom: 1rem;">
          <b-form-radio-group v-model="condicionPago" :options="condicionesPago" buttons button-variant="outline-success" />
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group label="Certificado de defunción *" label-for="doc-cert">
            <b-form-file id="doc-cert" v-model="documentos.certificadoDefuncion" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*"
              @change="checkDocumentSize('certificadoDefuncion', $event); touchDoc('certificadoDefuncion')"></b-form-file>
            <div v-if="docErrors.certificadoDefuncion" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ docErrors.certificadoDefuncion }}
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group :label="exentoPagoTasa ? 'Comprobante de exento de pago *' : 'Comprobante de pago de Tasa Derecho de cementerio *'" label-for="doc-pago">
            <b-form-file id="doc-pago" v-model="documentos.comprobantePagoTasa" placeholder="No se seleccionó un archivo." browse-text="Examinar" accept=".pdf, image/*"
              @change="checkDocumentSize('comprobantePagoTasa', $event); touchDoc('comprobantePagoTasa')"></b-form-file>
            <div v-if="docErrors.comprobantePagoTasa" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> {{ docErrors.comprobantePagoTasa }}
            </div>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>

    <div class="centeredContainer">
      <fieldset>
        <b-button size="lg" @click="onCancel" variant="danger" class="btn-cancel" :disabled="procesando">Cancelar</b-button>
        <b-button size="lg" type="submit" variant="success" :disabled="!areAllFieldsComplete || procesando">
          <b-spinner v-if="procesando" small class="mr-2" />
          {{ procesando ? 'Guardando...' : (editId ? 'Guardar cambios' : 'Registrar fallecido') }}
        </b-button>
      </fieldset>
      <div v-if="!areAllFieldsComplete" class="validation-error">
        <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Completar todos los campos marcados con (*).
      </div>
    </div>
  </b-form>

  <b-modal v-model="showOk" title="" ok-only :header-bg-variant="'success'" centered>
    <template #modal-header>
      <div class="centeredContainer"><h3>
        <b-icon icon="check-circle-fill" scale="1.5" variant="light"></b-icon>
      </h3></div>
    </template>
    <div class="centeredContainer">
      <p class="modal-subtitle">{{ editId ? '¡Los cambios fueron guardados!' : '¡El fallecido fue registrado!' }}</p>
      <p>La información ya forma parte del período mensual abierto.</p>
    </div>
  </b-modal>
</div>
</template>

<script>
import { required, numeric } from 'vuelidate/lib/validators';
import { TIPOS_SEPULTURA, CONDICIONES_PAGO } from '~/config/cementerio'
import { formatCurrency } from '~/utils/cementerio'
import LoadingOverlay from '~/components/cementerio/LoadingOverlay.vue'

export default{
  components: { LoadingOverlay },
  middleware: ['authenticated', 'cementerio'],
  validations() {
    return {
      obito: {
        apellido: { required },
        nombre: { required },
        tipoDocumento: { required },
        numeroDocumento: { required, numeric },
        fechaDefuncion: { required }
      }
    }
  },
  data(){
    return{
      editId: null,
      procesando: false,
      mensajeEspera: 'Guardando el fallecido y cargando la documentación...',
      maxFileSize: 15 * 1024 * 1024,
      obito: { apellido: '', nombre: '', tipoDocumento: '', numeroDocumento: '', fechaDefuncion: '' },
      documentos: { certificadoDefuncion: null, comprobantePagoTasa: null },
      documentosExistentes: { certificadoDefuncion: false, comprobantePagoTasa: false },
      docTouched: { certificadoDefuncion: false, comprobantePagoTasa: false },
      docErrors: { certificadoDefuncion: null, comprobantePagoTasa: null },
      condicionPago: CONDICIONES_PAGO.PAGO,
      tipoSepultura: '',
      tiposSepultura: [
        { value: '', text: 'Seleccioná un tipo', disabled: true },
        ...TIPOS_SEPULTURA.map(tipo => ({ value: tipo.value, text: `${tipo.text} - ${formatCurrency(tipo.precio)}` })),
      ],
      condicionesPago: [
        { value: CONDICIONES_PAGO.PAGO, text: 'Pago' },
        { value: CONDICIONES_PAGO.EXENTO, text: 'Exento' },
      ],
      showOk: false,
    }
  },
  computed:{
    areAllFieldsComplete(){
      if(this.$v.$invalid) return false;
      if(!this.tipoSepultura) return false;
      if((!this.documentos.certificadoDefuncion && !this.documentosExistentes.certificadoDefuncion)
        || (!this.documentos.comprobantePagoTasa && !this.documentosExistentes.comprobantePagoTasa)) return false;
      if(this.docErrors.certificadoDefuncion || this.docErrors.comprobantePagoTasa) return false;
      return true;
    },
    precioAplicado() {
      return (TIPOS_SEPULTURA.find(tipo => tipo.value === this.tipoSepultura) || {}).precio || 0
    },
    exentoPagoTasa() {
      return this.condicionPago === CONDICIONES_PAGO.EXENTO
    }
  },
  async fetch() {
    this.editId = this.$route.query.id || null
    if (!this.editId) return
    this.procesando = true
    this.mensajeEspera = 'Cargando los datos del fallecido...'
    try {
      await this.$store.dispatch('cementerio/getSingle', { id: this.editId })
      const item = this.$store.state.cementerio.single
      this.obito = { ...this.obito, ...(item.obito || {}) }
      if (this.obito.fechaDefuncion) this.obito.fechaDefuncion = String(this.obito.fechaDefuncion).slice(0, 10)
      this.tipoSepultura = item.tipoSepultura || ''
      this.condicionPago = item.condicionPago || CONDICIONES_PAGO.PAGO
      const data = await this.$store.dispatch('cementerio/getDocumentos', { id: this.editId })
      this.documentosExistentes.certificadoDefuncion = Boolean(data.certificadoDefuncion)
      this.documentosExistentes.comprobantePagoTasa = Boolean(data.comprobantePagoTasa)
    } catch (error) {
      this.notify(error.message || 'No se pudo cargar el fallecido.', 'danger')
    } finally {
      this.procesando = false
    }
  },
  methods:{
    moneda: formatCurrency,
    notify(message, variant = 'success') {
      this.$bvToast.toast(message, { variant, solid: true, appendToast: true })
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
    onCancel(){
      this.$router.push('/cementerio/certificado_defuncion')
    },
    touchDoc(field){
      this.docTouched[field] = true;
      if(!this.documentos[field] && !this.documentosExistentes[field]){
        this.docErrors[field] = 'Debe seleccionar un archivo.'
      }else{
        this.docErrors[field] = null
      }
    },
    checkDocumentSize(field, event){
      const file = event && event.target && event.target.files ? event.target.files[0] : null;
      if(file && file.size > this.maxFileSize){
        this.docErrors[field] = 'Tu archivo pesa '+ (file.size/1024/1024).toFixed(2) + 'MB, supera el límite (' + (this.maxFileSize/1024/1024) + 'MB).';
      }else{
        this.docErrors[field] = null;
      }
    },
    async onSubmitForm(){
      if (this.procesando) return
      this.$v.$touch();
      this.touchDoc('certificadoDefuncion');
      this.touchDoc('comprobantePagoTasa');
      if(this.areAllFieldsComplete){
        this.procesando = true
        this.mensajeEspera = this.editId
          ? 'Guardando los cambios...'
          : 'Registrando el fallecido y cargando la documentación...'
        try{
          const documentosParaGuardar = {};
          for (const campo in this.documentos) {
            const file = this.documentos[campo];
            if (file instanceof Blob) {
              const fileBlob = new Blob([file], { type: file.type });
              documentosParaGuardar[campo] = {
                nombreDocumento: campo,
                contenido: {
                  data: await this.blobToBase64(fileBlob),
                  contentType: file.type,
                }
              };
            }
          }

          const certificado = {
            funerariaId: this.$route.query.funerariaId || undefined,
            obito: {
              apellido: this.obito.apellido,
              nombre: this.obito.nombre,
              tipoDocumento: this.obito.tipoDocumento,
              numeroDocumento: this.obito.numeroDocumento,
              fechaDefuncion: this.obito.fechaDefuncion,
            },
            tipoSepultura: this.tipoSepultura,
            precioAplicado: this.precioAplicado,
            condicionPago: this.condicionPago,
            estadoRevisionPago: 'PENDIENTE',
            documentos: documentosParaGuardar,
          };

          if (this.editId) {
            await this.$store.dispatch('cementerio/update', { id: this.editId, certificado });
          } else {
            await this.$store.dispatch('cementerio/create', { certificado });
          }
          this.showOk = true;
          this.notify(this.editId ? 'Los cambios fueron guardados.' : 'El fallecido fue registrado.')
        }catch(e){
          this.notify(e.message || 'No se pudo guardar el fallecido. Intentá nuevamente.', 'danger')
        } finally {
          this.procesando = false
        }
      }
    }
  }
}
</script>

<style scoped>
@media (max-width: 1200px) {
  .col-8{
    max-width: 80%;
  }
}
@media (max-width: 480px) {
  .col-8{
    max-width: 90%;
  }
}
.centeredContainer{
  width:  auto;
  margin: auto;
  text-align: center;
}
.validation-error {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
.btn{ background-color:#0c681a; border-color:#0c681a; }
.btn:hover{ background-color:green; border-color:green; }
.btn-cancel{ background-color:#e53749; border-color:#e53749; }
.btn-cancel:hover{ background-color:#f09658; border-color:#f09658; }
.section-card{ box-shadow:0px 2px 5px 0px rgba(0,0,0,0.75); -webkit-box-shadow:0px 2px 5px 0px rgba(0,0,0,0.75); -moz-box-shadow:0px 2px 5px 0px rgba(0,0,0,0.75); }
.form-disabled { pointer-events: none; opacity: 0.8; }
h3{ font-weight:bold; color:#0c681a !important; margin:1rem 0; }
.modal h3{ color:white !important; font-weight:bold; font-size:1.5rem; }
.modal .modal-subtitle{ color:#0c681a !important; font-size:1.25rem; font-weight:bold; margin-bottom: 15px; }
.modal-content .bg-success{ background-color:#0c681a !important; }
</style>
