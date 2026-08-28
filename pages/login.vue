<template>
  <div class="page main-background">
    <Banner title="Iniciar sesión" />
    <div class="mt-5">
      <div class="card mt-7 shadow-card col-12 col-md-3 mx-auto login-card">
        <i
          class="bi bi-person-circle mx-auto login-page-icon d-block"
          aria-hidden="true"
        />
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<style>
.mt-6 {
  margin-top: 4rem;
}

.mb-6 {
  margin-bottom: 4rem;
}

.mt-7 {
  margin-top: 5rem;
}

.mt-8 {
  margin-top: 5.5rem;
}

.login-page-icon {
  color: #0c681a;
  font-size: 5rem;
  line-height: 1;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
}

@media (max-width: 767.98px) {
  .login-card {
    margin-top: 2.5rem !important;
    margin-left: 0.375rem;
    margin-right: 0.375rem;
    width: calc(100% - 0.75rem);
    max-width: none;
  }

  .login-page-icon {
    font-size: 4rem;
    margin-top: 1.75rem;
    margin-bottom: 1rem;
  }
}

</style>
