<template>
  <div class="page">
    <div class="mx-auto">
      <div class="container my-3">
        <b-form class="my-1"
        @submit.stop.prevent="onSubmit"
        @reset.stop.prevent="onResetForm">
              <b-form-group label=""  class="my-4" v-for="(_, index) in obra.items" :key="index">
                  <strong> Item {{index +1 }} </strong> <br>
                  <a>{{ obra.items[index].item }}</a>
                <b-form-group class="my-3" label="Contratado">
                  <a>${{ format(obra.items[index].monto) }}</a>
                </b-form-group>
                <b-form-group label="Anticipo">
                  <a>${{format(redondear(anticipoProp(obra.items[index].monto)))}} </a>
                </b-form-group>
                <b-form-group label="Porcentaje de avance (dejar en blanco en caso de no necesitarlo)">
                <b-form-input v-model="avances[index]" placeholder="%" type="float" />
                </b-form-group>
                <output class="h5">Saldo a pagar: ${{format(redondear(saldoItem(obra.items[index].monto, avances[index])))}} </output>
              </b-form-group>
              <!-- <strong class="h5"> Saldo total: ${{format(redondear(saldoAPagar()))}} </strong> <hr/> -->
          <b-button type="submit" variant="success">Crear</b-button>
        </b-form>
    </div>
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
      avances: [],
      items: [
        {
          item: '',
          contratado: '',
          anticipo: '',
          avance: '',
          saldo: '',
        },
      ],
      saldoTotal: 0,
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
  computed: {
  },
  methods: {
    anticipoProp(monto) {
      const anticipoTotal = this.obra.anticipo_finan
      const cotizacion = this.obra.cotizacion
      return monto*(anticipoTotal/cotizacion)
    },
    saldoItem(monto, avance) {
      const realizado = monto * (avance/100)
      const anticipo = this.anticipoProp(monto) * ((avance || 0)/100)
      return (realizado - anticipo)
    },
    async onSubmit() {
      for (var i = 0; i < this.obra.items.length; i++) {
        this.items.push({
          item: this.obra.items[i].item,
          contratado: this.obra.items[i].monto,
          anticipo: this.anticipoProp(this.obra.items[i].monto),
          avance: this.avances[i],
          saldo: this.saldoItem(this.obra.items[i].monto, this.avances[i]),
        })
      }
      const certificado = {
        obra: this.obra.id,
        items: this.items,
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
        items = [],
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
      for (var i = 0; i < this.obra.items.length; i++) {
        this.avances.push(0)
      }
      // this.instructions = JSON.parse(JSON.stringify(instructions))
    },
    redondear(numero) {
      return Number(numero).toFixed(2)
    },
    format(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    saldoAPagar(){
      for (var i = 0; i < this.obra.items.length; i++) {
        this.saldoTotal = this.saldoTotal + this.saldoItem(this.obra.items[i].monto, this.avances[i])
      }
      return this.saldoTotal
    },
  },
}
</script>

<style type="text/css">
output {
  border: 1px solid black;
  border-radius: 5px;
}

.b-form-group {
  margin-bottom: 0%;
}
.strong h5 a{
  margin-bottom: 0%;
}

</style>
