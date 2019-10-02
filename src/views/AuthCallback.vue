<template>
  <div class="auth-callback page-content">
    <p>Logging in...</p>
    <button class="button" v-on:click="onRetryLogin()">Retry</button>
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ActionBase } from "../store/ActionBase";
import { Actions } from "../store/Actions";
import AuthService from "../plugins/AuthService";

@Component({
  components: {}
})
export default class AuthCallback extends Vue {
  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;
  private auth: AuthService = (<any>this).$auth;

  mounted() {
    this.auth.handleAuthentication().then(() => {
      this.dispatch(new Actions.LoginCompleted(this.$router));
    });
  }

  public onRetryLogin() {
    this.dispatch(new Actions.Login(this.$auth));
  }
}
</script>
