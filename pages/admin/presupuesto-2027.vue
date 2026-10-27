<template>
  <div class="page main-background presupuesto-page">
    <div v-if="!canAccess" class="no-access">
      <h1>Esta sección no está disponible</h1>
      <p>No tenés acceso a esta sección.</p>
      <NuxtLink to="/">Volver al inicio</NuxtLink>
    </div>

    <div v-else class="container-fluid py-3 py-md-4 mt-4">
      <header class="head">
        <NuxtLink :to="adminMaster ? '/admin/dashboard' : '/'" class="back">{{ adminMaster ? '← Informes' : '← Inicio' }}</NuxtLink>
        <h1>Presupuesto 2027</h1>
        <p>Secretaría de Hacienda · crédito original en pesos</p>
      </header>

      <div class="tabs-bar">
        <button type="button" :class="{ on: tab === 'p' }" @click="tab = 'p'">Categorías programáticas</button>
        <button type="button" :class="{ on: tab === 'o' }" @click="tab = 'o'">Gasto por objeto</button>
      </div>

      <DashboardProgramatica v-if="tab === 'p'" />
      <DashboardObjeto v-else />
    </div>
  </div>
</template>

<script setup>
import { PRESUPUESTO_2027_USERNAMES } from '~/utils/access-control'

definePageMeta({
  middleware: ['authenticated', 'require-admin'],
  adminRoles: ['master'],
  allowedUsernames: PRESUPUESTO_2027_USERNAMES,
})
</script>

<script>
import DashboardProgramatica from '~/components/presupuesto/DashboardProgramatica.vue'
import DashboardObjeto from '~/components/presupuesto/DashboardObjeto.vue'
import { PRESUPUESTO_2027_USERNAMES, userCanAccessAdminRoute } from '~/utils/access-control'

export default {
  name: 'Presupuesto2027',
  components: { DashboardProgramatica, DashboardObjeto },
  data() {
    return { tab: 'p' }
  },
  computed: {
    adminMaster() {
      return useUserStore().admin === 'master'
    },
    canAccess() {
      return userCanAccessAdminRoute(useUserStore(), {
        adminRoles: ['master'],
        allowedUsernames: PRESUPUESTO_2027_USERNAMES,
      })
    },
  },
}
</script>

<style scoped>
.presupuesto-page { min-height: 70vh; }
.no-access { text-align: center; padding: 4rem 1rem; }
.head { margin-bottom: 14px; }
.head h1 { margin: 4px 0 0; font-size: 1.4rem; }
.head p { margin: 2px 0 0; color: var(--gray-bs-600); font-size: 13px; }
.back { font-size: 13px; color: #0c681a; text-decoration: none; }
.tabs-bar { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.tabs-bar button {
  font: inherit;
  border: 1px solid var(--gray-bs-300);
  background: var(--color-white);
  border-radius: 99px;
  padding: 8px 14px;
  cursor: pointer;
}
.tabs-bar .on { background: #0c681a; color: #fff; border-color: #0c681a; }
@media (min-width: 768px) {
  .head h1 { font-size: 1.75rem; }
}
</style>
