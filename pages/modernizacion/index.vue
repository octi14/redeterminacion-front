<template>
  <div class="page main-background">
    <Banner title="Modernización" />
    <!-- Modal agregar archivo -->
    <BModal v-model="isAdding" no-header-close title-class="h5 mx-auto text-light" header-bg-variant="secondary" no-footer centered>
      <template #header>
        <div class="row mx-auto">
          <i class="bi bi-upload"></i>
          <!-- <h4 class="text-light my-2 ml-4">Agregar archivo</h4> -->
        </div>
      </template>
      <MultimediaForm @submit="onSubmit" @reset="onHideModal"/>
    </BModal>
    <!-- Content -->
    <!-- Botón -->
    <div class="modernizacion-agregar-wrap" v-if="adminModernizacion">
      <b-button size="sm" class="shadow-card" variant="secondary" @click="onShowModal">Agregar archivo</b-button>
    </div>
    <!-- Menú -->
    <div v-if="!(adminModernizacion || adminCultura)">
      <p class="h5 text-center my-5"> Esta página sólo está disponible para uso interno del personal Municipal. </p>
    </div>
    <div class="modernizacion-menu row mx-auto justify-content-center" v-if="adminModernizacion || adminCultura">
      <div class="modernizacion-menu-item col-auto" v-if="adminModernizacion">
        <NuxtLink to="/modernizacion/procedimientos" class="modernizacion-menu-link">
          <b-button variant="outline" class="mt-3 btn-5 modernizacion-menu-btn">
            <i class="bi bi-folder landing-icon" aria-hidden="true" />
            <h4 class="landing-text mb-0"><b>Procedimientos</b></h4>
          </b-button>
        </NuxtLink>
      </div>
      <div class="modernizacion-menu-item col-auto" v-if="adminModernizacion">
        <NuxtLink to="/modernizacion/tutoriales" class="modernizacion-menu-link">
          <b-button variant="outline" class="mt-3 btn-5 modernizacion-menu-btn">
            <i class="bi bi-folder landing-icon" aria-hidden="true" />
            <h4 class="landing-text mb-0"><b>Tutoriales</b></h4>
          </b-button>
        </NuxtLink>
      </div>
      <div class="modernizacion-menu-item col-auto">
        <NuxtLink to="/modernizacion/notas" class="modernizacion-menu-link">
          <b-button variant="outline" class="mt-3 btn-5 modernizacion-menu-btn">
            <i class="bi bi-folder landing-icon" aria-hidden="true" />
            <h4 class="landing-text mb-0"><b>Formularios/<br>Notas tipo</b></h4>
          </b-button>
        </NuxtLink>
      </div>
    </div>
    <div class="container">
      <div class="page-btn-volver-wrap">
        <NuxtLink to="/">
          <b-button variant="primary" size="sm" class="page-btn-volver"> Volver </b-button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  setup(){ const { showToast } = useProjectToast(); return { showToast } },
  data() {
    return {
      isAdding: false,
    }
  },
  computed: {
    isAdmin(){
      return Boolean(useUserStore().admin == "true")
    },
    adminModernizacion(){
      const userStore = useUserStore()
      return userStore.admin == "modernizacion" || userStore.admin === "master" || userStore.username === "gustavociriaco@gesell.gob.ar"
    },
    adminCultura(){
      const admin = useUserStore().admin
      return admin == "cultura" || admin == "master"
    },
  },
  methods: {
    onSubmit(){
      this.showToast('Creado correctamente', {
        title: 'Creado',
        variant: 'success',
        appendToast: true,
        solid: true,
      })
      this.onHideModal()
    },
    onShowModal() {
      this.isAdding = true
    },
    onHideModal(){
      this.isAdding = false
    }
  }
}
</script>

<style scoped>
.modernizacion-agregar-wrap {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0 1rem;
}

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
