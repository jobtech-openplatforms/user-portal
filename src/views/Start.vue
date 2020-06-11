<template>
  <div class="start page-content">
    <div class="login-container">
      <div id="login-text">
        <h1>Get control over your <strong>reputation data</strong></h1>
        <button class="button is-primary is-large" @click="onLogin()">Login</button>
        <p
          class="is-large"
        >The open platform API give you the ability to access your gig reputation data from the platforms where you have worked, and share it with any platform you want.</p>
      </div>
      <div id="login-img" class="mobile-invisible">
        <img
          class="open-platform-illustration"
          src="../assets/images/open-platforms-symbol.png"
          alt="Open Platform Symbol"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../assets/css/_variables";



.login-container {
  position:relative;
  display:flex;
  align-items:center;

  
  #login-text{
    flex:0 0 520px;
    padding-right:40px;
  }

  #login-img{
    flex:1;
  }

  button{
    display:block;
    margin:40px auto;
  }
}

.login-container .open-platform-illustration {
  width: 100%;
  height: auto;
}

@media screen and (max-width: $narrow-screen) {
  .login-container {
    flex-direction:column;
    text-align:center;

    #login-text{
      padding-right:0;
      margin-bottom:40px;
      flex:1 1 auto;
    }

    #login-img{
      width:40vw;
      max-width:400px;
      margin:20px auto 10px;
    }
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

  public mounted() {
    localStorage.removeItem('loginState');
  }

  public onLogin() {
    this.dispatch(new Actions.Login(this.$auth));
  }
}
</script>
