<template>
  <div class="page">
    <div class="container my-3">
      <h4>Asignar certificado a esta obra</h4>
      <b-form class="my-1"
      @submit.stop.prevent="onSubmit"
      @reset.stop.prevent="onResetForm">
            <b-form-group label="Item"  class="my-3" v-for="item in obra.items" :key="item.item">
                <a>{{item.item}}</a>
              <b-form-group label="Contratado">
                <a>{{item.monto}}</a>
              </b-form-group>
              <b-form-group label="Anticipo">
                <a> {{calculameElAnticipoDe(item.monto)}} </a>
              </b-form-group>
              <b-form-group label="Porcentaje de avance">
              <b-form-input v-model="item.avance" placeholder="%" type="number" />
              </b-form-group>
              <b-form-group class="h4" label="Saldo a pagar (avance/contratado - anticipo prop.)">
                <output> {{item.saldo}} </output>
              </b-form-group>
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
      items: [],
    }
  },
  async fetch() {
    // await this.$store.dispatch('ingredients/getIngredients')
    // await this.$store.dispatch('tags/getTags')
  },
  fetchOnServer: false,
  created() {
    this.initializeObra()
    this.initializeCertif()
  },
  methods: {
    calculameElAnticipoDe(monto) {
      const anticipoTotal = this.obra.anticipo_finan
      const cotizacion = this.obra.cotizacion
      return monto*(anticipoTotal/cotizacion)
    },
    async onSubmitCreateCertif() {
      try {
        const userToken = this.$store.state.user.token
        await this.$store.dispatch('certificados/create', {
          userToken,
          certificado: {
            items: this.items,
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
        items: this.props.obra.items,
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
      this.initializeCertif()
      this.$emit('reset')
    },
    initializeCertif() {
      const {
        items = [
          {
            avance: '',
            item: null,
          },
        ],
      } = this.certificado

      this.items = JSON.parse(JSON.stringify(items))
    },
    initializeObra() {
      const {
        expediente = '',
        objeto = '',
        presup_oficial = '',
        adjudicado = '',
        cotizacion = '',
        contrato = '',
        fecha_contrato = null,
        plazo_obra = '',
        proveedor = '',
        adjudicacion = '',
        anticipo_finan = '',
        ordenanza = '',
        decreto = '',
        garantia_contrato = '',
        // tags = [],
        items = [
          {
            item: '',
            monto: null,
          },
        ],
        // instructions = [
        //   {
        //     title: null,
        //     description: null,
        //     image: null,
        //   },
        // ],
      } = this.obra


      this.expediente = expediente
      this.objeto = objeto
      this.adjudicado = adjudicado
      this.presup_oficial = presup_oficial
      this.garantia_contrato = garantia_contrato
      this.proveedor = proveedor
      this.cotizacion = cotizacion
      this.adjudicacion = adjudicacion
      this.contrato = contrato
      this.fecha_contrato = fecha_contrato
      this.ordenanza = ordenanza
      this.decreto = decreto
      this.plazo_obra = plazo_obra
      this.anticipo_finan = anticipo_finan
      // this.tags = JSON.parse(JSON.stringify(tags))
      this.items = JSON.parse(JSON.stringify(items))
      // this.instructions = JSON.parse(JSON.stringify(instructions))
    },
  },
}
</script>

<style type="text/css">
output {
  border: 1px solid black;
  border-radius: 5px;
}

</style>
