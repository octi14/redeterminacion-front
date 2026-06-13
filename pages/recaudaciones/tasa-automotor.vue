<template>
  <div class="page main-background automotor-page">
    <Banner title="Descargar Tasa Automotor" />

    <main class="container py-5">
      <section class="search-card">
        <div class="search-copy">
          <span class="eyebrow">Boletas de Automotores</span>
          <h1>Consultá tus períodos disponibles</h1>
          <p>Ingresá el dominio sin espacios. Después podrás elegir qué boletas descargar.</p>
        </div>
        <form class="domain-form" @submit.prevent="buscar">
          <label for="dominio">Dominio del vehículo</label>
          <div class="domain-input">
            <i class="bi bi-car-front-fill"></i>
            <input
              id="dominio"
              v-model="dominio"
              maxlength="9"
              autocomplete="off"
              placeholder="Ejemplo: AB123CD"
              :disabled="buscando || descargando"
              @input="normalizarDominio"
            >
          </div>
          <button class="btn btn-search" type="submit" :disabled="!dominioValido || buscando || descargando">
            <b-spinner v-if="buscando" small class="mr-2"></b-spinner>
            <i v-else class="bi bi-search mr-2"></i>
            {{ buscando ? 'Buscando...' : 'Buscar boletas' }}
          </button>
        </form>
      </section>

      <b-alert v-if="mensajeError" show variant="danger" class="result-alert">
        <i class="bi bi-exclamation-circle-fill mr-2"></i>{{ mensajeError }}
      </b-alert>

      <section v-if="resultado" class="periods-card">
        <div class="vehicle-heading">
          <div class="vehicle-icon"><i class="bi bi-car-front-fill"></i></div>
          <div>
            <span>Dominio</span>
            <h2>{{ resultado.dominio }}</h2>
            <p>{{ descripcionVehiculo }}</p>
          </div>
          <button class="btn btn-link" type="button" :disabled="descargando" @click="limpiar">
            Buscar otro dominio
          </button>
        </div>

        <div class="periods-heading">
          <div>
            <h3>Seleccioná los períodos</h3>
            <p>Podés seleccionar hasta {{ maxPeriodosSeleccionados }} períodos. El PDF incluirá hasta dos boletas por página.</p>
          </div>
          <b-form-checkbox
            :checked="todosSeleccionados"
            :indeterminate="algunosSeleccionados"
            :disabled="descargando"
            @change="seleccionarTodos"
          >
            {{ resultado.periodos.length > maxPeriodosSeleccionados ? 'Seleccionar máximo permitido' : 'Seleccionar todos' }}
          </b-form-checkbox>
        </div>

        <div class="period-toolbar">
          <b-form-select v-model="ordenCampo" size="sm" :disabled="descargando">
            <option value="periodo">Ordenar por período</option>
            <option value="importe">Ordenar por importe</option>
          </b-form-select>
          <button class="btn btn-outline-success btn-sm" type="button" :disabled="descargando" @click="ordenDescendente = !ordenDescendente">
            <i :class="ordenDescendente ? 'bi bi-sort-down' : 'bi bi-sort-up'"></i>
            {{ ordenDescendente ? 'Descendente' : 'Ascendente' }}
          </button>
          <span>{{ periodosOrdenados.length }} períodos disponibles</span>
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
            <div class="period-check"><i class="bi bi-check-lg"></i></div>
            <div class="period-main">
              <span>Cuota {{ String(periodo.cuota).padStart(2, '0') }}</span>
              <strong>{{ periodo.periodo }}</strong>
            </div>
            <div class="period-amount">
              <span>Importe</span>
              <strong>{{ formatMoney(periodo.importeCentavos) }}</strong>
            </div>
            <small>{{ vencimientoLabel(periodo) }}</small>
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

        <div class="download-bar">
          <div>
            <strong>{{ seleccionados.length }} de {{ maxPeriodosSeleccionados }} {{ seleccionados.length === 1 ? 'período seleccionado' : 'períodos seleccionados' }}</strong>
            <span>Se descargará un único archivo PDF.</span>
          </div>
          <button class="btn btn-download" :disabled="!seleccionados.length || descargando" @click="descargar">
            <b-spinner v-if="descargando" small class="mr-2"></b-spinner>
            <i v-else class="bi bi-file-earmark-pdf-fill mr-2"></i>
            {{ descargando ? 'Generando PDF...' : 'Descargar boletas' }}
          </button>
        </div>
      </section>

      <div class="text-center mt-4">
        <b-button variant="primary" :disabled="buscando || descargando" @click="$router.push('/recaudaciones')">Volver</b-button>
      </div>
    </main>

    <b-modal
      :visible="operacionActiva"
      centered
      hide-header
      hide-footer
      no-close-on-backdrop
      no-close-on-esc
      modal-class="automotor-wait-modal"
    >
      <div class="wait-content" role="status" aria-live="polite">
        <div class="wait-spinner">
          <b-spinner label="Esperando respuesta del servidor"></b-spinner>
        </div>
        <span class="eyebrow">{{ descargando ? 'Preparando descarga' : 'Consultando boletas' }}</span>
        <h3>{{ mensajeEspera }}</h3>
        <p>{{ detalleEspera }}</p>
        <b-progress :value="100" animated height="7px"></b-progress>
        <small>No cierres esta ventana mientras completamos la operación.</small>
      </div>
    </b-modal>
  </div>
</template>

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
      maxPeriodosSeleccionados: 20
    }
  },
  computed: {
    dominioValido() {
      return /^[A-Z0-9]{5,9}$/.test(this.dominio)
    },
    descripcionVehiculo() {
      if (!this.resultado) return ''
      const vehiculo = this.resultado.vehiculo || {}
      return [vehiculo.marca, vehiculo.modelo, vehiculo.anioModelo].filter(Boolean).join(' · ')
    },
    todosSeleccionados() {
      return Boolean(this.resultado && this.seleccionados.length === Math.min(this.resultado.periodos.length, this.maxPeriodosSeleccionados))
    },
    algunosSeleccionados() {
      return this.seleccionados.length > 0 && !this.todosSeleccionados
    },
    operacionActiva() {
      return this.buscando || this.descargando
    },
    mensajeEspera() {
      return this.descargando ? 'Estamos generando tu archivo PDF' : 'Estamos buscando los períodos disponibles'
    },
    detalleEspera() {
      return this.descargando
        ? `Preparando ${this.seleccionados.length} ${this.seleccionados.length === 1 ? 'boleta' : 'boletas'}. Esto puede demorar unos segundos.`
        : `Consultando el dominio ${this.dominio}.`
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
  methods: {
    normalizarDominio() {
      this.dominio = this.dominio.replace(/[\s-]/g, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    },
    async buscar() {
      if (!this.dominioValido) return
      this.buscando = true
      this.mensajeError = ''
      this.resultado = null
      this.seleccionados = []
      try {
        const response = await this.$axios.get(`/tasas/automotores/${this.dominio}`)
        this.resultado = response.data.data
        this.maxPeriodosSeleccionados = this.resultado.maxPeriodosPorDescarga || 20
        this.seleccionados = []
        this.paginaPeriodos = 1
      } catch (error) {
        this.mensajeError = error.response?.data?.message || 'No se pudieron consultar las boletas.'
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
      this.$bvToast.toast(
        `Podés descargar hasta ${this.maxPeriodosSeleccionados} períodos por vez. Desmarcá alguno para seleccionar otro.`,
        { title: 'Límite de períodos alcanzado', variant: 'warning', solid: true, autoHideDelay: 7000 }
      )
    },
    limpiar() {
      this.resultado = null
      this.seleccionados = []
      this.mensajeError = ''
      this.dominio = ''
      this.paginaPeriodos = 1
    },
    async descargar() {
      if (!this.seleccionados.length) return
      if (this.seleccionados.length > this.maxPeriodosSeleccionados) {
        this.mensajeError = `Seleccionaste ${this.seleccionados.length} períodos. El máximo permitido por descarga es ${this.maxPeriodosSeleccionados}.`
        return
      }
      this.descargando = true
      this.mensajeError = ''
      try {
        const response = await this.$axios.post(
          `/tasas/automotores/${this.resultado.dominio}/pdf`,
          { periodos: this.seleccionados },
          { responseType: 'blob' }
        )
        const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
        const link = document.createElement('a')
        link.href = url
        link.download = `tasa-automotor-${this.resultado.dominio}.pdf`
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        this.$bvToast.toast('El PDF fue generado y la descarga debería comenzar automáticamente.', {
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
    vencimientoLabel(periodo) {
      const first = periodo.vencimientos && periodo.vencimientos.find(item => item.orden === 1)
      if (!first) return 'Consultar vencimiento en la boleta'
      return `1er vencimiento: ${new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC' }).format(new Date(first.fecha))}`
    }
  }
}
</script>

<style scoped>
.automotor-page { min-height: 100vh; }
.search-card, .periods-card { max-width: 1040px; margin: 0 auto; border-radius: 24px; background: white; box-shadow: 0 18px 55px rgba(23, 74, 58, .12); }
.search-card { display: grid; grid-template-columns: 1.15fr .85fr; gap: 3rem; padding: 3rem; background: linear-gradient(135deg, #fff 60%, #edf8f3); }
.eyebrow { color: #16805e; font-size: .75rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.search-copy h1 { margin: .6rem 0 1rem; color: #173e32; font-weight: 800; }
.search-copy p, .periods-heading p, .vehicle-heading p { margin: 0; color: #71837d; }
.domain-form label { color: #264b40; font-weight: 700; }
.domain-input { display: flex; align-items: center; border: 2px solid #dcebe5; border-radius: 14px; background: white; transition: .2s; }
.domain-input:focus-within { border-color: #14835e; box-shadow: 0 0 0 4px rgba(20, 131, 94, .1); }
.domain-input i { padding-left: 1rem; color: #14835e; font-size: 1.25rem; }
.domain-input input { width: 100%; border: 0; outline: 0; padding: .95rem; background: transparent; color: #173e32; font-size: 1.2rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.btn-search, .btn-download { border: 0; border-radius: 12px; color: white; background: linear-gradient(135deg, #14835e, #075e4a); font-weight: 700; }
.btn-search { width: 100%; margin-top: 1rem; padding: .85rem; }
.result-alert { max-width: 1040px; margin: 1.5rem auto 0; border-radius: 12px; }
.periods-card { margin-top: 2rem; overflow: hidden; }
.vehicle-heading { display: flex; align-items: center; gap: 1rem; padding: 2rem 2.5rem; background: #f1f9f5; }
.vehicle-heading h2 { margin: 0; color: #173e32; font-weight: 800; letter-spacing: .08em; }
.vehicle-heading .btn { margin-left: auto; color: #147a59; font-weight: 700; }
.vehicle-icon { width: 62px; height: 62px; display: grid; place-items: center; border-radius: 18px; color: white; background: #14835e; font-size: 1.7rem; }
.periods-heading { display: flex; justify-content: space-between; align-items: center; padding: 2rem 2.5rem 1rem; }
.periods-heading h3 { margin: 0 0 .25rem; color: #173e32; font-weight: 800; }
.period-toolbar, .period-pagination { display: flex; align-items: center; justify-content: flex-end; gap: .65rem; padding: 0 2.5rem 1rem; }
.period-toolbar .custom-select { width: 190px; }
.period-toolbar span, .period-pagination span { margin-right: auto; color: #71837d; font-size: .78rem; font-weight: 700; }
.period-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; padding: 1rem 2.5rem 2.5rem; }
.period-card { position: relative; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 1rem; margin: 0; padding: 1.15rem; border: 2px solid #e3eee9; border-radius: 16px; cursor: pointer; transition: .2s; }
.period-card:hover, .period-card.selected { border-color: #16805e; background: #f3fbf7; transform: translateY(-2px); }
.period-card.disabled { cursor: wait; opacity: .7; }
.period-card input { position: absolute; opacity: 0; }
.period-check { width: 28px; height: 28px; display: grid; place-items: center; border: 2px solid #cadbd4; border-radius: 8px; color: transparent; }
.period-card.selected .period-check { border-color: #16805e; color: white; background: #16805e; }
.period-main, .period-amount { display: flex; flex-direction: column; }
.period-main span, .period-amount span, .period-card small { color: #7d8e88; font-size: .75rem; }
.period-main strong, .period-amount strong { color: #24483d; }
.period-amount { text-align: right; }
.period-card small { grid-column: 2 / 4; }
.period-pagination { justify-content: space-between; border-top: 1px solid #e8f0ec; padding-top: 1rem; }
.download-bar { display: flex; justify-content: space-between; align-items: center; padding: 1.4rem 2.5rem; background: #173e32; color: white; }
.download-bar div { display: flex; flex-direction: column; }
.download-bar span { color: #b9d0c7; font-size: .85rem; }
.btn-download { padding: .8rem 1.25rem; background: #ef8918; }
.btn:disabled { cursor: not-allowed; opacity: .6; }
@media (max-width: 767px) {
  .search-card { grid-template-columns: 1fr; gap: 1.5rem; padding: 1.5rem; }
  .vehicle-heading, .periods-heading, .download-bar { align-items: flex-start; padding: 1.25rem; }
  .vehicle-heading { flex-wrap: wrap; }
  .vehicle-heading .btn { width: 100%; margin-left: 0; padding-left: 0; text-align: left; }
  .periods-heading, .download-bar { flex-direction: column; gap: 1rem; }
  .period-toolbar, .period-pagination { align-items: stretch; flex-direction: column; padding: 0 1.25rem 1rem; }
  .period-toolbar .custom-select, .period-toolbar .btn { width: 100%; }
  .period-grid { grid-template-columns: 1fr; padding: 1rem 1.25rem 1.5rem; }
  .btn-download { width: 100%; }
}
</style>

<style>
.automotor-wait-modal .modal-content { overflow: hidden; border: 0; border-radius: 22px; box-shadow: 0 28px 75px rgba(15, 50, 40, .25); }
.automotor-wait-modal .modal-body { padding: 0; }
.wait-content { padding: 2.5rem; color: #173e32; text-align: center; }
.wait-spinner { width: 82px; height: 82px; margin: 0 auto 1.25rem; display: grid; place-items: center; border-radius: 50%; color: #14835e; background: #e3f6ee; }
.wait-spinner .spinner-border { width: 2.7rem; height: 2.7rem; }
.wait-content h3 { margin: .65rem 0; font-weight: 800; }
.wait-content p { margin-bottom: 1.4rem; color: #71837d; }
.wait-content small { display: block; margin-top: .8rem; color: #84938e; }
</style>
