<template>
  <div class="page main-background">
    <Banner title="Mi cuenta"/>
    <div class="text-center my-4">
      <p class="h4 text-success"><b>Cambiar contraseña</b></p>
    </div>
    <div class="text-center col-md-4 col-sm-8 card shadow-card mt-6 mx-auto">
      <b-form class="mt-4" @submit.prevent="onResetPassword" @reset="onCancel">
        <h6> Contraseña anterior </h6>
        <b-form-input class="col-10 mb-3 mx-auto" v-model="oldPassword"></b-form-input>
        <h6> Nueva contraseña </h6>
        <b-form-input class="col-10 mb-3 mx-auto" v-model="newPassword"></b-form-input>
        <h6> Repetir contraseña </h6>
        <b-form-input class="col-10 mx-auto" v-model="repeatNewPassword"></b-form-input>
      </b-form>
      <div class="row mb-3 mx-auto">
        <b-button pill class="mt-5 mr-1" variant="success" @click="onResetPassword">Cambiar</b-button>
        <NuxtLink to="/">
          <b-button pill class="mt-5" variant="danger" type="reset">Salir</b-button>
        </NuxtLink>
      </div>
    </div>

    <!--Modal contraseña cambiada con éxito-->
    <b-modal v-model="showPopupChanged" header-bg-variant="success" centered>
      <template #modal-header>
        <div class="mx-auto text-center">
          <b-icon-check-circle style="color:white" scale="2"></b-icon-check-circle>
        </div>
      </template>
      <div class="text-center">
        <h4 class="text-success"><b>¡Contraseña cambiada con éxito!</b></h4>
      </div>
      <template #modal-footer>
        <div class="mx-auto">
          <b-button @click="logout" variant="primary"> Aceptar </b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>

export default{
  data(){
    return{
      oldPassword: '',
      newPassword: '',
      repeatNewPassword: '',
      showPopupChanged: false,
    }
  },
  methods: {
    async onResetPassword() {
      if (this.newPassword !== this.repeatNewPassword) {
        this.$bvToast.toast('Las nuevas contraseñas no coinciden', {
          appendToast: true,
          solid: true,
          variant: 'danger',
        });
      } else {
        const userId = this.$store.state.user.id;
        const success = await this.$store.dispatch('user/changePassword', {
          userId,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });

        if (success) {
          // Mostrar el popup o realizar otras acciones después de cambiar la contraseña y cerrar la sesión
          this.showPopupChanged = true;
        }
      }
    },
    async logout(){
      await this.$store.dispatch('user/logout')
      await this.$router.push('/login')
      this.showPopupChanged = false
    },
    async onCancel(){
      await this.$router.push('/')
    }
  }
}
</script>
