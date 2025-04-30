<template>
  <div class="page main-background">
    <Banner title="Pagos"/>
    <b-card class="col-8 mx-auto shadow-card my-3">
      <b-form @submit="onSubmitForm">
        <div class="layout" id="form-data">
          <div class="col col-main">
            <h4>Factura 1</h4>
            <b-form-file accept="pdf,jpg" v-model="pago1" required placeholder="No se seleccionó un archivo." ></b-form-file>
          </div>
          <div class="col col-complementary">
            <h4>Factura 2</h4>
            <b-form-file accept="pdf,jpg" v-model="pago2" required placeholder="No se seleccionó un archivo."></b-form-file>
          </div>
        </div>
        <div class="row no-gutters float-right my-3">
          <b-button class="mx-2" type="reset" variant="danger">Cancelar</b-button>
          <b-button class="mx-2" type="submit" variant="success">Enviar</b-button>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>

export default{
  data(){
    return{
      pago1: null,
      pago2: null,
    }
  },
  methods: {
    onSubmitForm(){

    }
  },
}
</script>

<style>
@media only screen and (min-width: 640px) {
  .layout {
    display: flex;
  }
}
.col-main {
  flex: 1;
}

.col-complementary {
  flex: 1;
}
</style>
