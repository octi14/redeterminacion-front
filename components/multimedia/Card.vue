<template>
  <div class="multimedia-card">
    <div class="multimedia-card mx-auto">
      <div class="mt-4">
        <a :href="item.link" target="blank">
          <strong>{{item.nombre}} </strong>
        </a>
        <b-button class="float-right" variant="outline-danger" @click="eliminarArchivo">
          <b-icon-trash size="sm"/>
        </b-button>
        <b-button class="float-right" variant="outline-secondary" @click="editarArchivo">
          <b-icon-pen size="sm"/>
        </b-button>
      </div>
    </div>
    <!-- TODO: fixear el bug gráfico -->
    <MultimediaForm
      v-if="editing"
      v-on:show="fetch"
      :multimedia="item"
      :create= false
      @submit="onSubmitEditArchivo"
      @reset="editing = false"
    ></MultimediaForm>
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
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
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
        // this.editing = false
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
