<template>
  <div class="page main-background mt-2">
    <Banner title="Crear nueva obra" />
    <div class="container my-4">
      <!-- <p>Agrega una nueva obra con sus características</p> -->
      <b-form class="card shadow-card my-4 col-md-9 mx-auto" @submit.stop.prevent="onSubmitCreateFile">
        <b-form-group class="mt-3">
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
          <b-form-input v-model="adjudicacion" type="text"/>
        </b-form-group>
        <b-form-group label="Contrato">
          <b-form-input v-model="contrato" type="text" />
        </b-form-group>
        <b-form-group label="Fecha Contrato">
          <b-form-input v-model="fecha_contrato" type="date" />
        </b-form-group>
        <b-form-group label="Acta de inicio">
          <b-form-input v-model="acta_inicio" type="date" />
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
          <b-list-group v-if="items">
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
            <b-btn class="col-md-3 my-2" @click="addItem">Agregar Item</b-btn>
          <hr />
          </b-list-group>

          <div class="row no-gutters">
            <h5 class="col col-main"> Es aplicable a UVI? </h5>
            <b-checkbox size="lg" class= "col col-complementary" v-model="uvis"> </b-checkbox>
          </div>
          <h3 v-if="!uvis">Ponderación</h3>
            <b-list-group v-if="!uvis">
              <b-list-group-item
                v-for="(_, index) in ponderacion"
                :key="index"
                class="pr-12"
              >
                <div class="row">
                  <div class="col">
                    <strong>{{ponderacion[index].categoria.nombre}}</strong>
                    <b-form-text class="h6"> Porcentaje</b-form-text>
                    <b-form-input class="col-md-4" placeholder="%" v-model="ponderacion[index].porcentaje" type="number" />
                  </div>
                </div>
              </b-list-group-item>
            </b-list-group>

          <hr />
        <div class="row-5 my-3 mx-auto">
          <b-btn type="submit" class="mx-auto" variant="success">Enviar</b-btn>
          <b-btn @click="onReturn" class="mx-auto" variant="danger">Cancelar</b-btn>
        </div>
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
      acta_inicio: null,
      ordenanza: '',
      decreto: '',
      plazo_obra: '',
      anticipo_finan: '',
      ponderacion: [],
      categorias: [],
      uvis: false,
    }
  },
  async fetch() {
    await this.$store.dispatch('categorias/getAll')
    this.categorias = this.$store.state.categorias.all
    for (var i = 0; i < this.categorias.length; i++) {
      this.ponderacion.push({
        categoria: this.categorias[i],
        porcentaje: null,
      })
    }
  },
  fetchOnServer: false,
  methods: {
    async onSubmitCreateFile() {
    for (var i = 0; i < this.ponderacion.length; i++) {
      const id = this.ponderacion[i].categoria.id
      this.ponderacion[i].categoria = id
    }
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
          acta_inicio: this.acta_inicio,
          ordenanza: this.ordenanza,
          decreto: this.decreto,
          plazo_obra: this.plazo_obra,
          anticipo_finan: this.anticipo_finan,
          ponderacion: this.ponderacion,
        },
      })
      this.$bvToast.toast('Creada correctamente', {
        title: 'Creada',
        variant: 'success',
        appendToast: true,
        solid: true,
      })
      await this.$router.push('/redeterminacion')
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
    async onReturn(){
      await this.$router.push('/obras')
    },
  },
}
</script>