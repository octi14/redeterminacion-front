<template>
  <div class="page">
    <div style="height: 100%">
      <div class="mx-auto m-2" style="height:100%">
        <div class="main-background" style="height:100%">
          <template>
            <Banner title="SECRETARÍA DE HACIENDA" subtitle="MUNICIPALIDAD DE VILLA GESELL" />
            <Landing />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return Boolean(this.$store.state.user.token)
    },
  }
}
</script>
