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
            <b-btn class="col-md-3 my-2" @click="addItem">Agregar Item</b-btn>
          <hr />
          <h3>Ponderación</h3>
            <b-list-group-item
              v-for="(_, index) in ponderacion"
              :key="index"
              class="pr-12"
            >
              <div class="row no-gutters">
                <div class="col-md-12">
                  <strong>{{ponderacion[index].categoria.nombre}}</strong>
                  <b-form-group label="Porcentaje" class="col-md-12 my-1" label-cols-sm="5" label-cols-md="2">
                    <b-form-input class="col-md-3" v-model="ponderacion[index].porcentaje" type="number" />
                  </b-form-group>
                </div>
              </div>
            </b-list-group-item>
          </b-list-group>
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
      ponderacion: [],
      categorias: [],
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
    // await this.$store.dispatch('tags/getTags')
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
    // categorias() {
    //   console.log(this.$store.state.categorias.all)
    //   return this.$store.state.categorias.all
    // },
  },
}
</script>

<style type="text/css"></style>
