<template>
  <div class="page main-background">
    <Banner title="Obras" />
    <template v-if="adminHacienda">
      <ObraFeed />
    </template>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  adminRoles: ['hacienda', 'master'],
})
</script>

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
