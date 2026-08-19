<template>
  <div class="page main-background pn-result-page">
    <div class="row no-gutters justify-content-center align-items-center pn-result-wrap">
      <div class="col-11 col-md-7 col-lg-5">
        <div class="pn-result-card pn-result-card--success">
          <div class="pn-result-header">
            <div class="pn-result-icon" aria-hidden="true">
              <i class="bi bi-check-lg"></i>
            </div>
          </div>
          <div class="pn-result-body">
            <p class="pn-result-title">Tu pago se realizó con éxito</p>
            <p v-if="statusLabel" class="pn-result-sub text-muted">{{ statusLabel }}</p>
            <b-button class="pn-result-btn pn-result-btn--success" @click="finalizar">
              Finalizar
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProvinciaNetService from '~/service/provinciaNet.js'

const STORAGE_KEY = 'provinciaNetUUID'

export default {
  data() {
    return {
      status: null,
    }
  },
  computed: {
    statusLabel() {
      if (!this.status) return ''
      if (this.status === 'Parcial') {
        return 'El pago quedó parcial: algunos ítems se cobraron y otros no.'
      }
      if (this.status === 'Finalizado') return ''
      return `Estado actual: ${this.status}`
    },
  },
  async mounted() {
    await this.cargarEstado()
  },
  methods: {
    async cargarEstado() {
      if (!import.meta.client) return
      const uuid = localStorage.getItem(STORAGE_KEY)
      if (!uuid) return
      try {
        const res = await ProvinciaNetService.getEstado(this.$axios, uuid)
        const data = res?.data || res
        this.status = data?.status || null
        if (this.status === 'Cancelado') {
          this.$router.replace('/pagos/tasa-urbana/error')
        }
      } catch (e) {
        console.error(e)
      }
    },
    finalizar() {
      if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
      this.$router.push('/')
    },
  },
}
</script>

<style scoped>
.pn-result-wrap {
  min-height: 70vh;
}
.pn-result-card {
  background: #fff;
  border: 1px solid #dee2e6;
  overflow: hidden;
}
.pn-result-header {
  background: #0c681a;
  min-height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pn-result-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #fff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}
.pn-result-body {
  padding: 2rem 1.5rem 2.25rem;
  text-align: center;
}
.pn-result-title {
  color: #0c681a;
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
}
.pn-result-sub {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.pn-result-btn--success {
  background: #0c681a;
  border-color: #0c681a;
  color: #fff;
  min-width: 140px;
}
.pn-result-btn--success:hover {
  background: #15571f;
  border-color: #15571f;
  color: #fff;
}
</style>
