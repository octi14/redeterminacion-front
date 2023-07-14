<template>
  <div class="multimedia-feed">
    <b-card class="shadow-lg mx-auto mt-4 col-8" v-if="items.length > 0">
      <!-- <div class="mx-auto text-center">
        <h4> Lista de archivos </h4>
      </div> -->
      <div
        v-for="item in paginatedItems"
        :key="item.id"
      >
        <MultimediaCard :item="item" />
      </div>
    <div class="text-center justify-content-center mx-auto mt-3 row">
      <b-button size="sm" class="float-left mx-1 my-1 pagination-button" variant="outline-success" @click="previousPage" :disabled="currentPage === 1">
        <b-icon-arrow-left />
      </b-button>
      <h5 class="text-center mt-2">{{ currentPage }} / {{ totalPages }}</h5>
      <b-button size="sm" class="float-right mx-1 my-1 pagination-button" variant="outline-success" @click="nextPage" :disabled="currentPage === totalPages">
        <b-icon-arrow-right />
      </b-button>
    </div>
    </b-card>
    <div class="mx-auto text-center mt-5" v-else>
      <h5> Cargando... </h5>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    keyword: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isAdding: false,
      lastLength: false,
      items: [],
      currentPage: 1,
      perPage: 10,
      totalPages: 0
    }
  },
  async fetch() {
    await this.$store.dispatch('multimedias/search',{
      categoria: this.keyword,
    })
    this.items = this.multimedias
    const perPage = 10; // Number of items per page
    this.totalPages = Math.ceil(this.items.length / perPage);

    // consulto si no hay más para traer
    // const newLength = this.$store.state.obras.latest.length
    // this.all = newLength === this.lastLength
    // this.lastLength = newLength
  },
  // fetchOnServer: false,
  computed: {
    loading() {
      return this.$fetchState.pending
    },
    multimedias() {
      return this.$store.state.multimedias.multimedias
    },
    isAdmin(){
      return Boolean(this.$store.state.user.admin == "true")
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.items.slice(start, end);
    }
  },
  methods: {
    loadMore() {
      this.$fetch()
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
}
</script>

<style>
.pagination-button{
  height: 30px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
