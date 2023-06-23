<template>
  <div class="multimedia-form modal-overlay">
    <div class="form">
      <h4 class="text-center mb-3">
        {{ create ? 'Crear' : 'Editar' }} archivo
      </h4>
      <b-form class="col-md-10 mx-auto justify-content-center" @submit.stop.prevent="onSubmit" @reset="volver">
        <b-form-group>
            <b-form-group label="Título">
              <b-form-input v-model="nombre" type="text" />
            </b-form-group>
            <b-form-group label="Link">
              <b-form-input v-model="link" type="text" />
            </b-form-group>
        </b-form-group>
        <b-form-text class="h6"> Categoría </b-form-text>
        <b-form-select v-model="categoria" class="mb-3">
          <b-form-select-option
            v-for="categoria in categorias"
            :key="categoria.nombre"
            :value="categoria">{{categoria.nombre}}
          </b-form-select-option>
        </b-form-select>
        <b-btn type="submit" size="sm" variant="success">
          <h4 class="my-auto" style="color:white">{{ create ? 'Crear' : 'Editar' }} </h4>
        </b-btn>
        <b-btn type="reset" size="sm">
          <h4 class="my-auto" style="color:white"> Volver </h4>
        </b-btn>
      </b-form>
    </div>
  </div>
</template>

<script>
import MultimediaService from '~/service/multimedia'

export default {
  props: {
    multimedia: {
      type: Object,
      default: () => ({}),
    },
    create: {
      type: Boolean,
      default: true,
    },
  },
  middleware: ['authenticated'],
  data() {
    return {
      categorias: [
        {
          nombre: "Notas",
        },
        {
          nombre: "Procedimientos",
        },
        {
          nombre: "Tutoriales",
        },
        {
          nombre: "Mail Institucional",
        },
        {
          nombre: "GDE",
        },
        {
          nombre: "Ordenanzas",
        }
      ],
    }
  },
  async fetch() {
    const multimediaId = this.multimedia.id
    if (!this.create){
      this.item = await MultimediaService.getSingle(this.$axios, {
        id: multimediaId,
      })
    }
  },
  created() {
    this.initialize()
  },
  fetchOnServer: false,
  methods: {
    volver(){
      this.$emit('reset')
    },
    onSubmit(){
      if (this.create){
        this.onSubmitCreateFile()
      }else{
        this.onSubmitEditMultimedia()
      }
    },
    async onSubmitCreateFile() {
    try {
      const userToken = this.$store.state.user.token
      await this.$store.dispatch('multimedias/create', {
        userToken,
        multimedia: {
          nombre: this.nombre,
          link: this.link,
          categoria: this.categoria.nombre,
        },
      })
      this.$emit('submit')
      } catch (e) {
        this.$bvToast.toast('Error Cargando el archivo', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
    initialize() {
      const {
        nombre = '',
        link = '',
        categoria = '',
      } = this.multimedia

      this.nombre = nombre
      this.link = link
      this.categoria = categoria
    },
    onSubmitEditMultimedia() {
      const multimedia = {
        nombre: this.nombre,
        link: this.link,
        categoria: this.categoria.nombre,
      }
      if (this.multimedia.id) {
        multimedia.id = this.multimedia.id
      }
      this.$emit('submit', { multimedia })
    },
  }
}
</script>

<style type="text/css">

.form {
  text-align: center;
  background-color: white;
  height: 440px;
  width: 500px;
  margin-top: 10%;
  padding: 40px 0;
  border-radius: 20px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background-color: #000000c3;
}

</style>
