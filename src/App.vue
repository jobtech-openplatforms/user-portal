<template>
  <div id="app">
    <div id="nav">
      <div>
        <img class="app-logo" src="./assets/images/open-platforms-logo.png" />
      </div>
      <div>
        <span>Personal Data Dashboard</span>
      </div>

      <!-- <router-link to="/">Home</router-link> | -->
      <!-- <router-link to="/about">About</router-link> -->
      <div>
        <button v-if="isLoggedIn" class="button logout-button" @click="onLogout()">Logout</button>
      </div>
    </div>
    <div id="page-container">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
@import "assets/css/styles.scss";

#nav {
  padding: 10px 20px;
  background: white;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.app-logo {
  height: 45px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import store from "@/store";

@Component({
  components: {}
})
export default class App extends Vue {
  constructor() {
    super();
  }

  get isLoggedIn() {
    return true;
  }

  public onLogout() {
    console.log("onLogout");
    this.$router.push("/");
  }
}
</script>
