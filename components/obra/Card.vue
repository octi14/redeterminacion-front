<template>
  <b-card no-body class="obra-card">
    <!-- <NuxtLink :to="{ name: 'obra-id', params: { id: obra.id } }">
      <img :src="obra.image" class="card-img-top" :alt="obra.name" />
    </NuxtLink> -->
    <b-card-body>
      <NuxtLink :to="{ name: 'obra-id', params: { id: obra.id } }">
        <h2 class="h4">{{ obra.objeto }}</h2>
      </NuxtLink>
      <h5>{{ obra.adjudicado }}</h5>
      <h5>{{ obra.fecha_contrato }}</h5>
    </b-card-body>
      <NuxtLink class="col-md-3" :to="{ name: 'obra-id', params: { id: obra.id } }">
        <b-button variant="success" class="col-sm-12">
          <h5 class="text-center">Detalles</h5>
        </b-button>
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
