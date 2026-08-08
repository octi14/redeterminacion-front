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
  permissions: ['hacienda.obras.read'],
})
</script>

<script>
export default {
  computed: {
    adminHacienda() {
      return this.$can('hacienda.obras.read')
    },
  }
}
</script>
