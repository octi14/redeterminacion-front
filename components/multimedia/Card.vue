<template>
  <div class="multimedia-card">
    <div class="multimedia-card mx-auto">
      <div class="my-3">
        <i class="bi bi-link45deg"></i>
        <a class="link" :href="item.link" target="blank">
          {{item.nombre}}
        </a>
        <b-button-group class="float-right" v-if="adminModernizacion">
          <b-button variant="outline-secondary" title="Editar" @click="editarArchivo">
            <i class="bi bi-pen"></i>
          </b-button>
          <b-button variant="outline-danger" title="Eliminar" @click="eliminarArchivo">
            <i class="bi bi-trash"></i>
          </b-button>
        </b-button-group>
      </div>
    </div>
    <!-- Modal editar archivo -->
    <BModal no-header-close v-model="editing" header-bg-variant="secondary" title="Editar archivo" title-class="h5 text-light mx-auto" no-footer centered>
      <MultimediaForm
        v-if="editing"
        v-on:show="fetch"
        :multimedia="item"
        :create= false
        @submit="onSubmitEditArchivo"
        @reset="editing = false"
      ></MultimediaForm>
    </BModal>
  </div>
</template>

<script>
export default {
  setup(){ const { showToast } = useProjectToast(); return { showToast } },
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
      return useUserStore().admin == "modernizacion"
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
        const userToken = useUserStore().token
        await useMultimediasStore().update({
          multimedia,
          userToken,
        })
        this.showToast('', {
          title: 'Archivo actualizado.',
          variant: 'success',
          appendToast: true,
          solid: true,
        })
        this.editing = false
        // await this.$router.push('/modernizacion')
      } catch (e) {
        this.showToast('Error Editando. Intente cerrar sesión e iniciar nuevamente.', {
          title: 'Error',
          variant: 'danger',
          appendToast: true,
          solid: true,
        })
      }
    },
    async eliminarArchivo(){
      try{
        const userToken = useUserStore().token
        await useMultimediasStore().delete({
          id: this.item.id,
          userToken
      })
        this.showToast('Eliminado correctamente', {
          variant: "success",
          solid: true
        })
        this.$router.push('/modernizacion')
      }catch(e){
        this.showToast(e.message, {
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
