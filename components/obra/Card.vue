<template>
  <b-card no-body class="obra-card mt-1">
    <!-- <NuxtLink :to="{ name: 'obra-id', params: { id: obra.id } }">
      <img :src="obra.image" class="card-img-top" :alt="obra.name" />
    </NuxtLink> -->
    <b-card-body>
      <NuxtLink :to="{ name: 'obra-id', params: { id: obra.id } }">
        <h5>{{ obra.objeto }}</h5>
      </NuxtLink>
      <h6>{{ obra.adjudicado }}</h6>
      <strong>{{ obra.fecha_contrato }}</strong>
    </b-card-body>
      <NuxtLink class="col-md-2" :to="{ name: 'obra-id', params: { id: obra.id } }">
        <!-- <b-button variant="success" class="col-sm-12 my-1"> Detalles </b-button> -->
            <!-- <b-icon icon="arrow-up"></b-icon>
            <b-icon icon="exclamation-triangle"></b-icon> -->
      </NuxtLink>
  </b-card>
</template>

<script>
export default {
  props: {
    obra: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    tag(id) {
      return this.$store.getters['tags/getTagById'](id)
    },
  },
}
</script>
