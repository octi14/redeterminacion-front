<template>
  <div class="page">
    <Banner title="Modernización" />
    <div class="col text-center" v-if="isAdmin">
      <b-button variant="primary" @click="agregarArchivo" v-if="!isAdding"> Agregar archivo </b-button>
      <MultimediaForm v-else @reset="agregarArchivo"/>
    </div>
    <div class="row justify-content-center" style="height: 50%">
      <div class="text-center mx-5 my-auto">
        <NuxtLink to="/procedimientos">
          <b-icon-display class="h1" /> <br />
          <h3> Procedimientos </h3>
        </NuxtLink>
      </div>
      <div class="text-center mx-5 my-auto">
        <NuxtLink to="/notas">
          <b-icon-display class="h1" /> <br />
          <h3> Notas </h3>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      isAdding: false,
    }
  },
  computed: {
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
  },
  methods: {
    agregarArchivo() {
      this.isAdding = !this.isAdding
    },
  }
}
</script>

