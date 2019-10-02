<template>
  <div class="start page-content">
    <div class="login-container">
      <div>
        <h1>Get control over your reputation data</h1>
        <p
          class="is-large"
        >The open platform API give you the ability to access your gig reputation data from the platforms where you have worked, and share it with any platform you want.</p>
        <button class="button is-primary is-large" @click="onLogin()">Login</button>
      </div>
      <div class="mobile-invisible">
        <img
          class="open-platform-illustration"
          src="../assets/images/open-platforms-symbol.png"
          alt="Open Platform Symbol"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10vh;
}
.login-container div {
  width: 50%;
  margin-left: 10px;
  margin-right: 10px;
}
.login-container div:first-child {
  margin-left: 0;
}
.login-container div:last-child {
  margin-right: 0;
}
.login-container .open-platform-illustration {
  width: 100%;
  height: auto;
}

@media screen and (max-width: 600px) {
  .login-container {
    flex-direction: column;
    margin-top: 30px;
    padding: 0 10px;
  }
  .login-container div:first-child {
    margin-left: 10px;
  }
  .login-container div:last-child {
    margin-right: 10px;
  }
  .login-container div {
    width: 100%;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Actions } from "../store/Actions";
import { ActionBase } from "../store/ActionBase";

@Component({
  components: {}
})
export default class Start extends Vue {
  private dispatch: (a: ActionBase) => Promise<void> = this.$store.dispatch;

  public onLogin() {
    this.dispatch(new Actions.Login(this.$auth));
  }
}
</script>
