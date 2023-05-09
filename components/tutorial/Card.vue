<template>
  <b-card no-body class="tutorial-card col-6 mx-auto">
    <!-- <NuxtLink :to="{ name: 'obra-id', params: { id: item.id } }">
      <img :src="item.image" class="card-img-top" :alt="item.nombre" />
    </NuxtLink> -->
    <b-card-body>
      <a :href="item.link" target="blank">
        <strong>{{item.nombre}} </strong>
      </a>
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
  },
}
</script>
