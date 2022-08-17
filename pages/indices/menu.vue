<template>
  <div class="container my-4 background">
    <b-card>
      <h4 class="text-center"> Menú de índices </h4>
      <b-card-body class="col text-center mx-auto">
        <b-button variant="primary" @click="onCreate"> Crear índice ICC
        </b-button>
        <b-button variant="primary" @click="onSearch"> Buscar índice
        </b-button>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  methods: {
    async onCreate() {
      await this.$router.push("/indices/create")
    },
    async onSearch() {
      await this.$router.push("/indices/search")
    }
  },
}
</script>

