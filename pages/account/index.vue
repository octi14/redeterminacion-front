<template>
  <div class="page main-background">
    <Banner title="Mi cuenta"/>
    <div class="text-center col-md-4 col-sm-8 card shadow-card mt-4 mx-auto">
      <div class="text-center mt-5">
        <p class="h4" style="color:#07691c"><b>Cambiar contraseña</b></p>
      </div> <hr/>
      <b-form class="mt-4" @submit.prevent="onResetPassword" @reset="onCancel">
        <h6 style="color:#07691c"><b> Contraseña anterior </b></h6>
        <div class="col-10 mx-auto mb-3 position-relative">
          <b-form-input v-model="oldPassword" :type="visibleOldPass ? 'text' : 'password'"
                        class="position-relative">
          </b-form-input>
          <div class="position-absolute end-0 top-50 translate-middle-y"
               @mousedown="showOldPassword" @mouseup="hideOldPassword" @mouseleave="hideOldPassword"
               style="cursor: pointer; right: 25px; top: 5px">
            <i v-if="visibleOldPass" class="far fa-eye-slash"></i>
            <i v-else class="far fa-eye"></i>
          </div>
        </div>
        <h6 style="color:#07691c"><b> Nueva contraseña </b></h6>
        <div class="col-10 mx-auto mb-3 position-relative">
          <b-form-input v-model="newPassword" :type="visibleNewPass ? 'text' : 'password'"
                        class="position-relative">
          </b-form-input>
          <div class="position-absolute end-0 top-50 translate-middle-y"
               @mousedown="showNewPassword" @mouseup="hideNewPassword" @mouseleave="hideNewPassword"
               style="cursor: pointer; right: 25px; top: 5px">
            <i v-if="visibleNewPass" class="far fa-eye-slash"></i>
            <i v-else class="far fa-eye"></i>
          </div>
        </div>
        <h6 style="color:#07691c"><b> Repetir contraseña </b></h6>
        <div class="col-10 mx-auto mb-3 position-relative">
          <b-form-input v-model="repeatNewPassword" :type="visibleRepeat ? 'text' : 'password'"
                        class="position-relative">
          </b-form-input>
          <div class="position-absolute end-0 top-50 translate-middle-y"
               @mousedown="showRepeatNewPassword" @mouseup="hideRepeatNewPassword" @mouseleave="hideRepeatNewPassword"
               style="cursor: pointer; right: 25px; top: 5px">
            <i v-if="visibleRepeat" class="far fa-eye-slash"></i>
            <i v-else class="far fa-eye"></i>
          </div>
        </div>
      </b-form>
      <div class="row mb-3 mx-auto">
        <b-button class="mt-4 mr-1" variant="success" @click="onResetPassword">Cambiar</b-button>
        <NuxtLink to="/">
          <b-button class="mt-4" variant="danger" type="reset">Salir</b-button>
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
      visibleOldPass: false,
      visibleNewPass: false,
      visibleRepeat: false,
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
      // Emitir evento para indicar que es un logout manual
      this.$nuxt.$emit('manual-logout');
      await this.$store.dispatch('user/logout')
      await this.$router.push('/login')
      this.showPopupChanged = false
    },
    async onCancel(){
      await this.$router.push('/')
    },
    showOldPassword() {
      this.visibleOldPass = true;
    },
    hideOldPassword() {
      this.visibleOldPass = false;
    },
    showNewPassword() {
      this.visibleNewPass = true;
    },
    hideNewPassword() {
      this.visibleNewPass = false;
    },
    showRepeatNewPassword() {
      this.visibleRepeat = true;
    },
    hideRepeatNewPassword() {
      this.visibleRepeat = false;
    },
  }
}
</script>

<style>
 @import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";

</style>
