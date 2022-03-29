<template>
  <b-card no-body class="obra-card">
    <!-- <NuxtLink :to="{ name: 'obra-id', params: { id: obra.id } }">
      <img :src="obra.image" class="card-img-top" :alt="obra.name" />
    </NuxtLink> -->
    <b-card-body>
      <h2 class="h4">{{ obra.name }}</h2>
      <p>{{ obra.description }}</p>
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
