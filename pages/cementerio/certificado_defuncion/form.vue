<template>
<div class="page main-background">
  <Banner title="Cementerio" />

  <b-form @submit.prevent="onSubmitForm" class="my-3" style="margin-left:10px;margin-right:10px">
    <b-card no-body class="col-8 mt-1 section-card"  style="margin: 0px auto 2rem">
      <fieldset>
        <legend><h3>Datos de la funeraria</h3></legend>
      </fieldset>
      <b-row>
        <b-col lg="6">
          <b-form-group label="CUIT *" label-for="fun-cuit">
            <b-form-input id="fun-cuit" v-model="funeraria.cuit" @blur="$v.funeraria.cuit.$touch()"></b-form-input>
            <div v-if="$v.funeraria.cuit.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Introduce un CUIT válido, sin guiones.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Nombre del responsable *" label-for="fun-resp">
            <b-form-input id="fun-resp" v-model="funeraria.responsable" @blur="$v.funeraria.responsable.$touch()"></b-form-input>
            <div v-if="$v.funeraria.responsable.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Campo requerido.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="6">
          <b-form-group label="Teléfono de contacto *" label-for="fun-tel">
            <b-form-input id="fun-tel" v-model="funeraria.telefono" @blur="$v.funeraria.telefono.$touch()"></b-form-input>
            <div v-if="$v.funeraria.telefono.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Debe ser numérico.
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="6">
          <b-form-group label="Correo electrónico *" label-for="fun-mail">
            <b-form-input id="fun-mail" v-model="funeraria.mail" @blur="$v.funeraria.mail.$touch()"></b-form-input>
            <div v-if="$v.funeraria.mail.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Email inválido.
            </div>
          </b-form-group>
          <b-form-group label="Repita el correo electrónico *" label-for="fun-mail2">
            <b-form-input id="fun-mail2" v-model="funeraria.mail2" @blur="$v.funeraria.mail2.$touch()"></b-form-input>
            <div v-if="$v.funeraria.mail2.$error" class="validation-error">
              <b-icon-exclamation-octagon variant="danger"></b-icon-exclamation-octagon> Los correos deben coincidir.
            </div>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>

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
          <b-form-checkbox v-model="exentoPagoTasa">
            Exento del pago de tasa
          </b-form-checkbox>
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
        <b-button size="lg" @click="onCancel" variant="danger" class="btn-cancel">Cancelar</b-button>
        <b-button size="lg" type="submit" variant="success" :disabled="!areAllFieldsComplete">Enviar</b-button>
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
      <p class="modal-subtitle">¡Tu solicitud fue registrada!</p>
      <p class="">Pronto recibirás novedades por correo electrónico.</p>
    </div>
  </b-modal>
</div>
</template>

<script>
import { required, numeric, email, sameAs, maxLength, minLength } from 'vuelidate/lib/validators';

export default{
  validations() {
    return {
      funeraria: {
        cuit: { required, numeric, maxLength: maxLength(12), minLength: minLength(10) },
        responsable: { required },
        telefono: { required, numeric },
        mail: { required, email },
        mail2: { required, email, sameAs: sameAs(function(){ return this.funeraria.mail }) }
      },
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
      maxFileSize: 15 * 1024 * 1024,
      funeraria: { cuit: '', responsable: '', telefono: '', mail: '', mail2: '' },
      obito: { apellido: '', nombre: '', tipoDocumento: '', numeroDocumento: '', fechaDefuncion: '' },
      documentos: { certificadoDefuncion: null, comprobantePagoTasa: null },
      docTouched: { certificadoDefuncion: false, comprobantePagoTasa: false },
      docErrors: { certificadoDefuncion: null, comprobantePagoTasa: null },
      exentoPagoTasa: false,
      showOk: false,
    }
  },
  computed:{
    areAllFieldsComplete(){
      if(this.$v.$invalid) return false;
      if(!this.documentos.certificadoDefuncion || !this.documentos.comprobantePagoTasa) return false;
      if(this.docErrors.certificadoDefuncion || this.docErrors.comprobantePagoTasa) return false;
      return true;
    }
  },
  methods:{
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
      if(!this.documentos[field]){
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
      this.$v.$touch();
      this.touchDoc('certificadoDefuncion');
      this.touchDoc('comprobantePagoTasa');
      if(this.areAllFieldsComplete){
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
            funeraria: {
              cuit: this.funeraria.cuit,
              responsable: this.funeraria.responsable,
              telefono: this.funeraria.telefono,
              mail: this.funeraria.mail,
            },
            obito: {
              apellido: this.obito.apellido,
              nombre: this.obito.nombre,
              tipoDocumento: this.obito.tipoDocumento,
              numeroDocumento: this.obito.numeroDocumento,
              fechaDefuncion: this.obito.fechaDefuncion,
            },
            documentos: documentosParaGuardar,
          };

          await this.$store.dispatch('cementerio/create', { certificado });
          this.showOk = true;
        }catch(e){
          console.error('Error al enviar el formulario de cementerio:', e);
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
h3{ font-weight:bold; color:#0c681a !important; margin:1rem 0; }
.modal h3{ color:white !important; font-weight:bold; font-size:1.5rem; }
.modal .modal-subtitle{ color:#0c681a !important; font-size:1.25rem; font-weight:bold; margin-bottom: 15px; }
.modal-content .bg-success{ background-color:#0c681a !important; }
</style>


