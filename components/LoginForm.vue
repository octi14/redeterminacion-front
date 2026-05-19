<template>
  <div class="login-form text-center">
    <form class="login-form-inner" @submit.prevent="onSubmitLoginForm">
      <div class="mb-3">
        <input
          id="input-username"
          v-model="form.username"
          type="text"
          class="form-control form-control-lg mx-auto login-field"
          placeholder="Nombre de usuario"
          autocomplete="username"
          required
        />
      </div>

      <div class="mb-3">
        <input
          id="input-password"
          v-model="form.password"
          type="password"
          class="form-control form-control-lg mx-auto login-field"
          placeholder="Contraseña"
          autocomplete="current-password"
          required
        />
      </div>

      <p v-if="errorMessage" class="text-danger small mx-auto login-error">{{ errorMessage }}</p>

      <button
        type="submit"
        class="btn btn-lg w-100 login-submit-btn"
        :disabled="loggingIn"
      >
        <b>{{ loggingIn ? 'Ingresando...' : 'Acceder' }}</b>
      </button>
    </form>
  </div>
</template>

<script>
export default {
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

      if (this.loggingIn || !username || !password) {
        if (!username || !password) {
          this.errorMessage = 'Completá usuario y contraseña.'
        }
        return
      }

      this.loggingIn = true
      try {
        const userStore = useUserStore()
        await userStore.authenticate({ username, password })
      } catch (e) {
        this.errorMessage = e?.message || 'No se pudo iniciar sesión.'
      } finally {
        this.loggingIn = false
      }
    },
  },
}
</script>

<style scoped>
.login-form {
  position: relative;
  z-index: 2;
}

.login-field {
  width: 100%;
  max-width: 100%;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #c8d7e8;
  background-color: #e8f1fb;
  color: #212529;
}

.login-field::placeholder {
  color: #6c757d;
}

.login-field:focus {
  background-color: #eef6ff;
  border-color: #19a02d;
  box-shadow: 0 0 0 0.2rem rgba(25, 160, 45, 0.15);
  outline: none;
}

.login-error {
  max-width: 100%;
}

.login-submit-btn {
  margin-top: 0.5rem;
  border-radius: 8px;
  background-color: #ef8918;
  border-color: #ef8918;
  color: #fff;
  font-weight: 600;
}

.login-submit-btn:hover:not(:disabled) {
  background-color: #d97a15;
  border-color: #d97a15;
  color: #fff;
}

.login-submit-btn:disabled {
  opacity: 0.75;
}
</style>
