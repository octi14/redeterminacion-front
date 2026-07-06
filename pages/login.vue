<template>
  <div class="page main-background">
    <Banner title="Iniciar sesión" />
    <div class="mt-5">
      <div class="card mt-7 shadow-card col-md-3 col-sm-8 mx-auto">
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
  color: #07691c;
  font-size: 5rem;
  line-height: 1;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
}

</style>
