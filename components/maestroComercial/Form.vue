<template>
  <div class="maestro-comercial-form form">
    <b-form class="col-md-10 mx-auto justify-content-center" @submit.prevent="onSubmit">
      <b-form-group label="CUIT">
        <b-form-input v-model="form.cuit" type="text" :readonly="!canEdit" />
      </b-form-group>
      <b-form-group label="Legajo comercial">
        <b-form-input v-model="form.legajo" type="text" :readonly="!canEdit" />
      </b-form-group>
      <b-form-group label="Numero de telefono">
        <b-form-input v-model="form.telefono" type="text" :readonly="!canEdit" />
      </b-form-group>
      <b-form-group label="Denominacion">
        <b-form-input v-model="form.denominacion" type="text" :readonly="!canEdit" />
      </b-form-group>
      <b-form-group label="Mail">
        <b-form-input v-model="form.mail" type="text" :readonly="!canEdit" />
      </b-form-group>
      <b-form-group label="Titular">
        <b-form-input v-model="form.titular" type="text" :readonly="!canEdit" />
      </b-form-group>
      <b-form-group label="DFE">
        <b-form-input v-model="form.dfe" type="text" :readonly="!canEdit" />
      </b-form-group>
      <b-btn v-if="canEdit" type="submit" size="md" variant="success">
        <h5 class="my-auto" style="color:white">Guardar</h5>
      </b-btn>
      <b-btn type="reset" size="md" variant="warning" @click="volver">
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
    canEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        id: this.item.id,
        cuit: this.item.cuit || '',
        legajo: this.item.legajo || '',
        telefono: this.item.telefono || '',
        denominacion: this.item.denominacion || '',
        mail: this.item.mail || '',
        titular: this.item.titular || '',
        dfe: this.item.dfe || '',
      },
    }
  },
  methods: {
    volver() {
      this.$emit('reset')
    },
    onSubmit() {
      if (!this.canEdit) {
        return
      }

      this.$emit('submit', { ...this.form })
    },
  },
}
</script>

<style scoped>
.form {
  text-align: center;
  margin-bottom: 40px;
  border-radius: 12%;
  overflow: visible;
}
</style>
