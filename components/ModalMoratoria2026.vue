<template>
  <b-modal
    id="modalMoratoria2026"
    v-model="visible"
    centered
    hide-header
    hide-footer
    no-close-on-backdrop
    no-close-on-esc
  >
    <div class="moratoria-modal-content">
      <button
        type="button"
        class="moratoria-close"
        aria-label="Cerrar"
        @click="cerrar"
      >
        X
      </button>
      <img
        src="~/assets/Moratoria 2026.png"
        alt="Moratoria 2026"
        class="moratoria-img"
      />
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'ModalMoratoria2026',
  props: {
    mostrarModal: Boolean,
  },
  data() {
    return {
      visible: false,
    };
  },
  watch: {
    mostrarModal(val) {
      this.visible = !!val;
    },
  },
  mounted() {
    // Por si el componente se monta cuando ya veníamos habilitando el modal.
    if (this.mostrarModal) this.visible = true;
  },
  methods: {
    cerrar() {
      if (process.client) {
        try {
          localStorage.setItem('moratoria2026_seen', '1');
        } catch (e) {
          // No bloquear el flujo si falla localStorage (modo incógnito, etc).
        }
      }

      this.visible = false;
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.moratoria-modal-content {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

.moratoria-close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid #e5e5e5;
  background: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  z-index: 2;
  font-weight: 700;
  font-size: 16px;
  line-height: 36px;
}

.moratoria-img {
  width: 100%;
  max-width: 900px;
  max-height: 70vh;
  object-fit: contain;
}
</style>

