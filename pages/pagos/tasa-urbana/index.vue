<template>
  <div class="page main-background urbana-page">
    <Banner title="Pagos" />

    <main class="container py-5">
      <section v-if="adminHacienda" class="urbana-card">
        <header class="urbana-header">
          <h1>Tasa por Servicios Urbanos</h1>
          <p>
            Ingresá la partida y los datos del pagador para continuar con el pago online.
          </p>
        </header>

        <b-form class="urbana-form" @submit.prevent="iniciarPago">
          <div class="form-section">
            <h2>Datos de la cuenta</h2>
            <b-form-group label="Partida *" label-for="partida" class="mb-0">
              <b-form-input
                id="partida"
                v-model="partida"
                required
                autocomplete="off"
                placeholder="Número de partida"
                @input="normalizarPartida"
              />
            </b-form-group>
          </div>

          <div class="form-section">
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

          <div class="pay-footer">
            <p class="pay-hint mb-0">
              Te vamos a redirigir al sitio seguro de pago en una nueva pestaña.
            </p>
            <button
              type="submit"
              class="urbana-pay-btn"
              :disabled="pagando || !partidaValida"
              :aria-busy="pagando ? 'true' : 'false'"
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
        </b-form>
      </section>

      <section v-else class="urbana-card urbana-card--simple">
        <h1>Acceso restringido</h1>
        <p class="mb-0">
          Esta sección está disponible solo para usuarios de Hacienda / master.
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
      title="Redirección al pago"
      centered
      hide-footer
      :no-close-on-backdrop="pagando"
      :no-close-on-esc="pagando"
    >
      <p class="mb-2">
        Vas a ser redirigido al sitio seguro de <b>Provincia NET</b> para completar el pago.
      </p>
      <p class="mb-0 text-muted">
        Se abrirá en una <b>nueva pestaña</b>. No cierres esta ventana hasta finalizar o cancelar el pago.
      </p>
      <div v-if="pagando" class="d-flex align-items-center gap-2 mt-3 text-success">
        <b-spinner small></b-spinner>
        <span>Generando link de pago...</span>
      </div>
      <div class="d-flex justify-content-end gap-2 mt-4">
        <b-button variant="outline-secondary" :disabled="pagando" @click="showRedirectModal = false">
          Cancelar
        </b-button>
        <b-button variant="success" :disabled="pagando" @click="confirmarYPagar">
          <b-spinner v-if="pagando" small class="mr-2"></b-spinner>
          {{ pagando ? 'Redirigiendo...' : 'Continuar' }}
        </b-button>
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
      errorMsg: '',
      showRedirectModal: false,
      partida: '',
      payer: {
        first_name: '',
        last_name: '',
        email: '',
        document_number: '',
        gender: '1',
        document_type: '1',
        locked_payer: false,
      },
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
    adminHacienda() {
      const admin = useUserStore().admin
      return admin === 'hacienda' || admin === 'master'
    },
    partidaValida() {
      return this.partida.length >= 3
    },
  },
  methods: {
    normalizarPartida() {
      this.partida = String(this.partida || '')
        .replace(/\s/g, '')
        .toUpperCase()
    },
    iniciarPago() {
      this.errorMsg = ''
      if (!this.partidaValida) {
        this.errorMsg = 'Ingresá un número de partida válido.'
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
        const res = await ProvinciaNetService.createPreorder(this.$axios, {
          payer: this.payer,
          objetoClave: this.partida,
          useHomologacionFixture: true,
        })
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
  min-height: 100vh;
}

.urbana-card {
  max-width: 820px;
  margin: 0 auto;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.75);
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
  border-bottom: 1px solid #e8eee9;
  background: #f7fbf8;
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
.payer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem 1.15rem;
}
.payer-field--full {
  grid-column: 1 / -1;
}

.pay-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding-top: 0.35rem;
  border-top: 1px solid #e8eee9;
}
.pay-hint {
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
  max-width: 22rem;
  line-height: 1.4;
}
.urbana-pay-btn {
  flex-shrink: 0;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  line-height: 0;
}
.urbana-pay-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.urbana-pay-img {
  display: block;
  width: 240px;
  max-width: 100%;
  height: auto;
}
.urbana-pay-loading {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #0c681a;
  font-weight: 600;
  font-size: 1rem;
  min-height: 40px;
  line-height: 1.2;
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
  .pay-footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }
  .pay-hint {
    max-width: none;
    text-align: center;
  }
  .urbana-pay-btn {
    width: 100%;
  }
  .urbana-pay-img {
    width: 100%;
  }
}
</style>
