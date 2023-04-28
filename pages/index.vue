<template>
  <div class="page">
    <div style="height: 100%">
      <div class="mx-auto m-2" style="height:100%">
        <div class="shadow-lg" style="height:100%">
          <template>
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

<style type="text/css">
.background {
  padding: 0% 0;
  background-size: cover;
  object-fit: fill;
  background-color: #f5f8f9;
}

</style>
