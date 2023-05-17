<template>
  <b-card no-body class="multimedia-card shadow col-5 mx-auto">
    <!-- <NuxtLink :to="{ name: 'obra-id', params: { id: item.id } }">
      <img :src="item.image" class="card-img-top" :alt="item.nombre" />
    </NuxtLink> -->
    <b-card-body>
      <div class="float-left mt-2">
        <a :href="item.link" target="blank">
          <strong>{{item.nombre}} </strong>
        </a>
      </div>
      <div class="float-right">
        <b-button variant="secondary" @click="editarArchivo">
          <b-icon-pen size="sm"/>
        </b-button>
        <b-button variant="danger" @click="eliminarArchivo">
          <b-icon-trash size="sm"/>
        </b-button>
      </div>
    </b-card-body>
  </b-card>
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
    return {}
  },
  computed: {},
  methods: {
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
