<template>
  <b-card no-body class="tutorial-card">
    <!-- <NuxtLink :to="{ name: 'obra-id', params: { id: item.id } }">
      <img :src="item.image" class="card-img-top" :alt="item.nombre" />
    </NuxtLink> -->
    <b-card-body>
      <h6>{{ item.nombre }}</h6>
      <a :href="item.link">{{item.link}}</a>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  props: {
    item: {
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
