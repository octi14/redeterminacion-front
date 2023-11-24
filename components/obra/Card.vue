<template>
  <b-card no-body class="obra-card">
    <b-card-body>
      <NuxtLink :to="{ name: 'obra-id', params: { id: obra.id } }">
        <h5 class="text-success">{{ obra.objeto }}</h5>
      </NuxtLink>
      <a>{{ obra.adjudicado }}</a> <br>
      <strong>{{ new Date(obra.fecha_contrato).toLocaleDateString('es-AR') }}</strong>
    </b-card-body>
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
