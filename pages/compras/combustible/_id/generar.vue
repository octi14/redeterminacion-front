<template>
  <div class="page">
    <Banner title="Compras" subtitle="Generar vales"/>

    <b-container class="mt-4 card shadow-card" v-if="orden">
      <b-form @submit.prevent="generarVales" class="m-4">
        <b-form-group label="Cantidad de vales" label-for="cantidad">
          <b-form-input
            id="cantidad"
            v-model.number="form.cantidad"
            type="number"
            min="1"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Tipo de combustible" label-for="combustible">
          <b-form-select 
            id="combustible" 
            v-model="form.combustible"
            :options="tiposCombustible"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group label="Monto de cada vale" label-for="monto">
          <b-form-input
            id="monto"
            v-model.number="form.monto"
            type="number"
            min="1"
            required
          ></b-form-input>
        </b-form-group>

        <b-button 
          type="submit" 
          variant="primary"
          :disabled="!orden"
        >
          Generar vales
        </b-button>
      </b-form>
    </b-container>
    <b-container class="justify-content-center text-center card shadow-card mt-4" v-else>
      <h3 class="text-danger font-weight-bold mt-5">Ocurrió un error al cargar la orden de compra.</h3>
      <h5 class="m-5">Por favor, volvé a la lista de órdenes de compra y seleccioná una.</h5>
      <b-button variant="primary" class="col-3 mb-4 mx-auto" @click="$router.push(`/compras/combustible`)">Volver</b-button>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        cantidad: 1,
        combustible: "Super",
        monto: null
      },
      tiposCombustible: [
        { value: "Super", text: "Super" },
        { value: "V-Power", text: "V-Power" }
      ]
    };
  },
  computed: {
    orden() {
      return this.$store.state.combustible.single;
    }
  },
  methods: {
    generarVales() {
      if (!this.orden) {
        alert("No hay una orden de compra válida.");
        return;
      }

      const vales = {
        ordenId: this.orden._id,
        cantidad: this.form.cantidad,
        combustible: this.form.combustible,
        monto: this.form.monto
      };

      // Acá podrías llamar a un action de Vuex o un API para guardar los vales
      console.log("Generando vales con los siguientes datos:", vales);
      
      // Limpiar formulario después de generar los vales
      this.form.cantidad = 1;
      this.form.combustible = "Super";
      this.form.monto = null;
    }
  }
};
</script>
