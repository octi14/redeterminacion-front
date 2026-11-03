<template>
  <div class="page main-background presupuesto-page">
    <Banner v-show="!isFs" title="Proyecto de Presupuesto 2027" subtitle="Secretaría de Hacienda" />
    <div
      ref="deck"
      class="deck container-fluid"
      :class="{ 'deck--fs': isFs, 'py-3 py-md-4': !isFs }"
    >
      <div class="tabs-toolbar">
        <div class="tabs-bar" role="tablist" aria-label="Dashboards de presupuesto 2027">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            role="tab"
            :aria-selected="tab === t.id"
            :class="{ on: tab === t.id }"
            @click="goTo(t.id)"
          >
            <span class="n">{{ t.id }}</span>{{ t.label }}
          </button>
        </div>
        <a
          v-show="!isFs"
          class="pdf-link"
          href="/presupuesto/presentacion.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Presentación (PDF)
        </a>
      </div>

      <div class="stage">
        <div class="slides" :style="slidesStyle">
          <iframe
            v-for="t in tabs"
            :key="t.id"
            class="dash-frame"
            :src="t.src"
            :title="t.label"
          />
        </div>

        <button
          v-show="isFs"
          type="button"
          class="nav-btn nav-btn--prev"
          :disabled="tabIndex <= 0"
          title="Anterior"
          aria-label="Anterior"
          @click="shift(-1)"
        >
          <i class="bi bi-chevron-left" aria-hidden="true" />
        </button>
        <button
          v-show="isFs"
          type="button"
          class="nav-btn nav-btn--next"
          :disabled="tabIndex >= tabs.length - 1"
          title="Siguiente"
          aria-label="Siguiente"
          @click="shift(1)"
        >
          <i class="bi bi-chevron-right" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="fs-btn"
          :aria-pressed="isFs"
          :title="isFs ? 'Salir de pantalla completa' : 'Pantalla completa'"
          :aria-label="isFs ? 'Salir de pantalla completa' : 'Pantalla completa'"
          @click="toggleFs"
        >
          <i :class="isFs ? 'bi bi-fullscreen-exit' : 'bi bi-fullscreen'" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/** Orden de solapas según entregables de Hacienda. */
const TABS = [
  { id: '0', label: 'Resumen', src: '/presupuesto/resumen.html' },
  { id: '1', label: 'Recursos por rubros', src: '/presupuesto/recursos.html' },
  { id: '2', label: 'Gasto por objeto', src: '/presupuesto/objeto.html' },
  { id: '3', label: 'Categorías programáticas', src: '/presupuesto/programatica.html' },
  { id: '4', label: 'Finalidad y función', src: '/presupuesto/finalidad-funcion.html' },
  { id: '5', label: 'CAIF', src: '/presupuesto/caif.html' },
  { id: '6', label: 'Básicos al personal', src: '/presupuesto/basicos-personal.html' },
]

export default {
  name: 'Presupuesto2027',
  data() {
    return {
      tab: '0',
      tabs: TABS,
      isFs: false,
    }
  },
  computed: {
    tabIndex() {
      return this.tabs.findIndex((t) => t.id === this.tab)
    },
    slidesStyle() {
      return {
        transform: `translate3d(${-this.tabIndex * 100}%, 0, 0)`,
      }
    },
  },
  mounted() {
    document.addEventListener('fullscreenchange', this.onFsChange)
    document.addEventListener('keydown', this.onKey)
  },
  beforeUnmount() {
    document.removeEventListener('fullscreenchange', this.onFsChange)
    document.removeEventListener('keydown', this.onKey)
  },
  methods: {
    goTo(id) {
      this.tab = id
    },
    shift(delta) {
      const next = this.tabIndex + delta
      if (next < 0 || next >= this.tabs.length) return
      this.tab = this.tabs[next].id
    },
    async toggleFs() {
      const el = this.$refs.deck
      if (!el) return
      try {
        if (!document.fullscreenElement) {
          await el.requestFullscreen()
        } else {
          await document.exitFullscreen()
        }
      } catch (_) {
        this.isFs = !this.isFs
      }
    },
    onFsChange() {
      this.isFs = document.fullscreenElement === this.$refs.deck
    },
    onKey(e) {
      if (!this.isFs) return
      if (e.target && ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(e.target.tagName)) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        this.shift(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        this.shift(-1)
      }
    },
  },
}
</script>

<style scoped>
.presupuesto-page { min-height: 70vh; }
.deck--fs {
  background: #0f1a12;
  min-height: 100vh;
  max-width: none !important;
  width: 100%;
  margin: 0;
  padding: 10px 12px 12px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.tabs-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 16px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.deck--fs .tabs-toolbar {
  margin-bottom: 8px;
  flex: none;
}
.tabs-bar {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  flex: 1;
}
.pdf-link {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  color: #0c681a;
}
.fs-btn,
.nav-btn {
  position: absolute;
  z-index: 5;
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  background: rgba(15, 26, 18, 0.72);
  color: #fff;
  border-radius: 999px;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}
.fs-btn {
  right: 12px;
  bottom: 12px;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  font-size: 1.15rem;
}
.nav-btn--prev {
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}
.nav-btn--next {
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}
.fs-btn:hover,
.nav-btn:hover:not(:disabled) {
  background: rgba(15, 26, 18, 0.9);
}
.nav-btn:disabled {
  opacity: 0.35;
  cursor: default;
}
.deck--fs .tabs-bar button {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  color: #fff;
}
.deck--fs .tabs-bar .n { background: rgba(255, 255, 255, 0.2); color: #fff; }
.deck--fs .tabs-bar .on {
  background: #fff;
  color: #0c681a;
  border-color: #fff;
}
.deck--fs .tabs-bar .on .n {
  background: rgba(12, 104, 26, 0.15);
  color: #0c681a;
}
.tabs-bar button {
  font: inherit;
  border: 1px solid var(--gray-bs-300);
  background: var(--color-white);
  border-radius: 99px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.tabs-bar .n {
  display: inline-grid;
  place-items: center;
  min-width: 1.35em;
  height: 1.35em;
  padding: 0 4px;
  border-radius: 99px;
  background: var(--gray-bs-200);
  font-size: 11px;
  font-weight: 700;
}
.tabs-bar .on {
  background: #0c681a;
  color: #fff;
  border-color: #0c681a;
}
.tabs-bar .on .n {
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}
.stage {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}
.slides {
  display: flex;
  height: 100%;
  min-height: 75vh;
  width: 100%;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
.deck--fs .slides {
  min-height: 0;
  flex: 1;
  height: 100%;
}
.dash-frame {
  display: block;
  flex: 0 0 100%;
  width: 100%;
  min-width: 100%;
  height: calc(100vh - 220px);
  min-height: 75vh;
  border: 0;
  background: var(--color-white);
}
.deck--fs .dash-frame {
  min-height: 0;
  height: 100%;
  border-radius: 6px;
}
@media (min-width: 768px) {
  .tabs-bar button {
    padding: 8px 14px;
    font-size: 14px;
  }
}
</style>
