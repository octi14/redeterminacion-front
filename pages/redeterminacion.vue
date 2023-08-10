<template>
  <div class="page feed">
    <Banner title="Obras" />
    <template v-if="adminHacienda">
      <ObraFeed />
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    adminHacienda() {
      return this.$store.state.user.admin == "hacienda"
    },
  }
}
</script>

<style>
.feed{
  background-color: #ffffff;
}
</style>
