<template>
  <BModal
    id="modalMoratoria2026"
    :model-value="mostrarModal"
    centered
    no-header
    no-footer
    no-header-close
    no-close-on-esc
    lazy
    modal-class="moratoria-modal"
    content-class="moratoria-modal-content-wrapper"
    body-class="moratoria-modal-body"
    @update:model-value="onUpdate"
    @hidden="cleanupModalArtifacts"
  >
    <div class="moratoria-modal-content">
      <div class="moratoria-frame">
        <button
          class="moratoria-close"
          aria-label="Cerrar"
          @click="cerrar"
        >
          X
        </button>
        <img
          :src="moratoriaImg"
          alt="Moratoria 2026"
          class="moratoria-img"
        />
      </div>
    </div>
  </BModal>
</template>

<script>
import moratoriaImg from '~/assets/Moratoria 2026.png'
import { cleanupModalArtifacts as removeStaleModalLayers } from '~/utils/modalCleanup'

export default {
  name: 'ModalMoratoria2026',
  props: {
    mostrarModal: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'update:mostrarModal'],
  data() {
    return {
      moratoriaImg,
    }
  },
  methods: {
    cerrar() {
      this.$emit('update:mostrarModal', false)
      this.$emit('close')
    },
    onUpdate(value) {
      if (!value) {
        this.cerrar()
      }
    },
    cleanupModalArtifacts() {
      removeStaleModalLayers()
    },
  },
}
</script>

<style scoped>
.moratoria-modal-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.moratoria-frame {
  position: relative;
  width: auto;
  min-width: 0;
  max-width: 92vw;
  max-height: 90vh;
  background: transparent;
  border-radius: 0;
  overflow: visible;
  display: inline-block;
}

.moratoria-close {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 2.25rem;
  height: 2.25rem;
  min-width: 2.25rem;
  min-height: 2.25rem;
  padding: 0;
  border-radius: 50%;
  border: none;
  background: none;
  color: black;
  cursor: pointer;
  z-index: 10;
  font-weight: 500;
  font-size: 0.7rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.moratoria-close:active {
  transform: scale(0.95);
}

.moratoria-img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  display: block;
}

@media (max-width: 575.98px) {
  .moratoria-frame {
    max-width: 94vw;
    max-height: 92vh;
    border-radius: 0;
  }

  .moratoria-close {
    top: 0.125rem;
    right: 0.125rem;
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    min-height: 2rem;
    font-size: 0.8rem;
  }

  .moratoria-img {
    max-height: 86vh;
  }
}

@media (min-width: 576px) and (max-width: 991.98px) {
  .moratoria-frame {
    max-width: 92vw;
    max-height: 90vh;
  }
  .moratoria-img {
    max-height: 84vh;
  }
}

@media (min-width: 992px) {
  .moratoria-frame {
    max-width: 760px;
  }

  .moratoria-close {
    top: 0.5rem;
    right: 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
    min-width: 2.5rem;
    min-height: 2.5rem;
    font-size: 1rem;
  }

  .moratoria-img {
    max-width: 100%;
    max-height: 78vh;
  }
}
</style>

<style>
.moratoria-modal.show {
  display: block !important;
}

.moratoria-modal .modal-dialog {
  margin: 0.5rem;
  width: auto;
  max-width: calc(100vw - 1rem);
}

@media (min-width: 576px) {
  .moratoria-modal .modal-dialog {
    margin: 1.75rem auto;
    max-width: min(92vw, 760px);
  }
}

.moratoria-modal .modal-content {
  border: 0;
  background: transparent;
  box-shadow: none;
  background-color: transparent !important;
}

.moratoria-modal-body {
  padding: 0 !important;
  background: transparent;
  max-height: 90vh;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 575.98px) {
  .moratoria-modal-body {
    padding: 0 !important;
    max-height: 95vh;
  }
}

.moratoria-modal-content-wrapper {
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  border-radius: 0 !important;
}
</style>
