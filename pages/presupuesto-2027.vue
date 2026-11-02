<template>
  <div class="page main-background presupuesto-page">
    <Banner title="Proyecto de Presupuesto 2027" subtitle="Secretaría de Hacienda" />
    <div class="container-fluid py-3 py-md-4">
      <div class="tabs-bar">
        <button type="button" :class="{ on: tab === 'p' }" @click="tab = 'p'">Categorías programáticas</button>
        <button type="button" :class="{ on: tab === 'o' }" @click="tab = 'o'">Gasto por objeto</button>
      </div>

      <DashboardProgramatica v-if="tab === 'p'" />
      <DashboardObjeto v-else />
    </div>
  </div>
</template>

<script>
import DashboardProgramatica from '~/components/presupuesto/DashboardProgramatica.vue'
import DashboardObjeto from '~/components/presupuesto/DashboardObjeto.vue'

export default {
  name: 'Presupuesto2027',
  components: { DashboardProgramatica, DashboardObjeto },
  data() {
    return { tab: 'p' }
  },
}
</script>

<style scoped>
.presupuesto-page { min-height: 70vh; }
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
</style>
