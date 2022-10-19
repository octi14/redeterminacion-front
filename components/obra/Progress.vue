<template>
  <div class="card shadow-lg">
    <h4 class="mx-auto"> Avance de obra por item </h4>
    <div class="row">
      <div class="col ml-4">
        <br/>
        <b-row v-for="(_,index) in obra.items" :key="index">
          <strong>Item {{ index +1 }} </strong>
        </b-row>
      </div>
      <div class="col" v-for="(_,index) in certificados" :key="index">
        <b-row> Cert.{{ index +1 }} </b-row>
        <b-row v-for="(_,index2) in certificados[index].items" :key="index2">
          {{ format(certificados[index].items[index2].avance) }}%
        </b-row>
      </div>
      <div class="col">
        <b-row> <strong> Total </strong></b-row>
        <b-row v-for="(_, index3) in obra.items" :key="index3">
          <strong> {{ avanceTotal(index3) }} </strong>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import about from '~/pages/about.vue'
export default {
  components: { about },
  props: {
    obra: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      lastLength: false,
      items: [],
    }
  },
  async fetch() {
    await this.$store.dispatch('certificados/search', {
      obra: this.obra.id
      })
    this.items = this.certificados

    // const newLength = this.$store.state.certificados.latest.length
    // this.all = newLength === this.lastLength
    // this.lastLength = newLength
  },
  fetchOnServer: false,
  computed: {
    loading() {
      return this.$fetchState.pending
    },
    certificados() {
      return this.$store.state.certificados.certifs
    },
  },
  methods: {
    loadMore() {
      this.$fetch()
    },
    format(value) {
        let val = (value/1).toFixed(1).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    avanceTotal(number) {
      var total = 0
      for (var i = 0; i < this.items.length; i++) {
        total = total + this.items[i].items[number].avance
      }
      return String(this.format(total) + "%")
    },
  },
}
</script>
