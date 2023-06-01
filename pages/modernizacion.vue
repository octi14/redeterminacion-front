<template>
  <div class="page">
    <Banner title="Modernización" />
    <div class="col text-center" v-if="isAdmin">
      <b-button variant="primary" @click="agregarArchivo" v-if="!isAdding"> Agregar archivo </b-button>
      <MultimediaForm v-else @reset="agregarArchivo"/>
    </div>
    <div class="row justify-content-center" style="height: 50%">
      <div class="text-center mx-5 my-auto" v-if="isAdmin">
        <NuxtLink to="/procedimientos">
          <b-icon-folder class="h1" /> <br />
          <h3><b> Procedimientos </b></h3>
        </NuxtLink>
      </div>
      <div class="text-center mx-5 my-auto">
        <NuxtLink to="/tutoriales/menu">
          <b-icon-folder class="h1" /> <br />
          <h3><b> Tutoriales </b></h3>
        </NuxtLink>
      </div>
      <div class="text-center mx-5 my-auto">
        <NuxtLink to="/notas">
          <b-icon-folder class="h1" /> <br />
          <h3><b> Formularios / Notas tipo </b></h3>
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

