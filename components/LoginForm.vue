<template>
  <div class="text-center login-form-body">
    <form novalidate @submit.prevent="onSubmitLoginForm">
      <div class="my-3 text-left">
        <input
          id="input-username"
          v-model="form.username"
          type="text"
          class="form-control form-control-lg login-field mx-auto"
          placeholder="Nombre de usuario"
          autocomplete="username"
          style="text-align: center"
          @input="syncAutofill"
          @change="syncAutofill"
        />
      </div>

      <div class="text-left">
        <input
          id="input-password"
          v-model="form.password"
          type="password"
          class="form-control form-control-lg login-field mx-auto"
          placeholder="Contraseña"
          autocomplete="current-password"
          style="text-align: center"
          @input="syncAutofill"
          @change="syncAutofill"
        />
      </div>

      <p v-if="errorMessage" class="text-danger small login-field mx-auto mb-2 mt-2">
        {{ errorMessage }}
      </p>

      <button
        type="button"
        class="btn btn-lg login-field mb-6 mx-auto login-submit-btn"
        :disabled="loggingIn"
        @click="onSubmitLoginForm"
      >
        <b>{{ loggingIn ? 'Ingresando...' : 'Acceder' }}</b>
      </button>
    </form>
  </div>
</template>

<script>
export default {
  setup() {
    const { login } = useLogin()
    const userStore = useUserStore()
    return { login, userStore }
  },
  data() {
    return {
      loggingIn: false,
      errorMessage: '',
      form: {
        username: '',
        password: '',
      },
    }
  },
  mounted() {
    this.syncAutofill()
    if (import.meta.client) {
      setTimeout(() => this.syncAutofill(), 100)
      setTimeout(() => this.syncAutofill(), 500)
    }
  },
  methods: {
    syncAutofill() {
      if (!import.meta.client) return
      const usernameEl = document.getElementById('input-username')
      const passwordEl = document.getElementById('input-password')
      if (usernameEl?.value) {
        this.form.username = usernameEl.value
      }
      if (passwordEl?.value) {
        this.form.password = passwordEl.value
      }
    },
    async onSubmitLoginForm() {
      this.syncAutofill()
      const username = (this.form.username || '').trim()
      const password = this.form.password || ''
      this.errorMessage = ''

      if (this.loggingIn) return

      if (!username || !password) {
        this.errorMessage = 'Completá usuario y contraseña.'
        return
      }

      this.loggingIn = true
      try {
        await this.login({ username, password })
      } catch (e) {
        this.userStore.clearSession()
        this.errorMessage = e?.message || 'No se pudo iniciar sesión.'
      } finally {
        this.loggingIn = false
      }
    },
  },
}
</script>

<style scoped>
.login-form-body {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}

.login-field {
  width: 100%;
  max-width: 100%;
  display: block;
}

.login-form-body .form-control {
  padding-left: 1rem;
  padding-right: 1rem;
}

.login-submit-btn {
  background-color: #ef8918;
  border-color: #ef8918;
  color: #fff;
  width: 100%;
}

.login-submit-btn:hover:not(:disabled) {
  background-color: #d97a15;
  border-color: #d97a15;
  color: #fff;
}

.login-submit-btn:disabled {
  opacity: 0.7;
}
</style>
