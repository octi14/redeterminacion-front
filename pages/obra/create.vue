<template>
  <div class="page">
    <div class="container my-5">
      <h1>Crear nuevo archivo</h1>
      <!-- <p>Agrega una nueva obra con sus características</p> -->
      <b-form class="my-3" @submit.stop.prevent="onSubmitCreateFile">
        <b-form-group>
            <b-form-group label="Expediente">
              <b-form-input v-model="expediente" type="text" />
            </b-form-group>
            <b-form-group label="Objeto">
              <b-form-input v-model="objeto" type="text" />
            </b-form-group>
            <b-form-group label="Presupuesto oficial (en pesos)">
              <b-form-input v-model="presup_oficial" type="float" placeholder="Solo números" />
            </b-form-group>
            <b-form-group label="Adjudicado">
              <b-form-input v-model="adjudicado" type="text" />
            </b-form-group>
            <b-form-group label="Proveedor">
              <b-form-input v-model="proveedor" type="text" />
            </b-form-group>
            <b-form-group label="Cotización">
              <b-form-input v-model="cotizacion" type="float" placeholder="Solo números" />
            </b-form-group>
        </b-form-group>
        <b-form-group label="Garantía Contrato %">
          <b-form-input v-model="garantia_contrato" type="number" placeholder="Solo números" />
        </b-form-group>
        <b-form-group label="Adjudicación">
          <b-form-input v-model="adjudicacion" type="number" placeholder="Solo números"/>
        </b-form-group>
        <b-form-group label="Contrato">
          <b-form-input v-model="contrato" type="text" />
        </b-form-group>
        <b-form-group label="Fecha Contrato">
          <b-form-input v-model="fecha_contrato" type="date" />
        </b-form-group>
        <b-form-group label="Ordenanza">
          <b-form-input v-model="ordenanza" type="text" />
        </b-form-group>
        <b-form-group label="Decreto">
          <b-form-input v-model="decreto" type="text" />
        </b-form-group>
        <b-form-group label="Plazo de obra">
          <b-form-input v-model="plazo_obra" type="text" />
        </b-form-group>
        <b-form-group label="Anticipo Financiero">
          <b-form-input v-model="anticipo_finan" type="float" placeholder="Solo números"/>
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
          </b-list-group>
          <b-btn @click="addItem">Agregar Item</b-btn>
          <hr />
        <b-btn type="submit">Enviar</b-btn>
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['authenticated'],
  data() {
    return {
      expediente: '',
      objeto: '',
      presup_oficial: '',
      adjudicado: '',
      proveedor: '',
      cotizacion: '',
      items: [
        {
          item:null,
          monto:null,
        },
      ],
      garantia_contrato: '',
      adjudicacion: '',
      contrato: '',
      fecha_contrato: null,
      ordenanza: '',
      decreto: '',
      plazo_obra: '',
      anticipo_finan: '',
    }
  },
  async fetch() {
    // await this.$store.dispatch('ingredients/getIngredients')
    // await this.$store.dispatch('tags/getTags')
  },
  fetchOnServer: false,
  methods: {
    async onSubmitCreateFile() {
      try {
        const userToken = this.$store.state.user.token
        await this.$store.dispatch('obras/create', {
          userToken,
          obra: {
            expediente: this.expediente,
            objeto: this.objeto,
            presup_oficial: this.presup_oficial,
            adjudicado: this.adjudicado,
            proveedor: this.proveedor,
            cotizacion: this.cotizacion,
            garantia_contrato: this.garantia_contrato,
            adjudicacion: this.adjudicacion,
            items: this.items,
            contrato: this.contrato,
            fecha_contrato: this.fecha_contrato,
            ordenanza: this.ordenanza,
            decreto: this.decreto,
            plazo_obra: this.plazo_obra,
            anticipo_finan: this.anticipo_finan,
          },
        })
        this.$bvToast.toast('Creada correctamente', {
          title: 'Creada',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        await this.$router.push('/')
      } catch (e) {
        this.$bvToast.toast('Error Cargando la Obra', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
    addItem() {
      this.items.push({
        item: null,
        monto: null,
      })
    },
    deleteItem(index) {
      this.items.splice(index, 1)
    },
  },
}
</script>

<style type="text/css"></style>
