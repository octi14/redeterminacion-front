<template>
  <div class="page main-background">
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
      const admin = useUserStore().admin
      return admin == "hacienda" ||  admin == "master"
    },
  }
}
</script>
