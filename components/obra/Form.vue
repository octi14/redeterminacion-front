<template>
  <div>
    <div class="mx-auto" style="color: black">
      <b-form style="margin-left:10px;margin-right:10px"
        @submit.stop.prevent="onSubmit"
        @reset.stop.prevent="onResetForm"
      >
        <b-form-group id="group-expediente" label="Expediente" label-for="input-expediente">
          <b-form-input id="input-expediente" v-model="expediente" trim type="text" />
        </b-form-group>
        <b-form-group id="group-objeto" label="Objeto" label-for="input-objeto">
          <b-form-textarea v-model="objeto" />
        </b-form-group>
        <b-form-group id="group-adjudicado" label="Adjudicado" label-for="input-adjudicado">
          <b-form-input id="input-adjudicado" v-model="adjudicado" trim type="text" />
        </b-form-group>
        <b-form-group id="group-presup" label="Presupuesto" label-for="input-presup">
          <b-form-textarea v-model="presup_oficial" />
        </b-form-group>
        <b-form-group id="group-cotizacion" label="Cotización" label-for="input-cotizacion">
          <b-form-input id="input-cotizacion" v-model="cotizacion" trim type="text" />
        </b-form-group>
        <b-form-group id="group-proveedor" label="Proveedor" label-for="input-proveedor">
          <b-form-textarea v-model="proveedor" />
        </b-form-group>
        <b-form-group id="group-adjudicacion" label="Adjudicacion" label-for="input-adjudicacion">
          <b-form-input id="input-adjudicacion" v-model="adjudicacion" trim type="text" />
        </b-form-group>
        <b-form-group id="group-contrato" label="Contrato" label-for="input-contrato">
          <b-form-input id="input-contrato" v-model="contrato" trim type="text" />
        </b-form-group>
        <b-form-group id="group-garantia" label="Garantía contrato" label-for="input-garantia">
          <b-form-textarea v-model="garantia_contrato" />
        </b-form-group>
        <b-form-group id="group-fecha" label="Fecha contrato" label-for="input-fecha">
          <b-form-input v-model="fecha_contrato" type="date" />
        </b-form-group>
        <b-form-group id="group-acta" label="Acta de inicio" label-for="input-acta">
          <b-form-input v-model="acta_inicio" type="date" />
        </b-form-group>
        <b-form-group id="group-ordenanza" label="Ordenanza" label-for="input-ordenanza">
          <b-form-input id="input-expediente" v-model="ordenanza" trim type="text" />
        </b-form-group>
        <b-form-group id="group-decreto" label="Decreto" label-for="input-decreto">
          <b-form-textarea v-model="decreto" />
        </b-form-group>
        <b-form-group id="group-plazo" label="Plazo Obra" label-for="input-plazo">
          <b-form-input id="input-plazo" v-model="plazo_obra" trim type="text" />
        </b-form-group>
        <b-form-group id="group-anticipo" label="Anticipo financiero" label-for="input-anticipo">
          <b-form-textarea v-model="anticipo_finan" />
        </b-form-group>
        <h3>Items</h3>
          <b-list-group v-if="items" class="mb-2">
            <b-list-group-item
              v-for="(_, index) in items"
              :key="index"
              class="pr-0"
            >
              <div class="row no-gutters">
                <div class="col">
                  <b-form-text>Item {{ index + 1 }}</b-form-text>
                  <b-form-group label="Nombre:" label-cols-sm="3" label-cols-md="2">
                    <b-form-input v-model="items[index].item" type="text" />
                  </b-form-group>
                  <!-- <b-form-text> Categoría </b-form-text>
                  <b-form-select v-model="items[index].categoria" class="mb-3">
                    <b-form-select-option
                    v-for="categoria in categorias"
                    :key="categoria.id"
                    :value="categoria">{{categoria.nombre}}</b-form-select-option>
                  </b-form-select> -->
                  <b-form-group label="Monto:" label-cols-sm="3" label-cols-md="2">
                    <b-form-input v-model="items[index].monto" type="float" />
                  </b-form-group>
                </div>
                <div class="col-auto mx-4">
                  <b-btn
                    :disabled="items.length <= 1"
                    variant="danger"
                    size="md"
                    title="Eliminar Item"
                    @click="deleteItem(index)"
                  >
                    x
                  </b-btn>
                </div>
              </div>
            </b-list-group-item>
            <b-btn class="col-md-2 col-sm-4 my-2" @click="addItem">Agregar Item</b-btn>
          </b-list-group>
          <hr />
        <!-- <hr /> -->
      <div class="row justify-content-center">
        <b-button class="mx-2" type="submit" variant="success">
          {{ create ? 'Crear' : 'Editar' }} Obra
        </b-button>
        <b-button class="mx-2" type="reset" variant="danger">Cancelar</b-button>
      </div>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    obra: {
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
      expediente: '',
      objeto: '',
      presup_oficial: '',
      adjudicado: '',
      cotizacion: '',
      contrato: '',
      fecha_contrato: null,
      acta_inicio: null,
      items: null,
      plazo_obra: '',
      proveedor: '',
      adjudicacion: '',
      anticipo_finan: '',
      ordenanza: '',
      decreto: '',
      garantia_contrato: '',
      tags: [],
    }
  },
  async fetch() {
  },
  computed: {
  },
  created() {
    this.initialize()
  },
  fetchOnServer: false,
  methods: {
    onSubmit() {
      const obra = {
        expediente: this.expediente,
        objeto: this.objeto,
        presup_oficial: this.presup_oficial,
        proveedor: this.proveedor,
        cotizacion: this.cotizacion,
        adjudicado: this.adjudicado,
        contrato: this.contrato,
        items: this. items,
        fecha_contrato: this.fecha_contrato,
        acta_inicio: this.acta_inicio,
        garantia_contrato: this.garantia_contrato,
        ordenanza: this.ordenanza,
        decreto: this.decreto,
        anticipo_finan: this.anticipo_finan,
        plazo_obra: this.plazo_obra,
        adjudicacion: this.adjudicacion,
      }
      // agrego Id condicionalmente
      if (this.obra.id) {
        obra.id = this.obra.id
      }
      this.$emit('submit', { obra })
    },
    onResetForm() {
      this.initialize()
      this.$emit('reset')
    },
    addItem() {
      this.items.push({
        monto: '',
        item: null,
      })
    },
    deleteItem(index) {
      this.items.splice(index, 1)
    },
    initialize() {
      const {
        expediente = '',
        objeto = '',
        presup_oficial = '',
        adjudicado = '',
        cotizacion = '',
        contrato = '',
        items = [],
        fecha_contrato = null,
        acta_inicio = null,
        plazo_obra = '',
        proveedor = '',
        adjudicacion = '',
        anticipo_finan = '',
        ordenanza = '',
        decreto = '',
        garantia_contrato = '',
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
      this.items = items
      this.fecha_contrato = fecha_contrato
      this.acta_inicio = acta_inicio
      this.ordenanza = ordenanza
      this.decreto = decreto
      this.plazo_obra = plazo_obra
      this.anticipo_finan = anticipo_finan
    },
  },
}
</script>
