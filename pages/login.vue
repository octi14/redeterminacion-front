<template>
  <div class="page main-background login-page">
    <Banner title="Iniciar sesión" />
    <div class="login-wrap mt-5">
      <div class="login-panel mx-auto">
        <div class="login-avatar-wrap">
          <div class="login-avatar" aria-hidden="true">
            <i class="bi bi-person-fill login-avatar-icon"></i>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 60vh;
}

.login-wrap {
  padding-bottom: 3rem;
}

.login-panel {
  position: relative;
  width: 100%;
  max-width: 420px;
  margin-top: 2.75rem;
  padding: 3rem 1.75rem 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
}

.login-avatar-wrap {
  display: flex;
  justify-content: center;
  margin-top: -5.25rem;
  margin-bottom: 1.25rem;
}

.login-avatar {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  background: #19a02d;
  border: 4px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-avatar-icon {
  font-size: 2.75rem;
  color: #fff;
  line-height: 1;
}
</style>
