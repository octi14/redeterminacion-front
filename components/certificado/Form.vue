<template>
  <div class="page">
    <div class="container my-3">
      <h4>Asignar certificado a esta obra</h4>
      <!-- <p>Agrega una nueva obra con sus características</p> -->
      <b-form class="my-1"
      @submit.stop.prevent="onSubmit"
      @reset.stop.prevent="onResetForm">
            <b-form-group label="Certificación">
              <b-form-input v-model="certificacion" type="text" />
            </b-form-group>
            <b-form-group label="Fecha de Certificación">
              <b-form-input v-model="fecha" type="date" />
            </b-form-group>
            <b-form-group label="OP">
              <b-form-input v-model="op" type="text" />
            </b-form-group>
            <b-form-group label="Factura">
              <b-form-input v-model="factura" type="text" />
            </b-form-group>
            <b-form-group label="Fecha de cancelación">
              <b-form-input v-model="fecha_cancelacion" type="date" />
            </b-form-group>
        <b-button type="submit" variant="success">Crear</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['authenticated'],
  props: {
    obra: {
      type: Object,
      default: () => ({}),
    },
    certificado: {
      type: Object,
      default: () => ({}),
    },
    create: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      certificacion: '',
      fecha: '',
      factura: '',
      op: '',
      fecha_cancelacion: '',
    }
  },
  async fetch() {
    // await this.$store.dispatch('ingredients/getIngredients')
    // await this.$store.dispatch('tags/getTags')
  },
  fetchOnServer: false,
  methods: {
    async onSubmitCreateCertif() {
      try {
        const userToken = this.$store.state.user.token
        await this.$store.dispatch('certificados/create', {
          userToken,
          certificado: {
            obra: this.obra.id,
            certificacion: this.certificacion,
            fecha: this.fecha,
            factura: this.factura,
            op: this.op,
            fecha_cancelacion: this.fecha_cancelacion,
          },
        })
      } catch (e) {
        this.$bvToast.toast('Error Cargando el certificado', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
    onSubmit() {
      const certificado = {
        obra: this.obra.id,
        certificacion: this.certificacion,
        fecha: this.fecha,
        factura: this.factura,
        op: this.op,
        fecha_cancelacion: this.fecha_cancelacion,
      }
      // agrego Id condicionalmente
      if (this.certificado.id) {
        certificado.id = this.certificado.id
      }
      this.$bvToast.toast('Certificación agregada', {
        title: 'Agregada',
        variant: 'success',
        appendToast: true,
        solid: true,
      })
      this.$emit('submit', { certificado })
    },
    onResetForm() {
      this.initialize()
      this.$emit('reset')
    },
  },
}
</script>

<style type="text/css"></style>
