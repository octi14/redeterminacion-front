<template>
  <div class="page main-background automotor-page">
    <Banner title="Descargar Tasa Automotor" />

    <main v-if="puedeVerModulo" class="container py-5">
      <section class="search-card">
        <div class="search-copy">
          <span class="eyebrow">Tasas municipales</span>
          <h1>Descargá tus boletas de tasa automotor</h1>
          <p>Consultá los períodos disponibles y descargá las boletas de pago.</p>
        </div>
        <form class="domain-form" @submit.prevent="buscar">
          <label for="dominio">
            <i class="bi bi-caret-right-fill" aria-hidden="true"></i>
            Ingresá el dominio de tu vehículo sin espacios
            <button
              type="button"
              class="help-btn"
              title="Ejemplo: ABC123 o AB123CD. Sin espacios ni guiones."
              aria-label="Ayuda sobre el dominio"
            >
              <i class="bi bi-question-circle"></i>
            </button>
          </label>
          <div class="domain-input">
            <i class="bi bi-car-front-fill"></i>
            <input
              id="dominio"
              v-model="dominio"
              maxlength="9"
              autocomplete="off"
              placeholder="AB123CD"
              :disabled="buscando || descargando"
              @input="normalizarDominio"
            >
          </div>
          <button class="btn btn-search" type="submit" :disabled="!dominioValido || buscando || descargando">
            <b-spinner v-if="buscando" small class="mr-2"></b-spinner>
            <i v-else class="bi bi-download mr-2"></i>
            {{ buscando ? 'Buscando...' : 'Buscar boletas' }}
          </button>
        </form>
      </section>

      <b-alert v-if="mensajeError && !showDominioNoEncontrado" show variant="danger" class="result-alert">
        <i class="bi bi-exclamation-circle-fill mr-2"></i>{{ mensajeError }}
      </b-alert>

      <section v-if="resultado" class="periods-card">
        <div class="vehicle-heading">
          <div class="vehicle-icon"><i class="bi bi-car-front-fill"></i></div>
          <div class="vehicle-copy">
            <span>Dominio</span>
            <h2>{{ resultado.dominio }}</h2>
            <p v-if="descripcionVehiculo">{{ descripcionVehiculo }}</p>
          </div>
          <button class="btn btn-other-domain" type="button" :disabled="descargando" @click="limpiar">
            <i class="bi bi-search mr-2"></i>
            Buscar otro dominio
          </button>
        </div>

        <div ref="periodosSection" class="periods-body">
          <div class="periods-heading">
            <h3>Seleccioná los períodos a descargar</h3>
            <p>Podés seleccionar hasta {{ maxPeriodosSeleccionados }} períodos a la vez.</p>
          </div>

          <div class="period-toolbar">
            <b-form-select v-model="ordenCampo" size="sm" :disabled="descargando">
              <option value="periodo">Ordenar por período</option>
              <option value="importe">Ordenar por importe</option>
            </b-form-select>
            <button
              class="btn btn-sort"
              type="button"
              :disabled="descargando"
              :title="ordenDescendente ? 'Orden descendente' : 'Orden ascendente'"
              @click="ordenDescendente = !ordenDescendente"
            >
              <i :class="ordenDescendente ? 'bi bi-sort-down' : 'bi bi-sort-up'"></i>
            </button>
            <label class="select-all" :class="{ disabled: descargando }">
              <input
                type="checkbox"
                :checked="todosSeleccionados"
                :disabled="descargando"
                @change="seleccionarTodos($event.target.checked)"
              >
              Seleccionar todos
            </label>
          </div>

          <div class="period-grid">
            <label
              v-for="periodo in periodosPaginados"
              :key="periodo.periodo"
              class="period-card"
              :class="{ selected: seleccionados.includes(periodo.periodo), disabled: descargando }"
            >
              <input
                type="checkbox"
                :checked="seleccionados.includes(periodo.periodo)"
                :disabled="descargando"
                @change="cambiarSeleccion(periodo.periodo, $event.target.checked)"
              >
              <div class="period-main">
                <span>Cuota {{ String(periodo.cuota).padStart(2, '0') }}</span>
                <strong>{{ periodo.periodo }}</strong>
                <small>Consultá el vencimiento una vez descargada la boleta</small>
              </div>
              <div class="period-amount">
                <span>Importe</span>
                <strong>{{ formatMoney(periodo.importeCentavos) }}</strong>
              </div>
            </label>
          </div>

          <div v-if="paginasPeriodos > 1" class="period-pagination">
            <span>Mostrando {{ primeraFilaPeriodo }}-{{ ultimaFilaPeriodo }} de {{ periodosOrdenados.length }}</span>
            <b-pagination
              v-model="paginaPeriodos"
              :total-rows="periodosOrdenados.length"
              :per-page="periodosPorPagina"
              size="sm"
              class="mb-0"
            ></b-pagination>
          </div>
        </div>

        <div class="download-bar">
          <div>
            <strong>{{ seleccionados.length }} de {{ maxPeriodosSeleccionados }} períodos seleccionados</strong>
            <span>Las boletas se descargarán en un único archivo pdf y podrá incluir hasta dos talones de pago por página.</span>
          </div>
          <div class="download-actions">
            <button class="btn btn-download" :disabled="!seleccionados.length || descargando" @click="descargar">
              <b-spinner v-if="descargando" small class="mr-2"></b-spinner>
              <i v-else class="bi bi-download mr-2"></i>
              {{ descargando ? 'Generando PDF...' : 'Descargar boleta' }}
            </button>
            <a class="btn btn-pay" href="http://arvige.gob.ar/lpagos">
              Ir a pagar
            </a>
          </div>
        </div>
      </section>

      <div class="page-btn-volver-wrap">
        <NuxtLink to="/tasas">
          <b-button variant="primary" size="sm" class="page-btn-volver" :disabled="buscando || descargando">
            Volver
          </b-button>
        </NuxtLink>
      </div>
    </main>
    <main v-else class="container py-5">
      <section class="search-card unavailable-card">
        <div class="search-copy">
          <span class="eyebrow">Tasas municipales</span>
          <h1>Servicio no disponible</h1>
          <p>La descarga de tasa automotor no se encuentra disponible en este momento.</p>
        </div>
        <div class="page-btn-volver-wrap">
          <NuxtLink to="/tasas">
            <b-button variant="primary" size="sm" class="page-btn-volver">Volver</b-button>
          </NuxtLink>
        </div>
      </section>
    </main>

    <b-modal
      :model-value="operacionActiva"
      centered
      hide-header
      hide-footer
      no-header-close
      no-close-on-backdrop
      no-close-on-esc
      modal-class="automotor-wait-modal"
    >
      <div class="wait-dialog">
        <div class="wait-dialog-bar">
          <button type="button" class="btn-close btn-close-white" aria-label="Cerrar" disabled></button>
        </div>
        <div class="wait-content" role="status" aria-live="polite">
          <b-spinner
            class="wait-spinner"
            variant="success"
            label="Esperando respuesta del servidor"
          ></b-spinner>
          <h3>{{ mensajeEspera }}</h3>
          <p>{{ detalleEspera }}</p>
          <small>No cierres esta ventana mientras completamos la operación</small>
        </div>
      </div>
    </b-modal>

    <b-modal
      v-model="showDominioNoEncontrado"
      centered
      :header-bg-variant="'danger'"
      @click-outside="showDominioNoEncontrado = false"
    >
      <template #header>
        <div class="centeredContainer">
          <h3><i class="bi bi-exclamation-octagon text-light"></i></h3>
        </div>
      </template>
      <div class="centeredContainer modal-error">
        <p class="modal-subtitle">No hemos podido encontrar tu dominio</p>
        <p>El dominio ingresado no se encuentra disponible en el sistema</p>
        <p class="minitext">
          Si tenés dudas o necesitás verificar la información, comunicate con el Dto. Recaudaciones:
          <a class="icon-green" href="mailto:recaudaciones@gesell.gob.ar">recaudaciones@gesell.gob.ar</a>
        </p>
      </div>
      <template #footer>
        <div style="margin: auto">
          <b-button variant="danger" class="btn-cancel" @click="showDominioNoEncontrado = false">Aceptar</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script setup>
useHead({ title: 'Tasa Automotor - Hacienda Villa Gesell' })
</script>

<script>
const PERIODOS_POR_PAGINA = 12

export default {
  name: 'TasaAutomotor',
  data() {
    return {
      dominio: '',
      buscando: false,
      descargando: false,
      mensajeError: '',
      resultado: null,
      seleccionados: [],
      ordenCampo: 'periodo',
      ordenDescendente: false,
      paginaPeriodos: 1,
      periodosPorPagina: PERIODOS_POR_PAGINA,
      maxPeriodosSeleccionados: 20,
      tasaAutomotorPublicaHabilitada: true,
      showDominioNoEncontrado: false,
    }
  },
  computed: {
    dominioValido() {
      return /^[A-Z0-9]{5,9}$/.test(this.dominio)
    },
    usuarioInternoBoletas() {
      const role = String(useUserStore().admin || '').trim().toLowerCase()
      return ['admin', 'master', 'true', 'boletas'].includes(role)
    },
    puedeVerModulo() {
      return this.usuarioInternoBoletas || this.tasaAutomotorPublicaHabilitada
    },
    descripcionVehiculo() {
      if (!this.resultado) return ''
      const vehiculo = this.resultado.vehiculo || {}
      return [vehiculo.marca, vehiculo.modelo, vehiculo.anioModelo].filter(Boolean).join(' - ')
    },
    todosSeleccionados() {
      return Boolean(this.resultado && this.seleccionados.length === Math.min(this.resultado.periodos.length, this.maxPeriodosSeleccionados))
    },
    operacionActiva() {
      return this.buscando || this.descargando
    },
    mensajeEspera() {
      return this.descargando ? 'Estamos generando tu archivo PDF' : 'Estamos buscando los períodos disponibles'
    },
    detalleEspera() {
      return this.descargando
        ? `Preparando ${this.seleccionados.length} ${this.seleccionados.length === 1 ? 'boleta' : 'boletas'}`
        : `Consultando boleta para el dominio ${this.dominio}`
    },
    periodosOrdenados() {
      if (!this.resultado) return []
      return [...this.resultado.periodos].sort((a, b) => {
        const comparison = this.ordenCampo === 'importe'
          ? a.importeCentavos - b.importeCentavos
          : ((a.anio * 100) + a.cuota) - ((b.anio * 100) + b.cuota)
        return this.ordenDescendente ? -comparison : comparison
      })
    },
    periodosPaginados() {
      const start = (this.paginaPeriodos - 1) * this.periodosPorPagina
      return this.periodosOrdenados.slice(start, start + this.periodosPorPagina)
    },
    paginasPeriodos() {
      return Math.ceil(this.periodosOrdenados.length / this.periodosPorPagina)
    },
    primeraFilaPeriodo() {
      return this.periodosOrdenados.length ? ((this.paginaPeriodos - 1) * this.periodosPorPagina) + 1 : 0
    },
    ultimaFilaPeriodo() {
      return Math.min(this.paginaPeriodos * this.periodosPorPagina, this.periodosOrdenados.length)
    }
  },
  watch: {
    ordenCampo() {
      this.paginaPeriodos = 1
    },
    ordenDescendente() {
      this.paginaPeriodos = 1
    }
  },
  mounted() {
    this.loadTasaAutomotorConfig()
  },
  methods: {
    async loadTasaAutomotorConfig() {
      try {
        const response = await this.$axios.get('/tasas/automotores/configuracion')
        this.tasaAutomotorPublicaHabilitada = response.data.data.habilitada !== false
      } catch (_) {
        this.tasaAutomotorPublicaHabilitada = true
      }
    },
    normalizarDominio() {
      this.dominio = this.dominio.replace(/[\s-]/g, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    },
    usuarioActividad() {
      return useUserStore().username || 'Usuario Anónimo'
    },
    async buscar() {
      if (!this.puedeVerModulo) return
      if (!this.dominioValido) return
      this.buscando = true
      this.mensajeError = ''
      this.showDominioNoEncontrado = false
      this.resultado = null
      this.seleccionados = []
      try {
        await this.$logUserActivity(
          this.usuarioActividad(),
          'Consulta de Tasa Automotor',
          `Consulta de dominio ${this.dominio}`
        )
        const response = await this.$axios.get(`/tasas/automotores/${this.dominio}`, { headers: this.authHeaders() })
        this.resultado = response.data.data
        this.maxPeriodosSeleccionados = this.resultado.maxPeriodosPorDescarga || 20
        this.seleccionados = []
        this.paginaPeriodos = 1
        this.$nextTick(() => {
          this.$refs.periodosSection?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        })
      } catch (error) {
        if (error.response?.status === 404) {
          this.showDominioNoEncontrado = true
          this.mensajeError = ''
        } else {
          this.mensajeError = error.response?.data?.message || 'No se pudieron consultar las boletas.'
        }
      } finally {
        this.buscando = false
      }
    },
    seleccionarTodos(value) {
      this.seleccionados = value
        ? this.periodosOrdenados.slice(0, this.maxPeriodosSeleccionados).map(item => item.periodo)
        : []
      if (value && this.resultado.periodos.length > this.maxPeriodosSeleccionados) this.mostrarLimiteSeleccion()
    },
    cambiarSeleccion(periodo, checked) {
      if (!checked) {
        this.seleccionados = this.seleccionados.filter(item => item !== periodo)
        return
      }
      if (this.seleccionados.length >= this.maxPeriodosSeleccionados) {
        this.mostrarLimiteSeleccion()
        return
      }
      this.seleccionados = [...this.seleccionados, periodo]
    },
    mostrarLimiteSeleccion() {
      this.showToast(
        `Podés descargar hasta ${this.maxPeriodosSeleccionados} períodos por vez. Desmarcá alguno para seleccionar otro.`,
        { title: 'Límite de períodos alcanzado', variant: 'warning', solid: true, autoHideDelay: 7000 }
      )
    },
    limpiar() {
      this.resultado = null
      this.seleccionados = []
      this.mensajeError = ''
      this.showDominioNoEncontrado = false
      this.dominio = ''
      this.paginaPeriodos = 1
    },
    async descargar() {
      if (!this.puedeVerModulo) return
      if (!this.seleccionados.length) return
      if (this.seleccionados.length > this.maxPeriodosSeleccionados) {
        this.mensajeError = `Seleccionaste ${this.seleccionados.length} períodos. El máximo permitido por descarga es ${this.maxPeriodosSeleccionados}.`
        return
      }
      this.descargando = true
      this.mensajeError = ''
      try {
        await this.$logUserActivity(
          this.usuarioActividad(),
          'Descarga de Tasa Automotor',
          `Descarga de dominio ${this.resultado.dominio} (${this.seleccionados.join(', ')})`
        )
        const response = await this.$axios.post(
          `/tasas/automotores/${this.resultado.dominio}/pdf`,
          { periodos: this.seleccionados },
          { responseType: 'blob', headers: this.authHeaders() }
        )
        const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
        const link = document.createElement('a')
        link.href = url
        link.download = `tasa-automotor-${this.resultado.dominio}.pdf`
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        this.showToast('El PDF fue generado y la descarga debería comenzar automáticamente.', {
          title: 'Descarga preparada',
          variant: 'success',
          solid: true
        })
      } catch (error) {
        this.mensajeError = error.response?.data?.message || 'No se pudo generar el PDF. Volvé a intentarlo.'
      } finally {
        this.descargando = false
      }
    },
    formatMoney(centavos) {
      return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format((centavos || 0) / 100)
    },
    authHeaders() {
      const token = useUserStore().token
      return token ? { Authorization: `Bearer ${token}` } : {}
    }
  }
}
</script>

<style scoped>
.automotor-page {
  min-height: 100vh;
}
.search-card,
.periods-card {
  max-width: 1040px;
  margin: 0 auto;
  border-radius: 24px;
  background: var(--color-white);
  box-shadow: 0px 2px 5px 0px var(--shadow-card);
}
.search-card {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 3rem;
  align-items: center;
  padding: 2.75rem 3rem;
  margin: 0 auto 1.5rem;
}
.unavailable-card {
  grid-template-columns: 1fr;
}
.eyebrow {
  color: #0c681a;
  font-size: 0.8rem;
  font-weight: 700;
}
.search-copy h1 {
  margin: 0.45rem 0 0.75rem;
  color: #0c681a;
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.2;
}
.search-copy p,
.periods-heading p,
.vehicle-copy p {
  margin: 0;
  color: #666;
}
.domain-form label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.65rem;
  color: #353535;
  font-weight: 600;
}
.domain-form label .bi-caret-right-fill {
  color: #E27910;
  font-size: 0.85rem;
}
.help-btn {
  display: inline-flex;
  padding: 0;
  border: 0;
  background: transparent;
  color: #6c757d;
  line-height: 1;
}
.domain-input {
  display: flex;
  align-items: center;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  background: var(--color-white);
}
.domain-input:focus-within {
  border-color: #0c681a;
  box-shadow: 0 0 0 3px var(--green-fill);
}
.domain-input i {
  padding-left: 0.9rem;
  color: #0c681a;
  font-size: 1.15rem;
}
.domain-input input {
  width: 100%;
  border: 0;
  outline: 0;
  padding: 0.85rem 0.9rem;
  background: transparent;
  color: #353535;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.btn-search,
.btn-other-domain {
  border: 0;
  border-radius: 10px;
  color: var(--color-white);
  font-weight: 700;
}
.btn-search {
  width: 100%;
  margin-top: 0.85rem;
  padding: 0.75rem 1rem;
  background: #19a02d;
}
.btn-other-domain {
  background: #0c681a;
}
.btn-search:hover {
  background: #0c681a;
  color: var(--color-white);
}
.btn-other-domain:hover {
  background: #0c681a;
  color: var(--color-white);
  filter: brightness(0.95);
}
.result-alert {
  max-width: 1040px;
  margin: 1.5rem auto 0;
  border-radius: 12px;
}
.periods-card {
  overflow: hidden;
}
.vehicle-heading {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: var(--green-fill);
}
.vehicle-copy span {
  color: #666;
  font-size: 0.75rem;
}
.vehicle-copy h2 {
  margin: 0;
  color: #0c681a;
  font-weight: 800;
  letter-spacing: 0.06em;
}
.vehicle-copy p {
  font-size: 0.85rem;
  text-transform: uppercase;
}
.vehicle-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: var(--color-white);
  background: #0c681a;
  font-size: 1.4rem;
}
.btn-other-domain {
  margin-left: auto;
  padding: 0.55rem 1rem;
  white-space: nowrap;
}
.periods-body {
  padding: 1.75rem 2rem 1.5rem;
}
.periods-heading h3 {
  margin: 0 0 0.35rem;
  color: #0c681a;
  font-weight: 800;
}
.period-toolbar {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin: 1.25rem 0 1rem;
}
.period-toolbar .form-select,
.period-toolbar :deep(.form-select) {
  width: 220px;
  border: 1px solid #6c757d;
  border-radius: 8px;
}
.btn-sort {
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid #0c681a;
  border-radius: 8px;
  color: #0c681a;
  background: var(--color-white);
}
.select-all {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0 0 0 auto;
  padding: 0.45rem 0.85rem;
  border: 1px solid #6c757d;
  border-radius: 8px;
  background: #dee2e6;
  color: #6c757d;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}
.select-all.disabled {
  cursor: wait;
  opacity: 0.7;
}
.select-all input {
  accent-color: #0c681a;
}
.period-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.85rem;
}
.period-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: start;
  gap: 0.85rem;
  margin: 0;
  padding: 1rem 1.1rem;
  border: 1px solid #6c757d;
  border-radius: 12px;
  cursor: pointer;
  font-family: var(--font-montserrat);
}
.period-card:hover,
.period-card.selected {
  border-color: #0c681a;
}
.period-card.selected {
  background: var(--green-fill);
}
.period-card.disabled {
  cursor: wait;
  opacity: 0.7;
}
.period-card input {
  margin-top: 0.2rem;
  accent-color: #0c681a;
}
.period-main,
.period-amount {
  display: flex;
  flex-direction: column;
}
.period-main span,
.period-amount span,
.period-main small {
  color: #666;
  font-size: 0.75rem;
}
.period-main strong {
  color: #0c681a;
  font-size: 1.15rem;
  font-weight: 800;
}
.period-main small {
  margin-top: 0.35rem;
}
.period-amount {
  text-align: right;
}
.period-amount strong {
  color: #0c681a;
  font-weight: 800;
}
.period-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
  color: #666;
  font-size: 0.78rem;
}
.download-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.35rem 2rem;
  background: #0c681a;
  color: var(--color-white);
}
.download-bar > div:first-child {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.download-bar strong {
  font-size: 1.05rem;
}
.download-bar span {
  color: var(--color-white);
  font-size: 0.82rem;
  opacity: 0.9;
}
.download-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.btn-download,
.btn-pay {
  padding: 0.7rem 1.15rem;
  border: 0;
  border-radius: 8px;
  color: var(--color-white);
  background: #E27910;
  font-weight: 700;
  white-space: nowrap;
}
.btn-download:hover,
.btn-pay:hover {
  color: var(--color-white);
  background: #E27910;
  filter: brightness(0.95);
}
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
@media (max-width: 767px) {
  .search-card {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  .vehicle-heading,
  .periods-body,
  .download-bar {
    padding: 1.25rem;
  }
  .vehicle-heading {
    flex-wrap: wrap;
  }
  .btn-other-domain {
    width: 100%;
    margin-left: 0;
  }
  .period-toolbar,
  .download-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .period-toolbar .form-select,
  .period-toolbar :deep(.form-select),
  .select-all {
    width: 100%;
    margin-left: 0;
  }
  .period-grid {
    grid-template-columns: 1fr;
  }
  .download-actions {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

<style>
.automotor-wait-modal .modal-content {
  overflow: hidden;
  border: 0;
  border-radius: 16px;
  box-shadow: 0px 2px 5px 0px var(--shadow-card);
}
.automotor-wait-modal .modal-header,
.automotor-wait-modal .modal-content > .btn-close {
  display: none;
}
.automotor-wait-modal .modal-body { padding: 0; }
.wait-dialog-bar {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  min-height: 3.15rem;
  padding: 0.45rem 0.85rem;
  background: #19a02d;
}
.wait-dialog-bar .btn-close { justify-self: end; }
.wait-content {
  padding: 1.75rem 1.6rem 1.7rem;
  text-align: center;
  font-family: var(--font-inter);
}
.wait-spinner {
  width: 2.75rem;
  height: 2.75rem;
  margin: 0.35rem auto 1.15rem;
  color: #19a02d;
}
.wait-content h3 {
  margin: 0 auto 0.85rem;
  max-width: 22rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #dee2e6;
  color: #0c681a;
  font-family: var(--font-montserrat);
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.25;
}
.wait-content p {
  margin: 0 0 0.85rem;
  color: #353535;
  font-size: 0.9rem;
  font-weight: 600;
}
.wait-content small {
  display: block;
  max-width: 16rem;
  margin: 0 auto;
  color: #666;
  font-size: 0.8rem;
  line-height: 1.4;
}
.automotor-page .modal-error {
  text-align: center;
}
.automotor-page .modal-error .modal-subtitle {
  margin-bottom: 15px;
  color: #cc0025 !important;
  font-size: 1.25rem;
  font-weight: 700;
}
.automotor-page .modal-error p {
  padding: 0 1rem;
  color: var(--color-dark, #353535);
  font-weight: 500;
}
.automotor-page .modal-error .minitext {
  font-size: 0.8rem;
  font-weight: 400;
  color: #666;
}
.automotor-page .modal-error .icon-green {
  display: block;
  margin-top: 0.35rem;
  color: #0c681a;
}
.automotor-page .centeredContainer {
  margin: 0 auto;
  text-align: center;
}
</style>
