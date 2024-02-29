<template>
  <div class="multimedia-card">
    <div class="multimedia-card mx-auto">
      <div class="my-3">
        <b-icon-link45deg class="link" scale="0.95"/>
        <a class="link" :href="item.link" target="blank">
          {{item.nombre}}
        </a>
        <b-button-group class="float-right" v-if="adminModernizacion">
          <b-button variant="outline-secondary" title="Editar" @click="editarArchivo">
            <b-icon-pen size="sm"/>
          </b-button>
          <b-button variant="outline-danger" title="Eliminar" @click="eliminarArchivo">
            <b-icon-trash size="sm"/>
          </b-button>
        </b-button-group>
      </div>
    </div>
    <!-- Modal editar archivo -->
    <b-modal hide-header-close v-model="editing" header-bg-variant="secondary" title="Editar archivo" title-class="h5 text-light mx-auto" hide-footer centered>
      <MultimediaForm
        v-if="editing"
        v-on:show="fetch"
        :multimedia="item"
        :create= false
        @submit="onSubmitEditArchivo"
        @reset="editing = false"
      ></MultimediaForm>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editing: false,
    }
  },
  computed: {
    adminModernizacion(){
      return this.$store.state.user.admin == "modernizacion"
    }
  },
  activated() {
    this.editing = false
  },
  methods: {
    async editarArchivo(){
      this.editing = true
    },
    async onSubmitEditArchivo({ multimedia }) {
      try {
        const userToken = this.$store.state.user.token
        await this.$store.dispatch('multimedias/update', {
          multimedia,
          userToken,
        })
        this.$bvToast.toast('', {
          title: 'Archivo actualizado.',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        this.editing = false
        // await this.$router.push('/modernizacion')
      } catch (e) {
        this.$bvToast.toast('Error Editando. Intente cerrar sesión e iniciar nuevamente.', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
    async eliminarArchivo(){
      try{
        const userToken = this.$store.state.user.token
        await this.$store.dispatch('multimedias/delete', {
          id: this.item.id,
          userToken
      })
        this.$bvToast.toast('Eliminado correctamente', {
          variant: "success",
          solid: true
        })
        this.$router.push('/modernizacion')
      }catch(e){
        this.$bvToast.toast(e.message, {
          variant: "danger",
          solid: true })
      }
    }
  },
}
</script>

<style>
.link {
  color: #018811;
}
</style>
