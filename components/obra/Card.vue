<template>
  <b-card no-body class="shadow-card">
    <b-card-body>
      <NuxtLink :to="{ name: 'obra-id', params: { id: obra.id } }">
        <h5 class="text-success"><b>{{ obra.objeto }}</b></h5>
      </NuxtLink>
      <p style="margin-bottom: 1%">{{ obra.adjudicado }}</p>
      <strong>{{ obra.fecha_contrato }}</strong>
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
  methods: {
    tag(id) {
      return this.$store.getters['tags/getTagById'](id)
    },
  },
}
</script>
