<template>
  <div class="page main-background">
    <Banner title="Obras" />
    <template v-if="puedeVerObras">
      <ObraFeed />
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    puedeVerObras() {
      return this.$can('hacienda.obras.read')
    },
  }
}
</script>
