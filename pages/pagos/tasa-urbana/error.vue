<template>
  <div class="page main-background pn-result-page">
    <div class="row no-gutters justify-content-center align-items-center pn-result-wrap">
      <div class="col-11 col-md-7 col-lg-5">
        <div class="pn-result-card pn-result-card--error">
          <div class="pn-result-header">
            <div class="pn-result-icon" aria-hidden="true">
              <span class="pn-result-exclaim">!</span>
            </div>
          </div>
          <div class="pn-result-body">
            <p class="pn-result-title">No hemos podido procesar tu pago</p>
            <p class="pn-result-sub">
              Por favor, intentalo con otro método o regresá más tarde.
            </p>
            <b-button class="pn-result-btn pn-result-btn--error" @click="volver">
              Volver a la página anterior
            </b-button>
            <p class="pn-result-note">
              Si el problema persiste comunicate con la oficina correspondiente por las vías oficiales.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const STORAGE_KEY = 'provinciaNetUUID'

export default {
  methods: {
    volver() {
      if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
      this.$router.push('/pagos/tasa-urbana')
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
  background: #cc0025;
  min-height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pn-result-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  color: #cc0025;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pn-result-exclaim {
  font-weight: 800;
  font-size: 1.6rem;
  line-height: 1;
}
.pn-result-body {
  padding: 2rem 1.5rem 1.75rem;
  text-align: center;
}
.pn-result-title {
  color: #cc0025;
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
}
.pn-result-sub {
  color: #222;
  margin-bottom: 1.25rem;
}
.pn-result-btn--error {
  background: #cc0025;
  border-color: #cc0025;
  color: #fff;
}
.pn-result-btn--error:hover {
  background: #cc0025;
  border-color: #cc0025;
  color: #fff;
}
.pn-result-note {
  margin-top: 1.25rem;
  margin-bottom: 0;
  font-size: 0.8rem;
  color: #999999;
}
</style>
