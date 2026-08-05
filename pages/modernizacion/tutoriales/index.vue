<template>
  <div class="page main-background">
    <Banner title="Tutoriales" />
    <div class="modernizacion-menu row mx-auto justify-content-center mb-5">
      <div class="modernizacion-menu-item col-auto">
        <NuxtLink to="/modernizacion/tutoriales/mail-institucional" class="modernizacion-menu-link">
          <b-button variant="outline" class="mt-5 btn-5 modernizacion-menu-btn">
            <i class="bi bi-folder landing-icon" aria-hidden="true" />
            <h3 class="landing-text mb-0"><b>Mail institucional</b></h3>
          </b-button>
        </NuxtLink>
      </div>
      <div class="modernizacion-menu-item col-auto">
        <NuxtLink to="/modernizacion/tutoriales/gde" class="modernizacion-menu-link">
          <b-button variant="outline" class="mt-5 btn-5 modernizacion-menu-btn">
            <i class="bi bi-folder landing-icon" aria-hidden="true" />
            <h3 class="landing-text mb-0"><b>Sistema GDE</b></h3>
          </b-button>
        </NuxtLink>
      </div>
      <div class="modernizacion-menu-item col-auto">
        <NuxtLink to="/modernizacion/tutoriales/otros" class="modernizacion-menu-link">
          <b-button variant="outline" class="mt-5 btn-5 modernizacion-menu-btn">
            <i class="bi bi-folder landing-icon" aria-hidden="true" />
            <h3 class="landing-text mb-0"><b>Otros</b></h3>
          </b-button>
        </NuxtLink>
      </div>
    </div>
    <div class="page-btn-volver-wrap">
      <NuxtLink to="/modernizacion">
        <b-button variant="primary" size="sm" class="page-btn-volver"> Volver </b-button>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.modernizacion-menu {
  max-width: 52rem;
  margin-top: 1.5rem;
  gap: 1.5rem;
}

.modernizacion-menu-item {
  display: flex;
  justify-content: center;
}

.modernizacion-menu-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.modernizacion-menu-btn {
  display: flex !important;
  flex-direction: column;
  align-items: center !important;
  justify-content: center;
  text-align: center !important;
  min-width: 11rem;
  width: 100%;
  padding: 1rem 1.25rem;
}

.modernizacion-menu-btn .landing-icon {
  display: block;
  font-size: 3.75rem;
  line-height: 1;
  color: #ef8918;
  margin: 0 auto 0.5rem;
  transition: transform 0.2s ease;
}

.modernizacion-menu-btn .landing-text {
  width: 100%;
  text-align: center !important;
}

.modernizacion-menu-btn:hover .landing-icon {
  transform: scale(1.1);
}
</style>
