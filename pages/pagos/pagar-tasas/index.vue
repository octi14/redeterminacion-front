<template>
  <div class="page main-background urbana-page">
    <Banner title="Pagos" />

    <main
      class="container py-5 urbana-main"
      :class="{ 'urbana-main--compact': !(deuda && itemsPagables.length) }"
    >
      <section v-if="puedeAcceder" class="urbana-card">
        <header class="urbana-header">
          <h1>Pago online de tasas</h1>
          <p>
            Consultá el saldo, completá los datos del pagador y continuá con el pago.
          </p>
        </header>

        <b-form
          class="urbana-form"
          :class="{ 'urbana-form--consulta': !(deuda && itemsPagables.length) }"
          @submit.prevent="iniciarPago"
        >
          <div class="form-section">
            <h2>Datos de la cuenta</h2>
            <div class="tasa-tabs" role="tablist" aria-label="Tipo de tasa">
              <button
                v-for="opcion in tipoTasaOptions"
                :key="opcion.value"
                type="button"
                class="tasa-tab"
                :class="{ active: tipoTasa === opcion.value }"
                role="tab"
                :aria-selected="tipoTasa === opcion.value"
                @click="seleccionarTipoTasa(opcion.value)"
              >
                <i :class="opcion.value === 'AUTOMOTORES' ? 'bi bi-car-front-fill' : 'bi bi-house-door-fill'" aria-hidden="true"></i>
                {{ opcion.text }}
              </button>
            </div>
            <b-form-group :label="identificadorLabel + ' *'" label-for="objetoClave" class="mb-0">
              <div class="clave-row">
                <b-form-input
                  id="objetoClave"
                  v-model="objetoClave"
                  required
                  autocomplete="off"
                  :placeholder="identificadorPlaceholder"
                  @input="normalizarClave"
                  @blur="consultarDeuda"
                />
                <b-button
                  variant="success"
                  :disabled="consultando || !claveValida"
                  @click="consultarDeuda"
                >
                  <b-spinner v-if="consultando" small></b-spinner>
                  <span v-else>Consultar</span>
                </b-button>
              </div>
            </b-form-group>
          </div>

          <div v-if="deuda" class="form-section deuda-section">
            <div class="deuda-header">
              <h2>Saldo a pagar</h2>
              <strong class="deuda-total">{{ formatMoney(saldoSeleccionado) }}</strong>
            </div>
            <div class="deuda-meta">
              <span v-if="deuda.contribuyente?.domicilio">
                <b>Domicilio:</b> {{ deuda.contribuyente.domicilio }}
              </span>
              <span>
                <b>{{ identificadorLabel }}:</b> {{ deuda.objetoClave }}
              </span>
            </div>

            <div v-if="itemsPagables.length" class="deuda-group">
              <p class="deuda-group-title">Seleccioná los períodos que querés abonar</p>
              <div class="deuda-items">
                <label
                  v-for="item in itemsPagables"
                  :key="item.id"
                  class="deuda-item"
                  :class="{ selected: seleccionados.includes(item.id) }"
                >
                  <input
                    v-model="seleccionados"
                    type="checkbox"
                    :value="item.id"
                  >
                  <div class="deuda-item-body">
                    <strong>Período {{ item.periodo }}</strong>
                    <small v-if="vencimientoActivo(item)">
                      {{ etiquetaVencimiento(vencimientoActivo(item).orden) }}:
                      {{ formatDate(vencimientoActivo(item).fecha) }}
                      ·
                      {{ formatMoney(vencimientoActivo(item).importe) }}
                    </small>
                    <small v-if="usaSegundoVencimiento(item)" class="deuda-item-hint">
                      El 1er vencimiento ya pasó; el importe corresponde al 2do.
                    </small>
                  </div>
                  <span class="deuda-item-amount">{{ formatMoney(item.importe) }}</span>
                </label>
              </div>
            </div>

            <div v-else class="deuda-empty">
              <p class="mb-0">
                Por el momento no hay períodos disponibles para abonar online.
              </p>
            </div>

            <div v-if="itemsVencidos.length" class="deuda-group deuda-group--info">
              <p class="deuda-group-title">Períodos fuera de término</p>
              <p class="deuda-group-help">
                <i class="bi bi-exclamation-circle-fill deuda-help-icon" aria-hidden="true"></i>
                <span>
                  <template v-if="itemsVencidos.length === 1">
                    Este período no puede ser abonado por este medio.
                  </template>
                  <template v-else>
                    Estos períodos no pueden ser abonados por este medio.
                  </template>
                  Si tenés dudas, podés comunicarte con
                  <a href="mailto:recaudaciones@gesell.gob.ar">recaudaciones@gesell.gob.ar</a>.
                </span>
              </p>
              <ul class="deuda-vencidos">
                <li
                  v-for="item in itemsVencidos"
                  :key="item.id"
                  class="deuda-vencido-row"
                >
                  <div class="deuda-item-body">
                    <strong>Período {{ item.periodo }}</strong>
                    <small v-if="ultimoVencimiento(item)">
                      Venció el {{ formatDate(ultimoVencimiento(item).fecha) }}
                    </small>
                  </div>
                  <span class="deuda-item-amount">{{ formatMoney(item.importe) }}</span>
                </li>
              </ul>
            </div>
          </div>

          <b-alert v-else-if="deudaMsg" show :variant="deudaVariant" class="mb-0">
            {{ deudaMsg }}
          </b-alert>

          <div v-if="deuda && itemsPagables.length" ref="pagadorSection" class="form-section pagador-section">
            <h2>Datos del pagador</h2>
            <div class="payer-grid">
              <b-form-group label="Nombre *" label-for="first_name" class="mb-0">
                <b-form-input
                  id="first_name"
                  v-model="payer.first_name"
                  required
                  autocomplete="given-name"
                />
              </b-form-group>
              <b-form-group label="Apellido *" label-for="last_name" class="mb-0">
                <b-form-input
                  id="last_name"
                  v-model="payer.last_name"
                  required
                  autocomplete="family-name"
                />
              </b-form-group>
              <b-form-group
                label="Email *"
                label-for="email"
                class="mb-0 payer-field--full"
              >
                <b-form-input
                  id="email"
                  v-model="payer.email"
                  type="email"
                  required
                  autocomplete="email"
                />
              </b-form-group>
              <b-form-group label="Tipo de documento *" label-for="document_type" class="mb-0">
                <b-form-select
                  id="document_type"
                  v-model="payer.document_type"
                  :options="documentTypeOptions"
                  required
                />
              </b-form-group>
              <b-form-group label="Número de documento *" label-for="document_number" class="mb-0">
                <b-form-input
                  id="document_number"
                  v-model="payer.document_number"
                  :maxlength="payer.document_type === '1' ? 8 : 20"
                  required
                  inputmode="numeric"
                  autocomplete="off"
                />
              </b-form-group>
              <b-form-group label="Género (como en DNI) *" label-for="gender" class="mb-0">
                <b-form-select
                  id="gender"
                  v-model="payer.gender"
                  :options="genderOptions"
                  required
                />
              </b-form-group>
            </div>
          </div>

          <b-alert v-if="errorMsg" show variant="danger" class="mb-0">
            <i class="bi bi-exclamation-octagon text-danger mr-1"></i>{{ errorMsg }}
          </b-alert>

          <div v-if="deuda && itemsPagables.length" class="pay-footer">
            <p class="pay-hint mb-0">
              Te vamos a redirigir al sitio seguro de pago en una nueva pestaña.
            </p>
            <b-button
              type="submit"
              variant="success"
              class="urbana-go-pay-btn"
              :disabled="pagando || !puedePagar"
            >
              Ir a pagar
            </b-button>
          </div>
        </b-form>
      </section>

      <section v-else-if="accesoResuelto" class="urbana-card urbana-card--simple">
        <h1>Acceso restringido</h1>
        <p class="mb-0">
          El pago de tasas no está disponible en este momento.
        </p>
      </section>

      <div class="page-btn-volver-wrap">
        <NuxtLink to="/pagos">
          <b-button variant="primary" size="sm" class="page-btn-volver">Volver</b-button>
        </NuxtLink>
      </div>
    </main>

    <b-modal
      v-model="showRedirectModal"
      modal-class="pn-redirect-modal"
      header-bg-variant="success"
      header-class="border-0"
      body-class="pn-redirect-body"
      size="lg"
      centered
      hide-footer
      :no-close-on-backdrop="pagando"
      :no-close-on-esc="pagando"
    >
      <template #header>
        <div class="pn-redirect-header">
          <span class="pn-redirect-header-spacer"></span>
          <i class="bi bi-info-circle-fill pn-redirect-header-info" aria-hidden="true"></i>
          <button
            type="button"
            class="btn-close btn-close-white"
            :disabled="pagando"
            aria-label="Cerrar"
            @click="showRedirectModal = false"
          ></button>
        </div>
      </template>
      <div class="pn-redirect-content">
        <h2 class="pn-redirect-title">Redirección a Sitio de Pago Seguro</h2>
        <p>
          Estás a punto de ser redirigida/o a nuestro sitio de pago bancario seguro.
        </p>
        <p class="pn-redirect-lead">Por favor, tené en cuenta lo siguiente:</p>
        <ul class="pn-redirect-list">
          <li>
            <i class="bi bi-exclamation-circle-fill" aria-hidden="true"></i>
            <span>Es posible que tu navegador o dispositivo intente bloquear la ventana emergente.</span>
          </li>
          <li>
            <i class="bi bi-lock-fill" aria-hidden="true"></i>
            <span>
              Para continuar el trámite, no aceptes el bloqueo y permití que se abra una nueva ventana para realizar el pago.
            </span>
          </li>
          <li>
            <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
            <span>
              Si ves un mensaje de bloqueo o aún no se abre la ventana nueva, verificá tu navegador y habilitá las ventanas emergentes para este sitio.
            </span>
          </li>
        </ul>
        <p class="pn-redirect-cta">
          Hacé click en el botón de pago para acceder al sitio de pago.
        </p>
        <button
          type="button"
          class="pn-redirect-pn-btn"
          :disabled="pagando"
          :aria-busy="pagando ? 'true' : 'false'"
          @click="confirmarYPagar"
        >
          <span v-if="pagando" class="urbana-pay-loading">
            <b-spinner small variant="success"></b-spinner>
            Generando link...
          </span>
          <img
            v-else
            :src="btnHorizontalVerde"
            alt="Pagar con Cuenta DNI, homebanking, tarjeta o QR"
            class="urbana-pay-img"
          >
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ProvinciaNetService from '~/service/provinciaNet.js'
import btnHorizontalVerde from '~/assets/provincianet/boton-cuenta-dni-horizontal-verde.svg'

const STORAGE_KEY = 'provinciaNetUUID'

export default {
  setup() {
    const { showToast } = useProjectToast()
    return { showToast }
  },
  data() {
    return {
      btnHorizontalVerde,
      pagando: false,
      consultando: false,
      errorMsg: '',
      deudaMsg: '',
      deudaVariant: 'info',
      showRedirectModal: false,
      accesoResuelto: false,
      pagoUrbanaPublico: false,
      tipoTasa: 'URBANA',
      objetoClave: '',
      deuda: null,
      seleccionados: [],
      payer: {
        first_name: '',
        last_name: '',
        email: '',
        document_number: '',
        gender: '1',
        document_type: '1',
        locked_payer: false,
      },
      tipoTasaOptions: [
        { value: 'URBANA', text: 'Tasa urbana' },
        { value: 'AUTOMOTORES', text: 'Tasa automotor' },
      ],
      documentTypeOptions: [
        { value: '1', text: 'DNI' },
        { value: '2', text: 'Pasaporte' },
        { value: '3', text: 'CUIT / CUIL' },
      ],
      genderOptions: [
        { value: '1', text: 'Masculino' },
        { value: '2', text: 'Femenino' },
        { value: '3', text: 'X' },
      ],
    }
  },
  computed: {
    usuarioInterno() {
      const admin = String(useUserStore().admin || '').trim().toLowerCase()
      return ['hacienda', 'master', 'admin', 'true', 'boletas'].includes(admin)
    },
    puedeAcceder() {
      return this.usuarioInterno || this.pagoUrbanaPublico
    },
    identificadorLabel() {
      return this.tipoTasa === 'AUTOMOTORES' ? 'Dominio' : 'Partida'
    },
    identificadorPlaceholder() {
      return this.tipoTasa === 'AUTOMOTORES' ? 'Dominio del vehículo' : 'Número de partida'
    },
    claveValida() {
      if (this.tipoTasa === 'AUTOMOTORES') {
        return /^[A-Z0-9]{5,9}$/.test(this.objetoClave)
      }
      return /^[A-Z0-9]{3,16}$/.test(this.objetoClave)
    },
    itemsPagables() {
      return (this.deuda?.items || []).filter((item) => !this.esPeriodoVencido(item))
    },
    itemsVencidos() {
      return (this.deuda?.items || []).filter((item) => this.esPeriodoVencido(item))
    },
    soloPeriodosVencidos() {
      return Boolean(this.deuda?.items?.length) && this.itemsPagables.length === 0
    },
    saldoSeleccionado() {
      if (!this.deuda?.items?.length) return 0
      return this.deuda.items
        .filter(
          (item) =>
            this.seleccionados.includes(item.id) && !this.esPeriodoVencido(item)
        )
        .reduce((acc, item) => acc + Number(item.importe || 0), 0)
        .toFixed(2)
    },
    puedePagar() {
      if (!this.claveValida) return false
      return this.seleccionados.some((id) =>
        this.itemsPagables.some((item) => item.id === id)
      )
    },
  },
  mounted() {
    this.loadAccess()
  },
  methods: {
    async loadAccess() {
      try {
        const response = await ProvinciaNetService.getConfiguracion(this.$axios)
        const data = response?.data || response
        this.pagoUrbanaPublico = data?.habilitada === true
      } catch (_) {
        this.pagoUrbanaPublico = false
      } finally {
        this.accesoResuelto = true
      }
    },
    seleccionarTipoTasa(value) {
      if (this.tipoTasa === value) return
      this.tipoTasa = value
      this.onTipoTasaChange()
    },
    onTipoTasaChange() {
      this.objetoClave = ''
      this.deuda = null
      this.seleccionados = []
      this.deudaMsg = ''
      this.errorMsg = ''
    },
    normalizarClave() {
      if (this.tipoTasa === 'AUTOMOTORES') {
        this.objetoClave = String(this.objetoClave || '')
          .replace(/[\s-]/g, '')
          .toUpperCase()
      } else {
        this.objetoClave = String(this.objetoClave || '')
          .replace(/\s/g, '')
          .toUpperCase()
      }
    },
    formatMoney(value) {
      const n = Number(value || 0)
      return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
    },
    formatDate(value) {
      if (!value) return '-'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return '-'
      return date.toLocaleDateString('es-AR')
    },
    finDelDia(value) {
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return NaN
      date.setHours(23, 59, 59, 999)
      return date.getTime()
    },
    esVencimientoPasado(vto) {
      if (!vto) return false
      if (typeof vto.vencido === 'boolean') return vto.vencido
      if (typeof vto.vigente === 'boolean') return !vto.vigente
      const fin = this.finDelDia(vto.fecha)
      return Number.isNaN(fin) || fin < Date.now()
    },
    vencimientosOrdenados(item) {
      return [...(item?.vencimientos || [])].sort(
        (a, b) => Number(a.orden || 0) - Number(b.orden || 0)
      )
    },
    etiquetaVencimiento(orden) {
      return Number(orden) === 2 ? '2do vto' : '1er vto'
    },
    vencimientoActivo(item) {
      if (item?.vencimientoActivo) return item.vencimientoActivo
      const vtos = this.vencimientosOrdenados(item)
      return vtos.find((vto) => !this.esVencimientoPasado(vto)) || null
    },
    ultimoVencimiento(item) {
      const vtos = this.vencimientosOrdenados(item)
      return vtos[vtos.length - 1] || null
    },
    usaSegundoVencimiento(item) {
      if (this.esPeriodoVencido(item)) return false
      const activo = this.vencimientoActivo(item)
      if (activo) return Number(activo.orden) === 2
      const vtos = this.vencimientosOrdenados(item)
      const primero = vtos.find((vto) => Number(vto.orden) === 1) || vtos[0]
      const segundo = vtos.find((vto) => Number(vto.orden) === 2)
      return Boolean(
        primero &&
          this.esVencimientoPasado(primero) &&
          segundo &&
          !this.esVencimientoPasado(segundo)
      )
    },
    esPeriodoVencido(item) {
      if (!item) return false
      if (typeof item.vencido === 'boolean') return item.vencido
      if (typeof item.pagable === 'boolean') return !item.pagable
      const vtos = this.vencimientosOrdenados(item)
      if (!vtos.length) return false
      return vtos.every((vto) => this.esVencimientoPasado(vto))
    },
    async consultarDeuda() {
      this.errorMsg = ''
      this.deudaMsg = ''
      this.deuda = null
      this.seleccionados = []

      if (!this.claveValida) return

      this.consultando = true
      try {
        const response = await ProvinciaNetService.getDeuda(this.$axios, {
          tipoTasa: this.tipoTasa,
          objetoClave: this.objetoClave,
        })
        const data = response?.data || response
        this.deuda = data
        this.seleccionados = (data.items || [])
          .filter((item) => !this.esPeriodoVencido(item))
          .map((item) => item.id)
        this.deudaMsg = ''
        this.$nextTick(() => {
          this.$refs.pagadorSection?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        })
      } catch (e) {
        this.deudaMsg =
          e?.response?.data?.message ||
          e?.data?.message ||
          e?.message ||
          'No se pudo consultar la deuda.'
        this.deudaVariant = 'danger'
      } finally {
        this.consultando = false
      }
    },
    iniciarPago() {
      this.errorMsg = ''
      if (!this.puedePagar) {
        if (this.soloPeriodosVencidos) {
          this.errorMsg =
            'Los períodos consultados están vencidos y no se pueden abonar online. Acercate a Recaudaciones para regularizarlos.'
        } else {
          this.errorMsg = 'Consultá la deuda y seleccioná al menos un período vigente.'
        }
        return
      }
      this.showRedirectModal = true
    },
    async confirmarYPagar() {
      this.errorMsg = ''
      this.pagando = true

      let checkoutWindow = null
      if (import.meta.client) {
        checkoutWindow = window.open('about:blank', '_blank')
      }

      try {
        const body = {
          payer: this.payer,
          objetoClave: this.objetoClave,
          tipoTasa: this.tipoTasa,
          itemIds: this.seleccionados.filter((id) =>
            this.itemsPagables.some((item) => item.id === id)
          ),
        }

        const res = await ProvinciaNetService.createPreorder(this.$axios, body)
        const data = res?.data || res
        const url = data?.url
        const uuid = data?.preorder_uuid
        if (!url || !uuid) {
          throw new Error('La respuesta no incluye url o preorder_uuid')
        }
        if (import.meta.client) {
          localStorage.setItem(STORAGE_KEY, uuid)
        }

        if (checkoutWindow && !checkoutWindow.closed) {
          checkoutWindow.location.href = url
          this.showToast('Se abrió el sitio de pago en una nueva pestaña', {
            variant: 'success',
          })
        } else {
          this.errorMsg =
            'El navegador bloqueó la nueva pestaña. Permití ventanas emergentes e intentá de nuevo.'
          this.showToast(this.errorMsg, { variant: 'warning' })
        }
        this.showRedirectModal = false
      } catch (e) {
        console.error(e)
        if (checkoutWindow && !checkoutWindow.closed) {
          checkoutWindow.close()
        }
        this.errorMsg =
          e?.response?.data?.message ||
          e?.data?.message ||
          e?.message ||
          'No se pudo generar el link de pago.'
        this.showToast(this.errorMsg, { variant: 'danger' })
        this.showRedirectModal = false
      } finally {
        this.pagando = false
      }
    },
  },
}
</script>

<style scoped>
.urbana-page {
  height: auto;
  min-height: 0;
}
.urbana-main--compact {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}
.urbana-form--consulta {
  padding-bottom: 1.15rem;
}

.urbana-card {
  max-width: 820px;
  margin: 0 auto;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0px 2px 5px 0px var(--shadow-card);
  overflow: hidden;
}
.urbana-card--simple {
  padding: 1.75rem 2rem;
}
.urbana-card--simple h1 {
  margin: 0 0 0.75rem;
  color: #0c681a;
  font-size: 1.75rem;
  font-weight: bold;
}
.urbana-card--simple p {
  color: #666;
  font-weight: 600;
}

.urbana-header {
  padding: 1.75rem 2rem 1.35rem;
  border-bottom: 1px solid #dee2e6;
  background: var(--green-fill);
}
.urbana-header h1 {
  margin: 0 0 0.55rem;
  color: #0c681a;
  font-size: 2rem;
  font-weight: bold;
  line-height: 1.2;
}
.urbana-header p {
  margin: 0;
  color: #666;
  font-weight: 600;
  line-height: 1.5;
}

.urbana-form {
  padding: 1.5rem 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-section h2 {
  margin: 0 0 1rem;
  color: #0c681a;
  font-size: 1.15rem;
  font-weight: bold;
}
.tasa-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem;
  margin-bottom: 1rem;
}
.tasa-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  min-height: 2.75rem;
  padding: 0.55rem 0.85rem;
  border: 1px solid #dee2e6;
  border-radius: 10px;
  background: var(--color-white);
  color: #353535;
  font-family: var(--font-inter);
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.2;
  cursor: pointer;
}
.tasa-tab i {
  font-size: 1.1rem;
  color: #0c681a;
}
.tasa-tab.active {
  border-color: #0c681a;
  background: #0c681a;
  color: var(--color-white);
}
.tasa-tab.active i {
  color: var(--color-white);
}
.clave-row {
  display: flex;
  gap: 0.6rem;
}
.clave-row .form-control,
.clave-row input {
  flex: 1;
}

.deuda-section {
  padding: 1rem 1.1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.85rem;
  background: var(--green-fill);
}
.deuda-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.deuda-header h2 {
  margin: 0;
}
.deuda-total {
  color: #0c681a;
  font-size: 1.25rem;
}
.deuda-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 1rem;
  margin-bottom: 1rem;
  color: #666666;
  font-size: 0.92rem;
}
.deuda-group + .deuda-group {
  margin-top: 1.1rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}
.deuda-group-title {
  margin: 0 0 0.55rem;
  color: #0c681a;
  font-size: 0.95rem;
  font-weight: 700;
}
.deuda-group-help {
  display: flex;
  align-items: flex-start;
  gap: 0.45rem;
  margin: 0 0 0.7rem;
  color: #666666;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.45;
}
.deuda-help-icon {
  flex-shrink: 0;
  margin-top: 0.15rem;
  color: #E27910;
  font-size: 1rem;
}
.deuda-group-help a {
  color: #0c681a;
  font-weight: 400;
  text-decoration: underline;
}
.deuda-group--info .deuda-group-title {
  color: #E27910;
}
.deuda-empty {
  padding: 0.85rem 0.95rem;
  border-radius: 0.65rem;
  background: #fff;
  border: 1px dashed #dee2e6;
  color: #666666;
  font-weight: 600;
}
.deuda-items {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.deuda-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.7rem 0.85rem;
  border: 1px solid #dee2e6;
  border-radius: 0.65rem;
  background: #fff;
  cursor: pointer;
  margin: 0;
}
.deuda-item.selected {
  border-color: #0c681a;
  box-shadow: inset 0 0 0 1px #0c681a;
}
.deuda-item-body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.deuda-item-body strong {
  color: #0c681a;
}
.deuda-item-body small {
  color: #666666;
}
.deuda-item-hint {
  color: #666666 !important;
  font-weight: 600;
}
.deuda-item-amount {
  font-weight: 700;
  color: #0c681a;
}
.deuda-vencidos {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.deuda-vencido-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.65rem 0.85rem;
  border-radius: 0.65rem;
  background: var(--gray-bs-200);
  border: 1px solid #dee2e6;
}
.deuda-vencido-row .deuda-item-body strong,
.deuda-vencido-row .deuda-item-body small,
.deuda-vencido-row .deuda-item-amount {
  color: #6c757d;
}
.deuda-vencido-row .deuda-item-amount {
  font-weight: 600;
}

.payer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.15rem;
}
.payer-field--full {
  grid-column: 1 / -1;
}
.pagador-section {
  scroll-margin-top: 1rem;
}

.pay-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding-top: 0.35rem;
  border-top: 1px solid #dee2e6;
}
.pay-hint {
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
  max-width: 22rem;
  line-height: 1.4;
}
.urbana-go-pay-btn {
  flex-shrink: 0;
  min-width: 10.5rem;
  padding: 0.55rem 1.35rem;
  font-weight: 600;
}
.urbana-pay-img {
  display: block;
  width: 260px;
  max-width: 100%;
  height: auto;
}
.urbana-pay-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #0c681a;
  font-weight: 600;
  font-size: 0.95rem;
  min-height: 48px;
  line-height: 1.2;
}

.pn-redirect-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
}
.pn-redirect-header-info {
  font-size: 1.35rem;
  color: #fff;
  line-height: 1;
}
.pn-redirect-header .btn-close {
  justify-self: end;
}
.pn-redirect-content {
  text-align: center;
  color: #212529;
  font-size: 0.95rem;
  line-height: 1.5;
}
.pn-redirect-content p {
  margin-bottom: 1rem;
}
.pn-redirect-title {
  margin: 0 0 1.15rem;
  color: #0c681a;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.35;
}
.pn-redirect-lead {
  font-weight: 600;
  margin-bottom: 1rem;
}
.pn-redirect-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.35rem;
  text-align: left;
}
.pn-redirect-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.95rem;
  line-height: 1.45;
}
.pn-redirect-list li:last-child {
  margin-bottom: 0;
}
.pn-redirect-list i {
  color: #E27910;
  font-size: 1.05rem;
  line-height: 1.45;
  flex-shrink: 0;
  margin-top: 0.1rem;
}
.pn-redirect-cta {
  font-weight: 700;
  margin: 0 0 1.35rem;
}
.pn-redirect-pn-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  line-height: 0;
}
.pn-redirect-pn-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (max-width: 767px) {
  .urbana-header,
  .urbana-form,
  .urbana-card--simple {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
  }
  .urbana-header h1 {
    font-size: 1.65rem;
  }
  .payer-grid {
    grid-template-columns: 1fr;
  }
  .clave-row {
    flex-direction: column;
  }
  .pay-footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }
  .pay-hint {
    max-width: none;
    text-align: center;
  }
  .urbana-go-pay-btn {
    width: 100%;
  }
  .urbana-pay-img {
    width: 100%;
  }
}
</style>

<style>
.pn-redirect-modal .modal-header {
  padding: 0.9rem 1.15rem;
}
.pn-redirect-modal .modal-body {
  padding: 1.75rem 2rem 2.15rem;
}
@media (max-width: 767px) {
  .pn-redirect-modal .modal-body {
    padding: 1.35rem 1.25rem 1.65rem;
  }
}
</style>
