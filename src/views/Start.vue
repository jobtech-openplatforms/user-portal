<template>
  <div class="start page-content">
    <div class="login-container">
      <div>
        <h1>Get control over your data</h1>
        <p>The open platform API give you the ability to access your gig reputation data from the platforms where you have worked, and share it with any platform you want.</p>
        <button class="button large-button" @click="onLogin()">Login</button>
      </div>
      <div>
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
  }
  .login-container div {
    width: 100%;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Start extends Vue {
  public onLogin() {
    console.log("login");
    this.$router.push("my-connections");
  }
}
</script>
