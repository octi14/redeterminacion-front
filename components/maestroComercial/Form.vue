<template>
  <div class="maestro-comercial-form form">
    <b-form class="col-md-10 mx-auto justify-content-center">
      <b-form-group label="CUIT">
        <b-form-input v-model="cuit" type="text" readonly />
      </b-form-group>
      <b-form-group label="Legajo comercial">
        <b-form-input v-model="legajo" type="text" readonly />
      </b-form-group>
      <b-form-group label="Número de teléfono">
        <b-form-input v-model="telefono" type="text" readonly />
      </b-form-group>
      <b-form-group label="Denominación">
        <b-form-input v-model="denominacion" type="text" readonly />
      </b-form-group>
      <b-form-group label="Mail">
        <b-form-input v-model="mail" type="text" readonly />
      </b-form-group>
      <b-form-group label="Titular">
        <b-form-input v-model="titular" type="text" readonly />
      </b-form-group>
      <b-form-group label="DFE">
        <b-form-input v-model="dfe" type="text" readonly />
      </b-form-group>
      <b-btn type="submit" size="md" variant="success" disabled>
        <h5 class="my-auto" style="color:white">{{ create ? 'Crear' : 'Editar' }}</h5>
      </b-btn>
      <b-btn type="reset" size="md" @click="volver">
        <h5 class="my-auto" style="color:white">Volver</h5>
      </b-btn>
    </b-form>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    create: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      cuit: this.item.cuit || '',
      legajo: this.item.legajo || '',
      telefono: this.item.telefono || '',
      denominacion: this.item.denominacion || '',
      mail: this.item.mail || '',
      titular: this.item.titular || '',
      dfe: this.item.dfe || '',
    };
  },
  methods: {
    volver() {
      this.$emit('reset');
    },
    onSubmit() {
      // No hacer nada, ya que los campos son de solo lectura
    },
  },
};
</script>

<style scoped>
.form {
  text-align: center;
  margin-bottom: 40px;
  border-radius: 12%;
  overflow: visible;
}
</style>
